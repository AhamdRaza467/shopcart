import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Share2, MessageCircle, Camera, Play } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-50 border-t border-surface-200 mt-20 text-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-surface-900 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-primary-900 tracking-tight">ShopCart</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Pakistan's premier online shopping destination. Curated products, minimal design, and fast delivery.
            </p>
            <div className="flex gap-4">
              {[Share2, MessageCircle, Camera, Play].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white border border-surface-200 hover:border-surface-300 rounded-full flex items-center justify-center text-primary-400 hover:text-primary-900 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary-900 mb-6 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-3">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products?category=Electronics', label: 'Electronics' },
                { to: '/products?category=Clothing', label: 'Clothing' },
                { to: '/products?category=Shoes', label: 'Shoes' },
                { to: '/products?category=Accessories', label: 'Accessories' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-primary-900 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-primary-900 mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3">
              {['Track Your Order', 'Return Policy', 'Shipping Info', 'FAQ', 'Privacy Policy', 'Terms of Service'].map(
                (label) => (
                  <li key={label}>
                    <a href="#" className="hover:text-primary-900 text-sm transition-colors">
                      {label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-primary-900 mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4">
              {[
                { Icon: MapPin, text: '123 Shahrah-e-Quaid, Karachi, Pakistan' },
                { Icon: Phone, text: '+92 300 1234567' },
                { Icon: Mail, text: 'support@shopcart.pk' },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon size={18} className="text-primary-400 shrink-0" />
                  <span className="text-sm">{text}</span>
                </li>
              ))}
            </ul>

            {/* Payment Methods */}
            <div className="mt-8">
              <p className="text-primary-400 text-xs font-semibold uppercase tracking-wider mb-3">We Accept</p>
              <div className="flex gap-2">
                {['JazzCash', 'EasyPaisa', 'COD'].map((method) => (
                  <span
                    key={method}
                    className="px-3 py-1.5 bg-white border border-surface-200 rounded text-xs text-primary-600 font-medium shadow-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-200 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} ShopCart. All rights reserved.</p>
          <p className="text-sm">Designed for Elegance</p>
        </div>
      </div>
    </footer>
  );
}
