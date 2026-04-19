# 🛒 ShopCart — Full-Stack E-Commerce Platform

Pakistan's premier online shopping destination built with React, Node.js, MongoDB, and JazzCash payments.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Payment | JazzCash Mobile Wallet API |
| Icons | Lucide React |

---

## 📁 Project Structure

```
ecommerce/
├── frontend/          # React + Vite app
│   ├── public/
│   │   └── images/products/   # 20 product images
│   └── src/
│       ├── components/        # Navbar, Footer, ProductCard, etc.
│       ├── pages/             # All user & admin pages
│       ├── context/           # AuthContext, CartContext
│       └── App.jsx
├── backend/           # Express API server
│   ├── config/        # MongoDB connection
│   ├── models/        # User, Product, Order, Review
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── middleware/    # Auth & Admin guards
│   └── seed/          # 20 sample products
└── .env               # Environment variables
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+ installed
- MongoDB running locally (or Atlas connection string)

### Step 1: Clone / Open Project

```
cd c:\Users\raora\Desktop\shopcart\ecommerce


### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 5: Seed the Database (20 Products)

Make sure MongoDB is running, then:

```bash
cd backend
npm run seed
```

### Step 6: Create Admin User

Start MongoDB shell or Compass and run:
```javascript
// In MongoDB shell
use shopcart
db.users.updateOne({ email: "admin@shopcart.pk" }, { $set: { role: "admin" } })
```

Or register at `/register` with email `admin@shopcart.pk`, then update role in DB.

### Step 7: Start the Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Step 8: Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 🔗 API Routes

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Products
```
GET    /api/products            (with ?search=, ?category=, ?sort=, ?page=)
GET    /api/products/featured
GET    /api/products/:id
POST   /api/products            (Admin)
PUT    /api/products/:id        (Admin)
DELETE /api/products/:id        (Admin)
POST   /api/products/:id/reviews (Auth)
```

### Orders
```
POST /api/orders/create         (Auth)
GET  /api/orders/myorders       (Auth)
GET  /api/orders                (Admin)
PUT  /api/orders/:id/status     (Admin)
```

### Payment
```
POST /api/payment/jazzcash
```

### Admin
```
GET /api/admin/dashboard/stats  (Admin)
GET /api/admin/users            (Admin)
PUT /api/admin/users/:id/block  (Admin)
```

---

## 💳 JazzCash Integration

The app uses JazzCash Mobile Wallet API (sandbox mode):
- **Sandbox mode** (no real credentials): Uses mock transaction IDs automatically
- **Live mode**: Add your real Merchant ID, Password, and Integrity Salt to `.env`

The secure hash is computed using HMAC-SHA256 as per JazzCash API spec.

---

## 👤 User Roles

| Role | Access |
|------|--------|
| `user` | Browse, add to cart, checkout, view orders, write reviews |
| `admin` | Everything + Admin panel at `/admin` |

---

## 🎨 Features

- ✅ Dark theme with glassmorphism design
- ✅ Auto-advancing hero slider
- ✅ Category filtering + search + sort + pagination
- ✅ Product reviews with star ratings
- ✅ Cart with localStorage persistence
- ✅ Free shipping threshold (Rs. 2,000+)
- ✅ JazzCash Mobile Wallet payment
- ✅ JWT auth stored in localStorage
- ✅ Admin dashboard with revenue stats
- ✅ Admin: Add/Edit/Delete products
- ✅ Admin: Update order status
- ✅ Admin: Block/Unblock users
- ✅ Mobile responsive
- ✅ Loading skeletons

---

## 🌱 Seed Data

20 products across 4 categories:
- **Electronics**: Headphones, Speaker, Smart Watch, Phone Case, USB Hub
- **Clothing**: T-Shirt, Dress, Hoodie, Jeans, Jacket
- **Shoes**: Running, Sneakers, Formal, Sports, Sandals
- **Accessories**: Wallet, Sunglasses, Belt, Cap, Backpack

All prices in Pakistani Rupees (Rs.)
