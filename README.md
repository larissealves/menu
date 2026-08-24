
# 🍽️ Menu - Restaurant Menu Management System

**Menu** is a full-stack application designed to manage restaurant menus. It supports the creation, listing, editing, and deletion of dishes, ingredients, and tags. The project includes an admin interface and a public-facing view with filtering features.

Complete application for menu management with a **React + Vite** frontend, **Express + Prisma** backend, and **PostgreSQL (NeonDB)** database.

The project also includes the deployment process and configuration for Render (Backend) and Vercel (Frontend).

> ⚠️ This is a **personal study project** and does **not include any authentication or authorization** flows — neither in the API nor in the admin interface.

> 📌 Personal Notes & Documentation **For updates regarding the project structure, new features, or deployment configurations**, refer to the personal notes / documentation updates folder in the git repository. (https://github.com/larissealves/menu)

## 📁 Project Structure - Resume

```
menu/
├── client/                    # Frontend (React + Vite)
│   ├── public/                
│   ├── src/                   
│   │   ├── pages/             # React pages
│   │   ├── components/        # Reusable components
│   │   ├── assets/            # Frontend assets
│   │   ├ 
│   │   └── styles/
│   │       └── base.css       # Tailwind directives
│   ├── .env                   # Environment variables do client
│   ├── index.html             # Main HTML
│   ├── vite.config.js         # Vite configuration
│   ├── 
│   ├── 
│   └── vercel.json            # Rewrites for React Router
│
├── prisma/
│   ├── schema.prisma          # Prisma database schema
│   └── migrations/            # Migration history
│
├── server/                    # Express backend
│   ├── routes/                
│   ├── 
│   └── index.js               # Server entry point
│
├── .env.development           # Environment variables - development
├── .env.example               # Example environment variables
├── .env.production            # Environment variables - production
├── .env.test                  # Environment variables - test
├── package.json               # Root dependencies and scripts
└── README.md                  # This file
```

## 🧠 Tech Stack

| Layer      | Stack                                        |
|------------|-----------------------------------------------|
| Frontend   | React 19, Vite, TailwindCSS, React Router     |
| Backend    | Express, Prisma ORM, Multer                   |
| Database   | PostgreSQL (NeonDB)                           |
| Hosting    | Render (Backend), Vercel (Frontend)           |

## 🛠️ Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-user/menu.git
cd menu
```

### 2. Install dependencies

```bash
# Root
npm install

# Frontend
cd client
npm install
```

## 🗃️ Database

- Uses **Prisma ORM** with **PostgreSQL** (NeonDB)
- `.env` configuration at the root:

```
DATABASE_URL="postgresql://..."
```
Database schema: https://github.com/larissealves/menu/blob/master/zz_personal%20notes/DATABASE_SCHEMA.md

### Useful Prisma commands:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio
```

## ▶️ Running the Project

### 🖥️ Backend

```bash
# In root
npm run start
```

Access: `http://localhost:5000/api/categories` (or other routes)

### 🌐 Frontend

```bash
cd client
npm run dev
```

Access: `http://localhost:5173`

## 🚀 Deployment

### Frontend (Vercel)

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://<render-url>`

`vercel.json` file for React Router support:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Backend (Render)

- Use the project root (not `client/`)
- Build command: `npm install; npm run build` (or just `npm install`)
- Start command: `npm run start`
- Environment variable: `DATABASE_URL=...`

## 📌 Notes

- All API routes are under `/api/...`
- Frontend and backend are **deployed separately**
- Backend can be tested using Postman or directly from the frontend using `fetch(VITE_API_URL + '/api/...')`

---

# 🚀 Deployment Overview

## 🗄️ Online Database (NeonDB)
- **Type:** PostgreSQL
- **Provider:** NeonDB (https://neon.tech)
- **URL:** Configured via `.env` in the backend
- **Env Variable used:** `DATABASE_URL`

---

## 🛠️ Backend (Render)
- **Provider:** https://render.com
- **URL:** https://menu-backend.onrender.com *(example)*
- **Start Command:** `npm run start`
- **Build Command:** `npm install`
- **Root Directory:** Project root (`/`)
- **Env Vars:**
  - `DATABASE_URL` → PostgreSQL NeonDB URL

---

## 🌐 Frontend (Vercel)
- **Provider:** https://vercel.com
- **URL:** https://menu.vercel.app *(example)*
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Env Vars:**
  - `VITE_API_URL=https://menu-backend.onrender.com`

- **Vercel Routing Fix (for SPA):**  
  File `vercel.json`:

  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/" }
    ]
  }
  ```

---

✅ **Deployment Summary:**

| Layer    | URL                               | Platform   |
|----------|------------------------------------|------------|
| Backend  | https://menu-backend.onrender.com | Render     |
| Frontend | https://menu.vercel.app           | Vercel     |
| Database | PostgreSQL (Neon)                 | NeonDB     |
