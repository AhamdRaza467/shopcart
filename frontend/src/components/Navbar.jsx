import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Zap, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-surface-200 shadow-sm' : 'bg-white border-b border-surface-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-800 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-primary-900/10">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-primary-900 tracking-tight">ShopCart</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2 ml-8">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Shop' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  location.pathname === to
                    ? 'bg-primary-800 text-white shadow-lg shadow-primary-900/30'
                    : 'text-primary-700 hover:bg-primary-50 hover:text-primary-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 group-focus-within:text-primary-800 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-surface-100 border-2 border-surface-200 rounded-xl pl-12 pr-4 py-3 text-sm text-primary-900 placeholder-primary-500 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to="/cart"
              id="cart-btn"
              className="relative p-3 rounded-xl bg-surface-100 border-2 border-surface-200 text-primary-800 hover:bg-primary-800 hover:text-white hover:border-primary-800 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
            >
              <ShoppingCart size={24} strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-xl transition-all duration-300 border-2 border-surface-200 bg-surface-100 shadow-sm hover:shadow-md hover:border-primary-400 hover:bg-white"
                >
                  <div className="w-9 h-9 bg-primary-800 rounded-lg flex items-center justify-center text-white shadow-inner">
                    <span className="text-sm font-bold">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="hidden sm:block text-sm font-bold text-primary-900">{user.name.split(' ')[0]}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-surface-200 rounded-2xl p-1.5 shadow-xl shadow-surface-300/50 animate-fade-in z-50">
                    <div className="px-3 py-3 border-b border-surface-100 mb-1">
                      <p className="text-sm font-bold text-primary-900 truncate">{user.name}</p>
                      <p className="text-xs text-primary-500 truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary-700 hover:text-primary-900 hover:bg-primary-50 rounded-xl transition-colors"
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary-700 hover:text-primary-900 hover:bg-surface-50 rounded-xl transition-colors"
                    >
                      <Package size={16} /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" id="login-nav-btn" className="btn-primary text-sm px-6 py-2.5 ml-2">
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl text-primary-600 hover:text-primary-900 hover:bg-surface-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-2 animate-fade-in border-t border-surface-200">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4 mt-2">
              <div className="relative flex-1 group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-white border-2 border-surface-200 rounded-xl pl-12 pr-4 py-3 text-sm text-primary-900 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 shadow-sm"
                />
              </div>
            </form>
            <div className="flex flex-col gap-1">
              <Link to="/" className="px-4 py-3 rounded-xl text-primary-700 hover:text-primary-900 hover:bg-surface-100 transition-colors font-medium">Home</Link>
              <Link to="/products" className="px-4 py-3 rounded-xl text-primary-700 hover:text-primary-900 hover:bg-surface-100 transition-colors font-medium">Shop All</Link>
              {user && <Link to="/orders" className="px-4 py-3 rounded-xl text-primary-700 hover:text-primary-900 hover:bg-surface-100 transition-colors font-medium">My Orders</Link>}
              {user?.role === 'admin' && <Link to="/admin" className="px-4 py-3 rounded-xl text-primary-800 bg-primary-50 border border-primary-100 font-bold">Admin Panel</Link>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
