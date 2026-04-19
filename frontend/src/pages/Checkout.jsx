import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Smartphone, CheckCircle, Loader2, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const initialAddress = { fullName: '', phone: '', address: '', city: '', province: '', postalCode: '' };

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString('en-PK')}`;
  const shipping = totalPrice >= 2000 ? 0 : 200;
  const grandTotal = totalPrice + shipping;

  const handleAddressChange = (e) => setAddress((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validateAddress = () => {
    for (const [k, v] of Object.entries(address)) {
      if (!v.trim()) { toast.error(`Please fill in: ${k}`); return false; }
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;
    if (cartItems.length === 0) return toast.error('Cart is empty');

    setLoading(true);
    try {
      if (paymentMethod === 'Stripe') {
        const { data } = await axios.post(`${API}/payment/stripe/create-checkout-session`, {
          orderItems: cartItems,
          shippingFee: shipping,
        });
        localStorage.setItem('shippingAddress', JSON.stringify(address));
        window.location.href = data.url;
      } else {
        const orderItems = cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item._id,
        }));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.post(`${API}/orders/create`, {
          orderItems,
          shippingAddress: address,
          totalPrice: grandTotal,
          paymentMethod: 'COD',
        }, config);
        clearCart();
        toast.success('Order placed successfully! 🎉');
        navigate('/orders');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handlePayment} className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-100 shadow-sm">
              <h2 className="font-semibold text-primary-900 text-lg mb-6 flex items-center gap-2 pb-4 border-b border-surface-100">
                <MapPin size={20} className="text-primary-400" /> Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { name: 'fullName', label: 'Full Name', placeholder: 'Muhammad Ali', colSpan: false },
                  { name: 'phone', label: 'Phone Number', placeholder: '03001234567', colSpan: false },
                  { name: 'address', label: 'Street Address', placeholder: 'House #, Street, Area', colSpan: true },
                  { name: 'city', label: 'City', placeholder: 'Karachi', colSpan: false },
                  { name: 'province', label: 'Province', placeholder: 'Sindh', colSpan: false },
                  { name: 'postalCode', label: 'Postal Code', placeholder: '75500', colSpan: false },
                ].map(({ name, label, placeholder, colSpan }) => (
                  <div key={name} className={colSpan ? 'sm:col-span-2' : ''}>
                    <label className="text-primary-700 text-sm font-medium mb-1.5 block">{label}</label>
                    <input id={`field-${name}`} name={name} value={address[name]} onChange={handleAddressChange}
                      placeholder={placeholder} className="input-field" required />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-100 shadow-sm">
              <h2 className="font-semibold text-primary-900 text-lg mb-6 flex items-center gap-2 pb-4 border-b border-surface-100">
                <Smartphone size={20} className="text-primary-400" /> Payment Method
              </h2>
              
              <div className="space-y-4">
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary-600 bg-primary-50' : 'border-surface-200 hover:border-primary-300'}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-5 h-5 text-primary-600 focus:ring-primary-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-primary-900">Cash on Delivery (COD)</p>
                    <p className="text-sm text-primary-500">Pay securely when the package arrives.</p>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Stripe' ? 'border-primary-600 bg-primary-50' : 'border-surface-200 hover:border-primary-300'}`}>
                  <input type="radio" name="payment" value="Stripe" checked={paymentMethod === 'Stripe'} onChange={() => setPaymentMethod('Stripe')} className="w-5 h-5 text-primary-600 focus:ring-primary-500" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-primary-900">Credit / Debit Card</p>
                      <div className="flex gap-2">
                        <div className="w-10 h-6 bg-blue-100 text-blue-800 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                        <div className="w-10 h-6 bg-orange-100 text-orange-800 rounded flex items-center justify-center text-[10px] font-bold">MC</div>
                      </div>
                    </div>
                    <p className="text-sm text-primary-500">Powered securely by Stripe Checkout.</p>
                  </div>
                </label>
              </div>
            </div>

            <button id="pay-now-btn" type="submit" disabled={loading || cartItems.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg">
              {loading ? (
                <><Loader2 size={22} className="animate-spin" /> Processing...</>
              ) : (
                <><CheckCircle size={22} /> {paymentMethod === 'Stripe' ? 'Pay with Stripe' : 'Place Order'} - {formatPrice(grandTotal)}</>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm sticky top-24">
              <h3 className="font-semibold text-primary-900 text-lg mb-5 flex items-center gap-2 pb-4 border-b border-surface-100">
                <ShoppingBag size={18} className="text-primary-400" /> Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-50 border border-surface-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-primary-900 text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-primary-500 text-xs mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-primary-900 text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-100 pt-5 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-primary-500">Subtotal</span><span className="text-primary-900 font-medium">{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-primary-500">Shipping</span><span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'text-primary-900 font-medium'}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between items-end pt-3 border-t border-surface-100 mt-2">
                  <span className="text-primary-900 font-medium">Total</span>
                  <span className="font-display text-2xl font-bold text-primary-900">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
