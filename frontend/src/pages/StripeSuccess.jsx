import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '/api';

export default function StripeSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMsg, setErrorMsg] = useState('');
  
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMsg('No session ID found.');
      return;
    }

    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const verifyAndCreateOrder = async () => {
      try {
        // 1. Verify payment with backend
        const { data: verifyData } = await axios.get(`${API}/payment/stripe/verify-session/${sessionId}`);
        
        if (!verifyData.success) {
          throw new Error('Payment verification failed.');
        }

        // 2. Create the Order
        const addressStr = localStorage.getItem('shippingAddress');
        const address = addressStr ? JSON.parse(addressStr) : null;
        
        if (!address) {
          throw new Error('Shipping address lost. Please contact support.');
        }

        const shipping = totalPrice >= 2000 ? 0 : 200;
        const grandTotal = totalPrice + shipping;

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
          paymentMethod: 'Stripe',
          stripeSessionId: sessionId,
          paymentStatus: 'Paid', // Since Stripe verified it
        }, config);

        // 3. Clean up
        clearCart();
        localStorage.removeItem('shippingAddress');
        setStatus('success');
        
        // Redirect after a few seconds
        setTimeout(() => {
          navigate('/orders');
        }, 4000);

      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorMsg(err.response?.data?.message || err.message || 'An error occurred while verifying your order.');
      }
    };

    if (user && cartItems.length > 0) {
      verifyAndCreateOrder();
    } else if (!user) {
      setStatus('error');
      setErrorMsg('Please log in to view your order.');
    } else if (cartItems.length === 0 && status === 'verifying') {
      // If cart is empty, it means we already cleared it (likely a refresh). 
      // Just redirect to orders.
      navigate('/orders');
    }
  }, [sessionId, user, cartItems, totalPrice, clearCart, navigate, status]);

  return (
    <div className="min-h-screen pt-20 bg-surface-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-surface-200 p-8 text-center animate-slide-up">
        
        {status === 'verifying' && (
          <div className="py-8">
            <Loader2 size={48} className="animate-spin text-primary-500 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-primary-900 mb-2">Verifying Payment...</h2>
            <p className="text-primary-500">Please wait while we confirm your transaction with Stripe. Do not close this page.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <h2 className="font-display text-3xl font-bold text-primary-900 mb-4">Payment Successful!</h2>
            <p className="text-primary-600 mb-8">
              Thank you for your purchase. Your order has been placed and is being processed. You will be redirected shortly...
            </p>
            <Link to="/orders" className="btn-primary w-full inline-block py-3">
              View My Orders
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary-900 mb-4">Verification Failed</h2>
            <p className="text-primary-600 mb-8">{errorMsg}</p>
            <Link to="/checkout" className="btn-primary w-full inline-block py-3">
              Return to Checkout
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
