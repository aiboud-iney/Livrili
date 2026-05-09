# Livrili — Logistics Marketplace Platform

**Academic 2CP Project — Computer Science, 2CP**

A full-stack web application connecting shippers with carriers in Algeria.  
Built as part of a second-year CS project to demonstrate full-stack development skills.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Authentication** | JWT, BCrypt, Google OAuth |
| **Mailing** | Nodemailer (Gmail SMTP) |

## Features

- User registration & login (email verification, Google OAuth)
- Role-based dashboards (user can be carrier and/or shipper, admin)
- Route & shipment posting with filtering and search
- Truck management with photo uploads
- Route-to-shipment assignment system
- Subscription plans (Free / Premium) with payment tracking
- Real-time shipment geolocation tracking
- Admin panel (user verification, audit logs, content moderation)
- Multi-language support (Arabic, French, English)
- Responsive design (mobile-first)

## Project Structure

```
LIVRILI-PRJT2CP/
├── backend/
│   ├── seed.sql                    # Comprehensive test data
│   ├── src/
│   │   ├── controllers/            # Route handlers (12 controllers)
│   │   ├── routes/                 # Express route definitions
│   │   ├── middleware/             # Auth, file upload, validation
│   │   ├── validations/            # Request validation rules
│   │   ├── utils/                  # Mailer, email templates
│   │   └── index.js                # Server entry point
│   └── .env.example
├── frontend/
│   ├── app/                        # Next.js App Router pages
│   ├── components/                 # Reusable UI components
│   ├── contexts/                   # Auth & language providers
│   ├── lib/                        # API client, utilities, mock data
│   └── .env.example
└── database/
    └── livrili-database.sql        # Self-contained database setup
```

## Quick Start

```bash
# 1. Create the database
createdb -U postgres livrili

# 2. Initialize schema
psql -U postgres -d livrili -f database/livrili-database.sql

# 3. Backend
cd backend
cp .env.example .env          # fill in your credentials
npm install
npm start                     # http://localhost:5000

# 4. Frontend
cd frontend
cp .env.example .env          # fill in your credentials
npm install
npm run dev                   # http://localhost:3000
```

For a detailed step-by-step guide, see [INSTALLATION.md](INSTALLATION.md).

## Test Accounts

| Email | Password | Role |
|---|---|---|
| admin@livrili.dz | password | Admin |
| demo@livrili.dz | password | Demo user |

*Run `backend/seed.sql` for 10+ additional test users (password: `Test@123`).*

## Team

| Name                         
|------------------------------|
| Aiboud Ichrak Nour El Yakine | Team Lead - FULL STACK Developer 
| Gaad Abdellah                | Backend Developer 
| Briza Mohamed Fouad          | Backend Developer 
| Boudif Sarah Oumnia          | UI/UX Designer & Frontend Developer 
| Tebbani Rima                 | Frontend Developer & Research 
| Boukhmia Lyna                | UI/UX Designer & Research 

**École Supérieure d'Informatique (ESI)** — 2CP, 2025/2026
