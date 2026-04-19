import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];
export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/users', icon: Users, label: 'Users' },
  ];

  return (
    <div className="bg-primary-900 text-white w-64 min-h-[calc(100vh-5rem)] p-6 shadow-xl shadow-primary-900/10 hidden md:block rounded-r-3xl my-6 ml-4 border border-primary-800 flex flex-col">
      <div className="mb-8 px-4">
        <h2 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">Admin Panel</h2>
        <p className="text-sm text-primary-200">Manage your store</p>
      </div>
      <nav className="space-y-2 flex-1">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-800 text-white shadow-inner shadow-primary-950/50 border border-primary-700'
                  : 'text-primary-300 hover:bg-primary-800/50 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-accent-400' : 'text-primary-400 group-hover:text-primary-300 transition-colors'} strokeWidth={isActive ? 2 : 1.5} />
              <span className="font-medium text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats Widget inside sidebar */}
      <div className="mt-8 mb-6 p-4 bg-primary-800/50 rounded-2xl border border-primary-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-primary-400 uppercase">System</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <p className="text-sm text-primary-200">All services are running smoothly.</p>
      </div>

      <div className="border-t border-primary-800 pt-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-primary-300 hover:text-white hover:bg-primary-800/50 transition-colors font-medium text-sm"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
