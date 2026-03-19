# 🎯 Betting Dashboard API

A **production-grade**, multi-role REST API built with **Node.js + Express + MongoDB (Mongoose)**.

Implements full JWT auth with httpOnly cookie rotation, role-based access control, a coin ledger system, and comprehensive security hardening.

---

## 📁 Project Structure

```
src/
├── config/
│   └── db.js                    # MongoDB connection + graceful shutdown
├── controllers/
│   ├── authController.js        # login · logout · refresh · me
│   ├── superAdminController.js  # create-admin · admins · add-coins · block
│   ├── adminController.js       # create-user · users · add-coins · ledger
│   └── userController.js        # profile · coins · ledger
├── middleware/
│   ├── authMiddleware.js        # JWT access-token verification → req.user
│   ├── roleMiddleware.js        # RBAC guards (superAdminOnly, adminAndAbove, userOnly)
│   └── errorMiddleware.js       # Global error handler + 404
├── models/
│   ├── User.js                  # User schema + ROLES enum + bcrypt hooks
│   └── Ledger.js                # Immutable coin transaction ledger
├── routes/
│   ├── authRoutes.js
│   ├── superAdminRoutes.js
│   ├── adminRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── AppError.js              # Operational error class
│   ├── asyncHandler.js          # Eliminates try/catch in controllers
│   ├── apiResponse.js           # ok() · fail() · paginationMeta()
│   ├── generateToken.js         # JWT helpers + cookie setters
│   ├── hashPassword.js          # bcrypt helpers (standalone)
│   ├── validators.js            # Zod schemas + validateBody/validateQuery
│   └── seed.js                  # Bootstrap first superadmin
└── server.js                    # App entry point
```

---

## 🚀 Quick Start

### 1. Install
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/betting_dashboard
JWT_ACCESS_SECRET=<minimum-32-char-random-string>
JWT_REFRESH_SECRET=<different-minimum-32-char-random-string>
```

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Seed the superadmin
```bash
npm run seed
# Custom credentials:
SUPERADMIN_USERNAME=boss SUPERADMIN_PASSWORD=MyStr0ng!Pass npm run seed
```
Default: `username=superadmin` / `password=SuperAdmin@123`

### 4. Run
```bash
npm run dev    # development (nodemon)
npm start      # production
```

---

## 👥 Role Hierarchy

```
superadmin
    └── creates ──► admin
                      └── creates ──► user
