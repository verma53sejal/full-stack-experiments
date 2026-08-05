# Secure Post Management System

Full-stack MERN application demonstrating JWT authentication and Role-Based Access Control (RBAC).

Folders:
- `server` — Express + MongoDB backend
- `client` — React (Vite) frontend

Quick start:

1. Copy `.env.example` to `.env` in `server` and fill `MONGO_URI` and `JWT_SECRET`.
2. Start backend:

```
cd server
npm install
npm run dev
```

3. Start frontend:

```
cd client
npm install
npm run dev
```

The backend listens on port from `.env` or 5000.

Prerequisites
-------------
- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)

MongoDB Atlas setup
-------------------
1. Create a free cluster on MongoDB Atlas.
2. Create a database user and whitelist your IP (or allow access from anywhere for testing).
3. Get the connection string and set it in `.env` as `MONGO_URI`.

Environment variables
---------------------
Create `.env` in the `server` folder (copy from `.env.example`) and set:

- `PORT` (optional)
- `MONGO_URI` (MongoDB connection string)
- `JWT_SECRET` (strong random string)
- `SEED_ADMIN_EMAIL` (optional)
- `SEED_ADMIN_PASSWORD` (optional)
- `SEED_ADMIN_NAME` (optional)

Backend installation
--------------------
```
cd server
npm install
```

Create Admin (seed)
-------------------
```
npm run seed
```
This will create an Admin user with the email and password from your `.env` (or defaults in `.env.example`). The script will not create duplicates — if the user exists it will upgrade their role to `Admin`.

Start backend
-------------
```
npm run dev
```
This will print startup checks showing DB and JWT status.

Frontend installation
---------------------
```
cd ../client
npm install
npm run dev
```

Testing JWT authentication
--------------------------
1. Register a user via `/register` (role `Viewer` or `Editor`).
2. Login via `/login` to receive a JWT in the response.
3. The frontend automatically stores the JWT and attaches it to API requests.
4. Session expires in 15 minutes — the navbar shows remaining time and the app logs out when expired.

Testing RBAC
------------
- Admin: full access (create/edit/delete posts, manage users, see analytics)
- Editor: can create and edit posts (cannot delete or manage users)
- Viewer: can only view posts

API Endpoints
-------------
- `GET /api/health` — health check
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `GET /api/auth/profile` — get profile
- `GET /api/posts` — list posts
- `POST /api/posts` — create post
- `PUT /api/posts/:id` — update post
- `DELETE /api/posts/:id` — delete post
- `GET /api/users` — list users (Admin)
- `PUT /api/users/:id/role` — update role (Admin)
- `DELETE /api/users/:id` — delete user (Admin)
- `GET /api/admin/stats` — admin stats (Admin)
- `GET /api/admin/activities` — recent activities (Admin)

Screenshots
-----------
Place screenshots in a `screenshots/` folder and reference them here.

Project architecture
--------------------
- `server/config` — DB connection
- `server/models` — Mongoose models
- `server/controllers` — business logic
- `server/routes` — API routes
- `server/middleware` — auth & role middleware
- `client/src` — React app (components, pages, redux, services)

Features
- JWT Authentication (15m expiry)
- Role-Based Access Control (Admin/Editor/Viewer)
- Admin seeder script to create initial Admin user
- Activity logging and admin analytics
- Frontend: React + Redux, Dark/Light mode, Toasts, Confirmation modals, Session timer

API Endpoints (overview)
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login, returns JWT
- `GET /api/auth/profile` — requires auth
- `GET /api/posts` — list posts
- `POST /api/posts` — create post (Editor/Admin)
- `PUT /api/posts/:id` — update post (Editor/Admin)
- `DELETE /api/posts/:id` — delete post (Admin)
- `GET /api/users` — list users (Admin)
- `PUT /api/users/:id/role` — update role (Admin)
- `DELETE /api/users/:id` — delete user (Admin)
- `GET /api/admin/stats` — admin stats (Admin)
- `GET /api/admin/activities` — recent activities (Admin)

Screenshots
Place screenshots of the app in the `screenshots/` folder and reference them here.

