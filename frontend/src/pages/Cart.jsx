import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString('en-PK')}`;
  const shipping = totalPrice >= 2000 ? 0 : 200;
  const grandTotal = totalPrice + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-surface-50">
        <div className="text-center animate-slide-up p-8">
          <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-2">Your cart is empty</h2>
          <p className="text-primary-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Discover our premium collection.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">Shopping Cart</h1>
          <span className="text-primary-500 font-medium">{cartItems.length} items</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-primary-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-primary-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-primary-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-primary-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-primary-900'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="border-t border-surface-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-primary-900 font-medium">Total</span>
                  <span className="font-display text-2xl font-bold text-primary-900">{formatPrice(grandTotal)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-primary-500 text-right mt-1">
                    Add {formatPrice(2000 - totalPrice)} more for free shipping!
                  </p>
                )}
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-primary-400 text-sm">
                <ShieldCheck size={16} />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
