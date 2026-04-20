# 🛒 ShopCart — Full-Stack E-Commerce Platform

project link :  https://shopcart-swart.vercel.app/

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
├── frontend/          # React + Vite frontend application
│   ├── public/
│   │   └── images/    # Static assets and product images
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── pages/      # Route level components
│       ├── context/    # React context (Auth, Cart)
│       └── App.jsx     # Main application entry point
├── backend/           # Express API server
│   ├── config/        # Environment and DB configuration
│   ├── models/        # Mongoose database schemas
│   ├── controllers/   # Route controllers and business logic
│   ├── routes/        # Express route definitions
│   ├── middleware/    # Auth and security guards
│   └── seed/          # Database seeding utilities
└── .env.example       # Example environment variables
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+ installed
- MongoDB instance (Local or Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/AhamdRaza467/shopcart.git
cd shopcart/ecommerce
```

### 2. Environment Configuration

1. Create a `.env` file in the root directory.
2. Copy the contents of `.env.example` into `.env`.
3. Fill in your secure credentials (do not commit this file to version control):

```env
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=your_mongodb_connection_string_here

# Security
JWT_SECRET=your_secure_jwt_secret_here
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_admin_password

# Payment Gateway (JazzCash / Stripe)
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

Install dependencies for both the backend and frontend simultaneously:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Database Seeding

To populate the database with initial categories and product data, run the seed script from the `backend` directory. This will also create the initial admin user based on your `.env` configuration.

```bash
cd backend
npm run seed
```

### 5. Running the Application Locally

You will need two terminal windows to run both servers concurrently.

**Terminal 1 (Backend Server):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 🛡️ Security Best Practices

This project handles user data and payments. Please ensure the following when deploying to production:
- **Never commit your `.env` file**. It is included in `.gitignore` by default.
- Use strong, cryptographically secure random strings for your `JWT_SECRET`.
- Ensure your MongoDB connection string uses restrictive IP whitelisting in production.
- Use HTTPS/SSL for all production environments to secure JWT tokens and payment data in transit.

---

## 💳 Payment Integration

The application integrates payment gateways for processing orders.
- **Development/Sandbox:** Uses test credentials and mock transaction IDs.
- **Production:** Requires real merchant credentials to be securely configured in the production environment variables.
- All secure hashes are computed server-side using HMAC-SHA256.

---

## 👤 User Roles

The system operates on a Role-Based Access Control (RBAC) architecture:

| Role | Access Level |
|------|--------------|
| `user` | Can browse products, manage their cart, execute checkout, view personal order history, and submit product reviews. |
| `admin` | Inherits all user permissions plus access to the secure `/admin` dashboard for managing inventory, orders, and user accounts. |

---

## 🎨 Core Features

- ✅ **Modern UI/UX**: Dark theme with glassmorphism design principles.
- ✅ **Dynamic Filtering**: Category filtering, live search, sorting, and pagination.
- ✅ **Authentication**: Secure JWT-based authentication with local storage persistence.
- ✅ **Shopping Cart**: Persistent cart state management.
- ✅ **Admin Dashboard**: Comprehensive analytics, order management, and user administration.
- ✅ **Responsive**: Fully mobile-responsive layout utilizing Tailwind CSS.
- ✅ **Performance**: Implementation of loading skeletons and optimized asset delivery.
