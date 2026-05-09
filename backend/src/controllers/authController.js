import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { sendVerificationCode } from "../utils/mailer.js";

export const signup = async (req, res) => {
  const {
    email,
    password,
    business_name,
    phone_number,
    tin_nif,
    trade_register,
    more_details
  } = req.body;

  try {

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const result = await pool.query(
      `
        INSERT INTO users (
          email,
          password,
          business_name,
          phone_number,
          tin_nif,
          trade_register,
          user_type,
          verified,
          more_details,
          verification_code,
          verification
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'user', false, $7, $8, false)
        RETURNING id, email, business_name, phone_number, tin_nif, trade_register, user_type, verified, more_details, created_at, verification
      `,
      [
        email.toLowerCase(),
        hashedPassword,
        business_name,
        phone_number,
        tin_nif,
        trade_register,
        more_details ?? null,
        verificationCode
      ]
    );

    const user = result.rows[0];

    let emailSent = false;

    try {
      await sendVerificationCode(email, verificationCode);
      emailSent = true;
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
    }

    res.status(201).json({
      message: emailSent
        ? "User registered. Please check your email for the verification code."
        : "User registered. Use verification code: " + verificationCode,
      emailSent,
      verificationCode: emailSent ? null : verificationCode,
      user: { email: user.email }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ message: "Email already registered." });
    }
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND verification_code = $2",
      [email, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const user = result.rows[0];

    const updateResult = await pool.query(
      `
        UPDATE users
        SET verified = true, verification_code = NULL
        WHERE id = $1
        RETURNING id, email, business_name, user_type, verified
      `,
      [user.id]
    );

    const verifiedUser = updateResult.rows[0];

    const token = jwt.sign(
      { id: verifiedUser.id, role: verifiedUser.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "23h" }
    );

    res.status(200).json({
      message: "Account verified successfully",
      token,
      user: verifiedUser
    });

  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ message: "Server error during verification" });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query(
      "SELECT id, business_name, verified FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userResult.rows[0].verified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      "UPDATE users SET verification_code = $1 WHERE email = $2",
      [newCode, email]
    );

    let emailSent = false;
    try {
      await sendVerificationCode(email, newCode);
      emailSent = true;
    } catch (emailError) {
      console.error("Resend failed:", emailError.message);
    }

    res.status(200).json({
      message: emailSent
        ? "Verification code resent successfully"
        : "Verification code: " + newCode,
      emailSent,
      verificationCode: emailSent ? null : newCode,
    });

  } catch (error) {
    console.error('Resend Code Error:', error);
    res.status(500).json({ message: "Server error while resending code" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        business_name: user.business_name,
        phone_number: user.phone_number,
        tin_nif: user.tin_nif,
        trade_register: user.trade_register,
        user_type: user.user_type,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const googleLogin = async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) {
    return res.status(400).json({ message: "access_token is required" });
  }

  try {
    const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!googleRes.ok) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { email, name } = await googleRes.json();
    if (!email) {
      return res.status(401).json({ message: "Could not retrieve email from Google" });
    }

    const businessName = name || email.split("@")[0];

    const { rows } = await pool.query(
      `INSERT INTO users (email, password, business_name, verified, verification)
       VALUES ($1, 'GOOGLE_SSO', $2, true, false)
       ON CONFLICT (email) DO UPDATE
         SET verified = true
       RETURNING id, email, business_name, user_type, verified`,
      [email.toLowerCase(), businessName]
    );
    const user = rows[0];

    const token = jwt.sign(
      { id: user.id, role: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        business_name: user.business_name,
        user_type: user.user_type,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error during Google login" });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "currentPassword and newPassword are required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
      [hashed, req.user.id]
    );
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};