```

| Role         | Creates  | Sees                    | Manages Coins     |
|-------------|----------|-------------------------|-------------------|
| superadmin  | admins   | all admins + all users  | admins            |
| admin       | users    | own users only          | own users only    |
| user        | —        | own profile only        | read-only         |

---

## 📡 API Reference

### Auth — `/auth`

| Method | Path            | Auth | Description                              |
|--------|-----------------|------|------------------------------------------|
| POST   | `/auth/login`   | ❌   | Login → sets httpOnly cookie pair        |
| POST   | `/auth/logout`  | ✅   | Clear cookies + invalidate refresh token |
| POST   | `/auth/refresh` | 🍪   | Rotate tokens using refresh cookie       |
| GET    | `/auth/me`      | ✅   | Current user profile                     |

**Login**
```json
POST /auth/login
{ "username": "superadmin", "password": "SuperAdmin@123" }
```

---

### Superadmin — `/superadmin` *(superadmin only)*

| Method | Path                              | Description                   |
|--------|-----------------------------------|-------------------------------|
| POST   | `/superadmin/create-admin`        | Create a new admin            |
| GET    | `/superadmin/admins`              | List all admins (paginated)   |
| PATCH  | `/superadmin/add-coins/:adminId`  | Credit coins to an admin      |
| PATCH  | `/superadmin/block/:id`           | Toggle block/unblock any user |

**Create admin**
```json
POST /superadmin/create-admin
{ "username": "admin1", "password": "Admin@123" }
```

**Add coins**
```json
PATCH /superadmin/add-coins/<adminId>
{ "amount": 500, "reason": "Monthly allocation" }
```

---

### Admin — `/admin` *(admin + superadmin)*

| Method | Path                        | Description                                        |
|--------|-----------------------------|----------------------------------------------------|
| POST   | `/admin/create-user`        | Create a user (auto-assigned to this admin)        |
| GET    | `/admin/users`              | Own users (admin) or all users (superadmin)        |
| PATCH  | `/admin/add-coins/:userId`  | Credit coins — admin restricted to own users       |
| GET    | `/admin/ledger`             | Ledger for own users (admin) or all (superadmin)   |

---

### User — `/user` *(user role only)*

| Method | Path            | Description                      |
|--------|-----------------|----------------------------------|
| GET    | `/user/profile` | Own full profile                 |
| GET    | `/user/coins`   | Live coin balance                |
| GET    | `/user/ledger`  | Personal transaction history     |

---

## 🔑 Authentication Flow

```
Client                                Server
  │                                      │
  ├── POST /auth/login ─────────────────►│
  │   { username, password }             │  verify credentials
  │◄─ 200 + Set-Cookie ─────────────────┤  accessToken (15m) + refreshToken (7d)
  │                                      │  httpOnly, Secure, SameSite
  │                                      │
  ├── GET /user/profile ────────────────►│
  │   [cookie: accessToken] ─────────── │  protect middleware verifies JWT
  │◄─ 200 { user }  ────────────────────┤
  │                                      │
  │   [token expires] ──────────────────►│ 401 TOKEN_EXPIRED
  │                                      │
  ├── POST /auth/refresh ───────────────►│
  │   [cookie: refreshToken]             │  verify + bcrypt match stored hash
  │◄─ 200 + new cookies ────────────────┤  NEW access + rotated refresh token
  │                                      │
  ├── POST /auth/logout ────────────────►│
  │   [cookie: accessToken]              │  clear cookies + null refreshTokenHash
  │◄─ 200 Logged out ───────────────────┤
```

---

## 🔐 Security Architecture

| Concern                   | Implementation                                            |
|---------------------------|-----------------------------------------------------------|
| Password hashing          | bcrypt, 12 salt rounds                                    |
| Access token              | JWT, 15 min, httpOnly cookie                              |
| Refresh token             | JWT, 7 days, bcrypt-hashed in DB, path-scoped cookie      |
| Token rotation            | New refresh token issued on every `/auth/refresh` call    |
| Token reuse detection     | Hash mismatch → full session invalidation                 |
| Security headers          | Helmet.js                                                 |
| Input validation          | Zod — all request bodies and query params                 |
| Rate limiting (global)    | 100 req / 15 min / IP                                     |
| Rate limiting (auth)      | 10 failed attempts / 15 min / IP                          |
| Payload size limit        | 10 KB max body                                            |
| Account blocking          | Invalidates active sessions immediately                   |
| Error sanitization        | Stack traces hidden in production                         |
| Ledger immutability       | Mongoose pre-update hook blocks all mutations             |

---

## 📊 Response Format

**Success**
```json
{
  "success": true,
  "message": "Users retrieved",
  "data": { "users": [...] },
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Error**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "amount", "message": "amount must be positive" }
  ]
}
```

---

## 💰 Ledger Schema

Every coin operation is permanently recorded:

```json
{
  "_id": "...",
  "userId": "ObjectId → User",
  "amount": 100,
  "type": "credit | debit",
  "reason": "Monthly allocation",
  "createdBy": "ObjectId → User",
  "balanceBefore": 200,
  "balanceAfter": 300,
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

Ledger entries are **immutable** — a Mongoose pre-hook throws if any update is attempted.

---

## 🔢 Pagination

All list endpoints accept:
```
?page=1&limit=10    (default: page=1, limit=10, max limit=100)
```

Example:
```
GET /admin/users?page=2&limit=25
GET /admin/ledger?page=1&limit=50
GET /superadmin/admins?page=3&limit=20
```
