# Issue Tracker

Issue Tracker is a full-stack MERN application for managing issues with role-based access, status workflow, filtering, export, and authentication.

## Features

- Authentication
  - Register and login with JWT authentication
  - Password hashing with bcrypt
  - Protected routes and APIs
- Role-based authorization
  - `admin`:
    - View all issues
    - Update issue status only (`open`, `in_progress`, `resolved`, `closed`)
    - Add remark only when resolving/closing
    - Closing requires a remark
    - Delete any issue
  - `user`:
    - Create issues
    - View only own issues
    - Edit own issues only while status is `open`
    - Cannot change status
    - Delete own issues
- Issue management
  - Create, read, update, delete
  - Fields: title, description, issue type, priority, severity, due date, tags
  - Status count cards
  - Search + filter (status, issue type, priority, severity)
  - Pagination
  - Export visible/filtered list to CSV or JSON

## Tech Stack

- Frontend: React + Vite + TypeScript + Zustand + Axios + Tailwind CSS
- Backend: Node.js + Express + Mongoose + JWT + Express Validator
- Database: MongoDB

## Project Structure

```text
.
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── store
│   │   ├── types
│   │   └── utils
│   ├── public
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)

## Dependencies

### Backend dependencies

- `express`
- `mongoose`
- `jsonwebtoken`
- `bcryptjs`
- `cors`
- `dotenv`
- `express-rate-limit`
- `express-validator`
- `morgan`
- Dev: `nodemon`

### Frontend dependencies

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `zustand`
- Dev/build: `vite`, `typescript`, `eslint`, `@vitejs/plugin-react`

## Environment Setup

### 1) Backend env

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/issue_tracker
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

You can copy from:

- `backend/.env.example`

## Installation

From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run (Development)

Open two terminals.

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

App URL: `http://localhost:5173`

## API Overview

Base URL: `/api`

### Auth routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Issue routes

- `GET /issues`
  - Query params: `page`, `limit`, `search`, `status`, `issueType`, `priority`, `severity`, `sortBy`, `sortOrder`
- `GET /issues/:id`
- `POST /issues`
- `PUT /issues/:id`
- `DELETE /issues/:id`
- `GET /issues/export?format=csv|json&search=&status=&issueType=&priority=&severity=&sortBy=&sortOrder=`

## Usage Guide

1. Register a normal user and login.
2. Create issues with required/optional fields.
3. Use search/filter controls to narrow the list.
4. Open issue details to:
   - edit (owner while open)
   - move status (admin)
   - add resolve/close remark (admin)
5. Export the currently filtered list as CSV or JSON.

## Notes

- Public registration creates `user` role accounts.
- Admin account should be created manually in DB.
- Backend rate limiting is enabled on `/api` routes.

## Live Demo

- Frontend (Vercel): [https://issue-tracker-6eij3hn78-bajayasooriya-1119s-projects.vercel.app/](https://issue-tracker-6eij3hn78-bajayasooriya-1119s-projects.vercel.app/)
- Backend API (Render): [https://issuetrackerbackend-8ywo.onrender.com](https://issuetrackerbackend-8ywo.onrender.com)

### Demo Credentials
Admin:
```
Email: admin@demo.com
Password: admin123
```
User:
```
Email: user@demo.com
Password: user123
```