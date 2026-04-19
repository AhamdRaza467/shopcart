import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// User Pages
import Home from './pages/Home';
import Products from './pages/Products';
import SingleProduct from './pages/SingleProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderHistory from './pages/OrderHistory';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StripeSuccess from './pages/StripeSuccess';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1e1e35', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
              success: { iconTheme: { primary: '#10b981', secondary: '#1e1e35' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#1e1e35' } },
            }}
          />
          <Routes>
            {/* Admin Routes (no Navbar/Footer) */}
            <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />

            {/* Auth Routes (no Navbar/Footer) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Public Routes (with Navbar/Footer) */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><SingleProduct /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><ProtectedRoute><Checkout /></ProtectedRoute></PublicLayout>} />
            <Route path="/checkout/success" element={<PublicLayout><ProtectedRoute><StripeSuccess /></ProtectedRoute></PublicLayout>} />
            <Route path="/orders" element={<PublicLayout><ProtectedRoute><OrderHistory /></ProtectedRoute></PublicLayout>} />

            {/* 404 */}
            <Route path="*" element={
              <PublicLayout>
                <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-surface-50">
                  <p className="text-8xl font-display font-bold text-primary-900">404</p>
                  <h2 className="text-primary-600 text-2xl font-semibold mb-4">Page Not Found</h2>
                  <Link to="/" className="btn-primary">Go Home</Link>
                </div>
              </PublicLayout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
