# User Management Dashboard

A full-stack web application for viewing, adding, editing, and deleting users. Built with **React**, **Express**, **Prisma**, and **SQLite**.

Assignment: [Tacnique JavaScript Basics Assignment](https://docs.google.com/document/d/1hIK0kVTqtEUao9jpKm5Y23Oiot_MCwhLl456hl7rPJw/edit)

## Features

- **CRUD operations** with real database persistence (SQLite)
- **60 users** seeded on first run (10 from JSONPlaceholder + 50 generated)
- **Search, sort, filter, and pagination** (10 / 25 / 50 / 100 per page)
- **Form validation** and API error handling
- **Responsive UI** (table on desktop, cards on mobile)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | SQLite via Prisma ORM |
| HTTP Client | Axios |

## Project Structure

```
user-management-dashboard/
├── src/                 # React frontend
├── server/
│   ├── prisma/          # Database schema
│   └── src/             # Express API + seed script
├── render.yaml          # Deployment config for Render
└── package.json         # Root scripts (runs both frontend & backend)
```

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### Run locally

```bash
cd user-management-dashboard
npm install
npm run db:push
npm run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001/api/users

On first start, the server automatically seeds the database with 60 users.

## Database URL (`DATABASE_URL`)

**Yes, you need a `DATABASE_URL`.** Prisma uses it to connect to the database.

### Local development (already set up)

Your file `server/.env` already has:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
```

| Value | Meaning |
|-------|---------|
| `file:./dev.db` | SQLite database file (stored at `server/prisma/dev.db`) |
| `PORT=3001` | Port for the Express API |

You do **not** need Neon, Supabase, or MongoDB for this project. SQLite is a real database and works for local dev and deployment.

### Production (Render)

`render.yaml` sets `DATABASE_URL=file:./dev.db` automatically when you deploy. You don't need to add it manually on Render unless you change the database.

### Optional: cloud PostgreSQL

If you later want a hosted database (Neon, Supabase, Render Postgres), you would:

1. Create a free Postgres database and copy its connection string, e.g.  
   `postgresql://user:password@host.region.neon.tech/dbname?sslmode=require`
2. Put it in `server/.env` (local) or Render **Environment** tab (production)
3. Change `provider` in `server/prisma/schema.prisma` from `sqlite` to `postgresql`
4. Run `npm run db:push --prefix server`

For this assignment, **SQLite + the existing `DATABASE_URL` is enough.**

### Reset database

```bash
# Delete the database file, then restart
del server\prisma\dev.db
npm run db:push
npm run dev
```

## Deploy to Render (Free)

Render hosts both the frontend and backend as one service.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Add full-stack User Management Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Deploy on Render (manual, free — no Blueprint)

1. Go to [render.com](https://render.com) → **New +** → **Web Service**
2. Connect repo: `raghu26rg/user-management-dashboard`
3. **Instance Type:** Free
4. **Build Command:**

```
npm install --include=dev && npm install --prefix server --include=dev && npm run build:render
```

5. **Start Command:**

```
npm run start
```

6. **Environment variables:**

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `file:./dev.db` |
| `PORT` | `10000` |

7. Click **Create Web Service** and wait for the build

### Step 3 — Submit

Share both links in your assignment:

- GitHub repo: `https://github.com/YOUR_USERNAME/YOUR_REPO`
- Live app: `https://your-app-name.onrender.com`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get one user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/health` | Health check |

## Assumptions

1. **Department** — JSONPlaceholder uses `company.name`; this is stored as `department`.
2. **Name fields** — API `name` is split into `firstName` and `lastName`.
3. **SQLite** — Used for simplicity; data persists locally in `server/prisma/dev.db`.
4. **Seed data** — First 10 users come from JSONPlaceholder; 50 more are generated for demo.

## Challenges & Reflections

1. **JSONPlaceholder doesn't persist** — Moved from mock API to a real SQLite database so add/edit/delete actually save.
2. **Full-stack deployment** — Express serves both the API and the built React app in production.
3. **Data seeding** — Auto-seed on first run avoids manual database setup.

## Future Improvements

- Switch to PostgreSQL for production-scale hosting
- Add user authentication
- Add unit/integration tests
- Add loading skeletons and optimistic updates

## Author

Submission for Tacnique technical assessment.
