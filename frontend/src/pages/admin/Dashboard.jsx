import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Package, DollarSign, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';

const API = 'http://localhost:5000/api';

const STATUS_COLOR = {
  Pending: 'bg-amber-50 text-amber-600 border-amber-200',
  Processing: 'bg-blue-50 text-blue-600 border-blue-200',
  Shipped: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API}/admin/dashboard/stats`);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString('en-PK')}`;

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, Icon: ShoppingBag, color: 'bg-indigo-50', iconColor: 'text-indigo-600', trend: '+12.5%' },
        { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), Icon: DollarSign, color: 'bg-emerald-50', iconColor: 'text-emerald-600', trend: '+8.2%' },
        { label: 'Total Users', value: stats.totalUsers, Icon: Users, color: 'bg-blue-50', iconColor: 'text-blue-600', trend: '+14.1%' },
        { label: 'Total Products', value: stats.totalProducts, Icon: Package, color: 'bg-violet-50', iconColor: 'text-violet-600', trend: '-2.4%' },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-primary-900 tracking-tight">Dashboard</h1>
          <p className="text-primary-500 mt-1">Welcome back, Admin 👋</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white border border-surface-200 rounded-3xl h-32 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map(({ label, value, Icon, color, iconColor, trend }) => (
              <div key={label} className="bg-white border border-surface-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${color} ${iconColor} rounded-2xl flex items-center justify-center`}>
                    <Icon size={22} />
                  </div>
                  <span className={`flex items-center text-xs font-bold ${(trend && trend.startsWith('+')) ? 'text-emerald-600' : 'text-red-500'}`}>
                    {(trend && trend.startsWith('+')) ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                    {trend || ''}
                  </span>
                </div>
                <p className="text-primary-500 text-sm font-medium">{label}</p>
                <p className="font-display text-2xl font-bold text-primary-900 mt-1">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white border border-surface-200 rounded-3xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-100 rounded-xl text-primary-600">
                <Clock size={20} />
              </div>
              <h2 className="font-display text-xl font-bold text-primary-900">Recent Orders</h2>
            </div>
          </div>
          {loading ? (
            <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-surface-100 rounded-lg animate-pulse" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-primary-500 text-left border-b border-surface-100">
                    <th className="pb-3 font-medium uppercase tracking-wider text-xs">Order ID</th>
                    <th className="pb-3 font-medium uppercase tracking-wider text-xs">Customer</th>
                    <th className="pb-3 font-medium uppercase tracking-wider text-xs">Total</th>
                    <th className="pb-3 font-medium uppercase tracking-wider text-xs">Date</th>
                    <th className="pb-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order._id} className="text-primary-700 hover:bg-surface-50 transition-colors">
                      <td className="py-4 font-mono text-xs font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="py-4">{order.user?.name || 'Unknown'}</td>
                      <td className="py-4 font-semibold text-primary-900">{formatPrice(order.totalPrice)}</td>
                      <td className="py-4">{new Date(order.createdAt).toLocaleDateString('en-PK')}</td>
                      <td className="py-4">
                        <span className={`badge border ${STATUS_COLOR[order.orderStatus] || ''}`}>{order.orderStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <p className="text-center text-primary-400 py-8 text-sm">No orders yet</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
