import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString('en-PK')}`;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white border border-surface-100 rounded-2xl shadow-sm group">
      {/* Image */}
      <Link to={`/products/${item._id}`} className="shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-50 border border-surface-100">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <Link to={`/products/${item._id}`}>
              <h3 className="font-semibold text-primary-900 text-sm sm:text-base line-clamp-2 hover:text-primary-600 transition-colors">
                {item.name}
              </h3>
            </Link>
            <p className="text-primary-500 text-xs mt-1 uppercase tracking-wider">{item.category}</p>
          </div>
          <p className="font-display font-bold text-primary-900 whitespace-nowrap">
            {formatPrice(item.price)}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center bg-surface-50 border border-surface-200 rounded-lg p-0.5">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-primary-600 hover:text-primary-900 hover:shadow-sm transition-all"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-primary-900">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-primary-600 hover:text-primary-900 hover:shadow-sm disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item._id)}
            className="p-2 text-primary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
