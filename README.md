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

---

*Built using MERN Stack · MedChain B2B Platform*
