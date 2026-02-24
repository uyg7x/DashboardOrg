# 🚀 dashboardOrg

**dashboardOrg** is a modern **Organization Dashboard & Internal Management System** built to help teams manage day-to-day operations from one place. It centralizes workflows like **employee records**, **tickets/requests**, and **admin controls**, so nothing gets lost across chats, spreadsheets, or scattered tools.

---

## ✨ Features

* ✅ Secure Login (Admin/User)
* ✅ Dashboard with quick navigation
* ✅ Employee Management (Create / View / Update / Delete)
* ✅ Ticket / Request Raise + Tracking *(if included)*
* ✅ Responsive UI

---

## 🧰 Tech Stack

* **Backend:** Python (Flask/FastAPI)
* **Database:** MongoDB (Local / Atlas)
* **Frontend:** HTML, CSS, JavaScript (Bootstrap if used)

---

## 🧩 Required Tools (Install These First)

### 1) Install Git

Download & install Git, then confirm:

```bash
git --version
```

### 2) Install Python (3.10+ recommended)

Confirm:

```bash
python --version
```

### 3) Install MongoDB

Confirm:

```bash
mongosh
```

### 4) Install VS Code

Recommended editor for this project.

---

## 🧩 VS Code Extensions (Recommended)

> Open VS Code → **Extensions** (Ctrl+Shift+X) → search & install these:

### ✅ Must-have (Python backend)

* **Python** (by Microsoft)
* **Pylance** (by Microsoft)
* **Python Debugger** (by Microsoft) *(often comes with Python extension)*

### ✅ Recommended (code quality)

* **ESLint** *(if you use JavaScript heavily)*
* **Prettier - Code formatter**
* **EditorConfig for VS Code**

### ✅ Recommended (web + templates)

* **HTML CSS Support**
* **Live Server** *(useful for static frontend — optional if backend renders pages)*

### ✅ Recommended (database)

* **MongoDB for VS Code** (by MongoDB)

### ✅ Optional (developer productivity)

* **GitLens — Git supercharged**
* **DotENV** *(highlights .env files)*

---

## ⚙️ Setup & Installation

### 1) Clone the repository

```bash
git clone https://github.com/uyg7x/DashboardOrg.git
cd DashboardOrg
```

### 2) Create virtual environment

```bash
python -m venv .venv
```

**Activate (Windows PowerShell)**

```bash
.venv\Scripts\Activate.ps1
```

**Activate (Mac/Linux)**

```bash
source .venv/bin/activate
```

### 3) Install dependencies

```bash
pip install -r backend/requirements.txt
```

---

## 🔐 Environment Variables

Create `.env` inside `backend/`:

```env
PORT=5000
SECRET_KEY=your_secret_key_here
MONGO_URI=mongodb://localhost:2701x/dashboardOrg
```

✅ Never upload your real `.env` file to GitHub. Use `.env.example`.

---

## ▶️ Run the Project

### Start backend

**Flask**

```bash
python backend/app/main.py
# or
flask run
```

**FastAPI**

```bash
uvicorn backend.app.main:app --reload
```

### Open in browser

* `http://localhost:5000` (or your PORT)

---

## 🛡️ Security Notes

* Don’t commit `.env`
* Keep MongoDB credentials private
* Use strong SECRET_KEY

---

## 👤 Author

**PJY | **
