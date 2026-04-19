import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetUrl('');
    try {
      const { data } = await axios.post(`${API}/auth/forgotpassword`, { email });
      toast.success(data.message);
      
      // We removed mockResetUrl since it uses a real email now!
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-surface-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-surface-200 p-8 sm:p-10 animate-fade-in relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-100 rounded-bl-full -z-10 opacity-50 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-200 rounded-tr-full -z-10 opacity-30 blur-2xl"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <KeyRound size={32} className="text-primary-800" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-900 tracking-tight mb-2">
            Forgot Password?
          </h2>
          <p className="text-primary-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-primary-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

        <div className="mt-8 text-center border-t border-surface-100 pt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
