import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,rgba(241,245,249,0.8)_0%,rgba(248,250,252,1)_100%)] z-0" />
      </div>

      <div className="w-full max-w-[400px] animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 bg-surface-900 rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/10 transition-transform group-hover:scale-105">
              <Zap size={24} className="text-white" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-primary-900 mb-2">Welcome back</h1>
          <p className="text-primary-500">Sign in to your account to continue</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-primary-700 text-sm font-medium mb-1.5 block">Email Address</label>
              <input id="email-input" type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="input-field" required autoFocus />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-primary-700 text-sm font-medium block">Password</label>
                <Link to="/forgot-password" className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input id="password-input" type={showPass ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="input-field pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button id="login-submit-btn" type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-primary-500 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-900 font-semibold hover:underline underline-offset-4 transition-all">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 text-center">
          <p className="text-primary-400 text-xs mb-1">Demo Credentials</p>
          <p className="text-primary-500 text-xs font-mono">admin@shopcart.pk / admin123</p>
        </div>
      </div>
    </div>
  );
}
