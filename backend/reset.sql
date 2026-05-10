BEGIN TRANSACTION;

TRUNCATE audit_logs, notifications, user_subscriptions, assignments,
         shipments, routes, trucks, users, plans RESTART IDENTITY CASCADE;

INSERT INTO plans (id, name, description, price, duration_days, is_premium, created_at)
VALUES
  (1, 'Free',    'Up to 5 combined posts (shipments + routes)',    0,    0,  false, NOW()),
  (2, 'Premium', 'Unlimited posts, priority support',           60000, 30,  true, NOW());

SELECT setval('plans_id_seq', 2, true);

INSERT INTO users (email, password, business_name, user_type, verified, verification, verification_status)
VALUES (
  'livrili.team@gmail.com',
  '$2b$10$8rm.mS0zGbr0Mez.CVEm6ucxOxGO8Ykpk.tBn3Uw8GxNCCr9caViq',
  'Livrili Admin',
  'admin',
  true,
  true,
  'verified'
);

COMMIT;
