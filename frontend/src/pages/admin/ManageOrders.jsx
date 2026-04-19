import { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';

const API = 'http://localhost:5000/api';
const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLOR = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Processing: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API}/orders`);
        setOrders(data);
      } catch { toast.error('Failed to load orders'); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, orderStatus) => {
    setUpdating(orderId);
    try {
      await axios.put(`${API}/orders/${orderId}/status`, { orderStatus });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus } : o));
      toast.success('Order status updated!');
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to permanently delete this order?')) return;
    try {
      await axios.delete(`${API}/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.success('Order deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString('en-PK')}`;

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-primary-900 mb-1">Manage Orders</h1>
          <p className="text-primary-500 text-sm">{orders.length} total orders</p>
        </div>

        <div className="bg-white border border-surface-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-100">
                <tr className="text-primary-500 text-left">
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Date', 'Status', 'Update'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium uppercase tracking-wider text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-6 bg-surface-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : orders.map((order) => (
                  <tr key={order._id} className="text-primary-700 hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-primary-900 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-primary-900 font-medium">{order.user?.name || 'Unknown'}</p>
                        <p className="text-primary-500 text-xs">{order.user?.email || ''}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">{order.orderItems?.length || 0}</td>
                    <td className="px-4 py-4 font-semibold text-primary-900">{formatPrice(order.totalPrice)}</td>
                    <td className="px-4 py-4">
                      <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : order.paymentStatus === 'Failed' ? 'text-red-600' : 'text-amber-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('en-PK')}</td>
                    <td className="px-4 py-4">
                      <span className={`badge border ${STATUS_COLOR[order.orderStatus] || ''}`}>{order.orderStatus}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <select id={`status-${order._id}`} value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className="bg-white border border-surface-200 text-primary-900 rounded-md focus:ring-gray-500 focus:border-surface-500 block px-2 py-1.5 text-xs cursor-pointer w-28 shadow-sm">
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {updating === order._id ? (
                          <Loader2 size={14} className="animate-spin text-indigo-600 shrink-0" />
                        ) : (
                          <button id={`delete-${order._id}`} onClick={() => handleDeleteOrder(order._id)}
                            className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-100 shrink-0" title="Delete Order">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && orders.length === 0 && (
              <p className="text-center text-primary-500 py-8 text-sm">No orders yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
