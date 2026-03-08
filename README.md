# 🏥 MedChain B2B — Multi-Medical eCommerce Platform

A full-stack **MERN** (MongoDB · Express · React · Node.js) B2B medical platform with **role-based access control**, separate dashboards per role, live data, and a complete REST API.

---

## 📁 Project Structure

```
medchain/
├── backend/                    ← Node.js + Express REST API
│   ├── config/
│   │   ├── db.js               ← MongoDB connection
│   │   └── seed.js             ← Database seeder
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── store.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── staff.controller.js
│   │   ├── prescription.controller.js
│   │   ├── inventory.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   └── auth.js             ← JWT protect + role authorize
│   ├── models/
│   │   ├── User.js
│   │   ├── Store.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Staff.js
│   │   └── Prescription.js
│   ├── routes/                 ← All Express routes
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/                   ← React.js SPA
│   ├── public/index.html
│   └── src/
│       ├── api/index.js        ← Axios instance + all API calls
│       ├── context/
│       │   └── AuthContext.js  ← JWT auth state
│       ├── components/
│       │   ├── common/index.js ← Shared UI components
│       │   └── layouts/
│       │       └── DashboardLayout.js
│       ├── pages/
│       │   ├── auth/LoginPage.js
│       │   └── dashboard/
│       │       ├── super-admin/   👑 Full platform control
│       │       ├── store-owner/   🏪 Inventory, orders, staff, sales
│       │       ├── pharmacist/    💊 Stock, prescriptions
│       │       └── distributor/   🚚 Dispatch, clients, catalog
│       ├── App.js              ← Routes + role-based rendering
│       └── index.js
│
├── package.json                ← Root convenience scripts
└── README.md
```

---

## 🚀 Setup & Run

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://cloud.mongodb.com))
- **npm** v9+

---

### Step 1 — Clone & Install

```bash
# Install all dependencies (backend + frontend)
npm run install:all
```

Or manually:
```bash
cd backend  && npm install
cd ../frontend && npm install
```

---

### Step 2 — Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medchain
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

> For **MongoDB Atlas**: Replace `MONGO_URI` with your Atlas connection string.

---

### Step 3 — Seed the Database

```bash
npm run seed
```

This creates sample stores, products, orders, prescriptions, and **4 demo user accounts**.

---

### Step 4 — Run the App

```bash
# Terminal 1 — Backend (port 5000)
npm run dev:backend

# Terminal 2 — Frontend (port 3000)
npm run dev:frontend
```

Or run both simultaneously:
```bash
npm run dev
```

Open → **http://localhost:3000**

---

## 🔑 Demo Login Credentials

All accounts use password: `Password@123`

| Role | Email | Portal Access |
|------|-------|--------------|
| 👑 **Super Admin** | `admin@medchain.in` | Full platform control |
| 🏪 **Store Owner** | `priya@apollomed.in` | Apollo Medical Store |
| 💊 **Pharmacist** | `kavita@lifeline.in` | Lifeline Pharmacy |
| 🚚 **Distributor** | `sunita@healthdist.in` | HealthFirst Distributors |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| POST | `/api/auth/register` | Super Admin only |

### Stores
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/stores` | Admin, Distributor |
| POST | `/api/stores` | Admin |
| PATCH | `/api/stores/:id/status` | Admin |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | All roles |
| POST | `/api/products` | Admin, Distributor |
| PUT | `/api/products/:id` | Admin, Distributor |
| DELETE | `/api/products/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/orders` | All (filtered by role) |
| POST | `/api/orders` | Admin, Store Owner |
| PATCH | `/api/orders/:id/status` | Admin, Distributor |

### Staff
| Method | Endpoint | Access |
|--------|----------|--------|
| GET/POST | `/api/staff` | Admin, Store Owner |
| PUT/DELETE | `/api/staff/:id` | Admin, Store Owner |

### Prescriptions
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/prescriptions` | Admin, Pharmacist |
| POST | `/api/prescriptions` | Pharmacist |
| PATCH | `/api/prescriptions/:id/verify` | Pharmacist, Admin |

### Dashboard (aggregated stats)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/dashboard/super-admin` | Super Admin |
| GET | `/api/dashboard/store-owner` | Store Owner |
| GET | `/api/dashboard/pharmacist` | Pharmacist |
| GET | `/api/dashboard/distributor` | Distributor |

---

## 🧑‍💻 Role Permissions

| Permission | Super Admin | Store Owner | Pharmacist | Distributor |
|-----------|:-----------:|:-----------:|:----------:|:-----------:|
| Manage All Stores | ✅ | ❌ | ❌ | ❌ |
| Product Catalog | ✅ | View | ❌ | ✅ |
| Place B2B Orders | ✅ | ✅ | ❌ | ❌ |
| View Analytics | ✅ | Own Store | ❌ | Own Data |
| Staff Management | ✅ | ✅ | ❌ | ❌ |
| User & Role Mgmt | ✅ | ❌ | ❌ | ❌ |
| Inventory Control | ✅ | ✅ | View | ✅ |
| Dispatch Orders | ❌ | ❌ | ❌ | ✅ |
| Prescriptions | ❌ | ❌ | ✅ | ❌ |

---

## 🛠 Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose ODM
- JWT Authentication (jsonwebtoken)
- bcryptjs (password hashing)
- CORS, Morgan, dotenv

**Frontend**
- React.js 18 (Create React App)
- React Router v6
- Axios (API calls + interceptors)
- React Hot Toast (notifications)
- Custom component library (no UI framework)

---

## 🔐 Security Features
- JWT tokens with expiry
- Bcrypt password hashing (10 rounds)
- Route-level role authorization middleware
- Auto 401 redirect on expired tokens
- Input validation on all API routes

---

## 📦 Extending the Project

To add new features:
1. **New model** → `backend/models/`
2. **Controller** → `backend/controllers/`
3. **Route** → `backend/routes/` + register in `server.js`
4. **API call** → `frontend/src/api/index.js`
5. **UI component** → relevant dashboard page

---

*Built with ❤️ using MERN Stack · MedChain B2B Platform*
