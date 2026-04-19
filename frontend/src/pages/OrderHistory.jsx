import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLOR = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Processing: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const PAYMENT_COLOR = {
  Paid: 'text-emerald-600',
  Pending: 'text-amber-600',
  Failed: 'text-red-600',
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString('en-PK')}`;
  const formatDate = (d) => new Date(d).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-surface-50">
      <div className="w-10 h-10 border-2 border-surface-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-surface-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-100 shadow-sm">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-primary-900 font-semibold text-xl mb-2">No orders yet</h3>
            <p className="text-primary-500 text-sm">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-surface-100 shadow-sm overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="p-5 flex flex-wrap items-center gap-4 justify-between cursor-pointer hover:bg-surface-50 transition-colors"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <div>
                    <p className="text-primary-500 text-xs mb-1 uppercase tracking-wider">Order ID</p>
                    <p className="text-primary-900 font-mono text-sm font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-primary-500 text-xs mb-1 uppercase tracking-wider">Date</p>
                    <p className="text-primary-900 text-sm font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-primary-500 text-xs mb-1 uppercase tracking-wider">Total</p>
                    <p className="text-primary-900 font-bold">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-primary-500 text-xs mb-1 uppercase tracking-wider">Payment</p>
                    <p className={`text-sm font-medium ${PAYMENT_COLOR[order.paymentStatus]}`}>{order.paymentStatus}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge border ${STATUS_COLOR[order.orderStatus]}`}>{order.orderStatus}</span>
                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center">
                      {expanded === order._id ? <ChevronUp size={16} className="text-primary-600" /> : <ChevronDown size={16} className="text-primary-600" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded === order._id && (
                  <div className="border-t border-surface-100 p-6 animate-fade-in bg-surface-50/50">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Items */}
                      <div>
                        <h4 className="text-primary-500 text-xs font-semibold uppercase tracking-wider mb-4">Order Items</h4>
                        <div className="space-y-4">
                          {order.orderItems.map((item, i) => (
                            <div key={i} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-surface-100">
                              <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-50 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-primary-900 text-sm font-medium line-clamp-1">{item.name}</p>
                                <p className="text-primary-500 text-xs mt-1">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                              <p className="text-primary-900 text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping */}
                      <div>
                        <h4 className="text-primary-500 text-xs font-semibold uppercase tracking-wider mb-4">Shipping Details</h4>
                        <div className="bg-white p-4 rounded-xl border border-surface-100 space-y-2 text-sm">
                          <p className="text-primary-900 font-medium">{order.shippingAddress.fullName}</p>
                          <p className="text-primary-600">{order.shippingAddress.address}</p>
                          <p className="text-primary-600">{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
                          <p className="text-primary-600">{order.shippingAddress.phone}</p>
                        </div>
                        {order.jazzCashTransactionId && (
                          <div className="mt-4 bg-white p-4 rounded-xl border border-surface-100">
                            <p className="text-primary-500 text-xs uppercase tracking-wider mb-1">Transaction ID</p>
                            <p className="text-primary-900 text-sm font-mono">{order.jazzCashTransactionId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
