# Installation Guide — Livrili

## Prerequisites

Make sure the following are installed on your machine:

- **Node.js** >= 18 ([download](https://nodejs.org/))
- **PostgreSQL** >= 14 ([download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

---

## Step 1: Database Setup

### 1.1 Create the database

Open a terminal and run:

```bash
createdb -U postgres livrili
```

If prompted, enter your PostgreSQL password.

### 1.2 Apply the schema

```bash
psql -U postgres -d livrili -f database/livrili-database.sql
```

This creates all tables, enums, indexes, views, and seeds initial data (plans, admin user, demo user).

### 1.3 (Optional) Load full test data

```bash
cd backend
npm install
npm run seed
```

This inserts 17 users, 22 trucks, 34 routes, and 34 shipments.

---

## Step 2: Backend Setup

### 2.1 Navigate to the backend directory

```bash
cd backend
```

### 2.2 Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your own values:

| Variable | Example | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `livrili` | Database name |
| `DB_USER` | `postgres` | Database username |
| `DB_PASSWORD` | `your_password` | Database password |
| `JWT_SECRET` | `livrili_secret_key_2024` | Secret key for JWT tokens |
| `PORT` | `5000` | Server port |
| `GMAIL_USER` | `your_email@gmail.com` | Gmail address for sending emails |
| `GMAIL_APP_PASS` | `your_app_password` | Gmail app password |
| `GOOGLE_CLIENT_ID` | `your_client_id` | Google OAuth client ID |

### 2.3 Install dependencies

```bash
npm install
```

### 2.4 Start the server

```bash
npm start
```

The backend runs at **http://localhost:5000**.

---

## Step 3: Frontend Setup

### 3.1 Navigate to the frontend directory

```bash
cd frontend
```

### 3.2 Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Example | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | Backend API base URL |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:5000` | Backend server URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your_client_id` | Google OAuth client ID |

### 3.3 Install dependencies

```bash
npm install
```

### 3.4 Start the development server

```bash
npm run dev
```

The frontend runs at **http://localhost:3000**.

---

## Step 4: Verify It Works

1. Open **http://localhost:3000** in your browser
2. Log in with the demo account:
   - Email: `demo@livrili.dz`
   - Password: `password`
3. Browse routes, shipments, and the dashboard

---

## Troubleshooting

### "Cannot find module 'bcrypt'"
```bash
cd backend
npm install bcrypt
```

### "Connect ECONNREFUSED" (database)
Ensure PostgreSQL is running. On Windows:
```bash
net start postgresql-x64-14
```
(Replace `14` with your PostgreSQL version.)

### "database 'livrili' does not exist"
```bash
createdb -U postgres livrili
```

### Port already in use
- Backend default: `5000` — change `PORT` in `backend/.env`
- Frontend default: `3000` — run `npm run dev -- -p 3001`
