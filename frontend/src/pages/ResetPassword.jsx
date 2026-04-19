import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Lock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // If we wanted to auto-login, but let's just redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const { data } = await axios.put(`${API}/auth/resetpassword/${token}`, { password });
      toast.success(data.message || 'Password reset successful!');
      setSuccess(true);
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-surface-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-surface-200 p-8 sm:p-10 text-center animate-slide-up">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-900 mb-4">
            Password Reset!
          </h2>
          <p className="text-primary-600 mb-8">
            Your password has been changed successfully. You will be redirected to the login page momentarily.
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            Go to Login <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-surface-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-surface-200 p-8 sm:p-10 animate-fade-in relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-100 rounded-bl-full -z-10 opacity-50 blur-2xl"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock size={32} className="text-primary-800" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-900 tracking-tight mb-2">
            Create New Password
          </h2>
          <p className="text-primary-500">
            Please enter your new strong password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pl-11"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base mt-4"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
