# 🚀 DashboardOrg — Organization Dashboard API (Node.js + MongoDB)

DashboardOrg is a backend API designed as an **internal dashboard for organizations** with **Admin & Employee** access. It provides a modular set of HR/ops endpoints (auth, users, tasks, tickets, attendance, payroll, performance, documents, assets, notifications, audit logs, etc.). ([GitHub][1])

---

## ✨ Highlights

* **Role-based access** (Admin / Employee) ([GitHub][1])
* **JWT authentication** (login returns a token) ([GitHub][2])
* **MongoDB + Mongoose** connection ([GitHub][3])
* **Modular routes** for multiple org features ([GitHub][3])
* **Optional email reset** (logs email if SMTP not configured) ([GitHub][4])
* Serves uploaded files from `/uploads` ([GitHub][3])

---

## 🧰 Tech Stack

* Node.js (ES Modules)
* Express
* MongoDB (Mongoose)
* dotenv, cors ([GitHub][5])

---

## ✅ Requirements

* Node.js (LTS recommended)
* MongoDB (Local) **or** MongoDB Atlas connection string
* Git (optional)

---

## ⚙️ Quick Start

### 1) Clone

```bash
git clone https://github.com/uyg7x/DashboardOrg.git
cd DashboardOrg
```

### 2) Install dependencies

```bash
npm install
```

> If you see errors like **"Cannot find package jsonwebtoken/bcryptjs/nodemailer"**, install them:

```bash
npm i jsonwebtoken bcryptjs nodemailer multer
```

(These are used in auth + mailer utilities.) ([GitHub][2])

### 3) Set environment variables

Create `.env` in the project root (copy `.env.example`):

```bash
# Windows PowerShell
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Example `.env`:

```env
PORT=5000
MONGO_URI=___url
JWT_SECRET=change_this_to_a_long_random_secret

# Optional (only if you want password-reset emails to send)
APP_URL=http://localhost:5173
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

`.env.example` exists in the repo and includes the required variables. ([GitHub][1])

### 4) Run

```bash
npm run dev
# or
npm start
```

Scripts are defined in `package.json`. ([GitHub][5])

---

## 🔧 Important: Fix the Route Import Path (1-minute fix)

Your `server.js` currently imports routes from `./src/routes/...` ([GitHub][3])
…but in the repo, folders are at the root: `routes/`, `models/`, `middleware/`, `utils/`. ([GitHub][1])

Choose **one**:

### Option A (Recommended): Move folders into `src/`

Create `src/` and move:

* `routes/` → `src/routes/`
* `models/` → `src/models/`
* `middleware/` → `src/middleware/`
* `utils/` → `src/utils/` ([GitHub][1])

### Option B: Edit `server.js` imports

Change:

* `./src/routes/...` → `./routes/...` ([GitHub][3])

---

## 🧪 Health Check

Once running:

* `GET /` → `{ ok: true, service: "GITHRF HR API" }` ([GitHub][3])

---

## 🔐 Authentication Flow

### Create the admin (one-time)

`POST /api/auth/register-admin-once` ([GitHub][2])

Body:

```json
{
  "email": "admin@example.com",
  "password": "Admin@123",
  "fullName": "Admin User"
}
```

### Login

`POST /api/auth/login` returns a JWT token. ([GitHub][2])

Use it on protected routes:

```
Authorization: Bearer <TOKEN>
```

---

## 🧭 API Routes (Main)

Registered in `server.js`: ([GitHub][3])

* `/api/auth`
* `/api/users`
* `/api/org`
* `/api/analytics`
* `/api/meetings`
* `/api/tasks`
* `/api/announcements`
* `/api/chat`
* `/api/community`
* `/api/news`
* `/api/audit`
* `/api/notifications`
* `/api/presence`
* `/api/attendance`
* `/api/leaves`
* `/api/payroll`
* `/api/performance`
* `/api/documents`
* `/api/assets`
* `/api/tickets`

---

## 📁 Project Structure

Current repo layout: ([GitHub][1])

```text
DashboardOrg/
├─ middleware/
├─ models/
├─ routes/
├─ utils/
├─ .env.example
├─ .gitignore
├─ package.json
├─ server.js
└─ README.md
```

---

## 🔐 Security Notes (Important)

✅ Safe to commit:

* code, `package.json`, `.env.example`, `.gitignore`

❌ Never commit:

* `.env` (secrets)
* `node_modules/`
* real user data / DB dumps
* sensitive files in `uploads/`

---

## 📄 License

MIT ([GitHub][1])

---

## 👤 Author

PJY | 

[1]: https://github.com/uyg7x/DashboardOrg "GitHub - uyg7x/DashboardOrg: designed as an internal dashboard for organizations. It provides secure Admin and Employee logins with role-based access, allowing admins to manage employee profiles and view organization insights while employees access only their own workspace"
[2]: https://raw.githubusercontent.com/uyg7x/DashboardOrg/main/routes/auth.routes.js "raw.githubusercontent.com"
[3]: https://raw.githubusercontent.com/uyg7x/DashboardOrg/main/server.js "raw.githubusercontent.com"
[4]: https://raw.githubusercontent.com/uyg7x/DashboardOrg/main/utils/mailer.js "raw.githubusercontent.com"
[5]: https://raw.githubusercontent.com/uyg7x/DashboardOrg/main/package.json "raw.githubusercontent.com"
