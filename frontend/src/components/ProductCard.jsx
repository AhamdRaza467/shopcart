import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const formatPrice = (price) =>
    `Rs. ${Number(price).toLocaleString('en-PK')}`;

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.round(rating) ? 'text-primary-900 fill-gray-900' : 'text-gray-200 fill-gray-200'}
      />
    ));

  return (
    <div className="group flex flex-col bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-in relative border border-surface-100">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-surface-50 rounded-xl mb-4">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=f8fafc&color=0f172a&size=400`;
            }}
          />
        </Link>
        
        {/* Hover Add to Cart Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10 flex justify-center">
          <button
            id={`add-cart-${product._id}`}
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            disabled={product.stock === 0}
            className="w-full bg-white/95 backdrop-blur-sm hover:bg-primary-900 hover:text-white text-primary-900 text-sm font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-surface-200"
          >
            <ShoppingCart size={18} /> 
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.stock === 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
              Sold Out
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
              Low Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-2 pb-1">
        <div className="flex justify-between items-start mb-2">
          <p className="text-primary-500 text-[11px] font-semibold uppercase tracking-widest">{product.category}</p>
          <div className="flex items-center gap-1">
            <div className="flex gap-[1px]">{renderStars(product.rating)}</div>
          </div>
        </div>
        
        <Link to={`/products/${product._id}`}>
          <h3 className="text-primary-900 font-bold text-base sm:text-lg leading-tight line-clamp-2 hover:text-primary-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-1">
          <span className="font-bold text-lg text-primary-800">{formatPrice(product.price)}</span>
        </div>
      </div>
    </div>
  );
}
