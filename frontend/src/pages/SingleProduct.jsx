import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ChevronRight, Truck, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SingleProduct() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchProduct();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to submit a review');
    
    setSubmittingReview(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/products/${id}/reviews`, { rating, comment }, config);
      toast.success('Review submitted successfully!');
      
      // Refresh product to show new review
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/products/${id}`);
      setProduct(data);
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString('en-PK')}`;

  const renderStars = (ratingVal, size = 16) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < Math.round(ratingVal) ? 'text-primary-900 fill-gray-900' : 'text-gray-200 fill-gray-200'}
      />
    ));

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-surface-50">
      <Loader2 className="w-10 h-10 text-primary-900 animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-surface-50">
      <h2 className="text-primary-900 text-2xl font-bold mb-4">Product Not Found</h2>
      <Link to="/products" className="btn-primary">Back to Products</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-20 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-primary-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary-900 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-primary-900 transition-colors">Products</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} className="hover:text-primary-900 transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-primary-900 font-medium truncate">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          
          {/* Image Gallery */}
          <div className="space-y-4 animate-fade-in">
            <div className="aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-surface-100 shadow-sm relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
              {product.stock === 0 && (
                <div className="absolute top-4 left-4 badge bg-red-600 text-white shadow-md uppercase tracking-widest px-3 py-1.5">
                  Sold Out
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col animate-slide-up">
            <div className="mb-6">
              <p className="text-primary-500 font-medium uppercase tracking-widest text-sm mb-2">{product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 leading-tight mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 bg-surface-100 px-3 py-1.5 rounded-full">
                  <span className="font-bold text-primary-900 text-sm">{product.rating.toFixed(1)}</span>
                  <Star size={14} className="text-primary-900 fill-gray-900" />
                </div>
                <a href="#reviews" className="text-sm text-primary-500 hover:text-primary-900 hover:underline underline-offset-4 transition-colors">
                  Read {product.numReviews} Reviews
                </a>
                <span className="text-gray-300">|</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? (product.stock <= 5 ? 'text-amber-600' : 'text-emerald-600') : 'text-red-600'}`}>
                  {product.stock > 0 ? (product.stock <= 5 ? `Only ${product.stock} left in stock!` : 'In Stock') : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <span className="font-display text-4xl font-bold text-primary-900">{formatPrice(product.price)}</span>
              <p className="text-sm text-primary-500 mt-1">Inclusive of all taxes</p>
            </div>

            <p className="text-primary-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-8 border-t border-b border-surface-200 py-8">
              <div className="flex items-center gap-6">
                <span className="text-primary-900 font-medium">Quantity</span>
                <div className="flex items-center bg-surface-100 rounded-lg p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white text-primary-700 disabled:opacity-50 transition-colors shadow-sm"
                  >-</button>
                  <span className="w-12 text-center font-medium text-primary-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock === 0 || quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white text-primary-700 disabled:opacity-50 transition-colors shadow-sm"
                  >+</button>
                </div>
              </div>

              <div className="flex w-full mt-4">
                <button 
                  id="add-to-cart-btn"
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock === 0}
                  className="w-full bg-surface-900 hover:bg-surface-800 text-white font-bold text-lg py-5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <ShoppingCart size={24} />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white border border-surface-100 rounded-xl shadow-sm">
                <Truck className="text-primary-400" size={24} />
                <div>
                  <h4 className="font-semibold text-sm text-primary-900">Fast Delivery</h4>
                  <p className="text-xs text-primary-500">2-4 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-surface-100 rounded-xl shadow-sm">
                <ShieldCheck className="text-primary-400" size={24} />
                <div>
                  <h4 className="font-semibold text-sm text-primary-900">Secure Setup</h4>
                  <p className="text-xs text-primary-500">100% safe checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-20">
          <div className="border-b border-surface-200 mb-8">
            <h2 className="text-2xl font-bold text-primary-900 pb-4 inline-block border-b-2 border-surface-900">Customer Reviews</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Write Review */}
            <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl border border-surface-100 shadow-sm h-fit">
              <h3 className="font-bold text-xl text-primary-900 mb-2">Write a Review</h3>
              <p className="text-sm text-primary-500 mb-6">Share your experience with this product.</p>
              
              {user ? (
                <form onSubmit={submitReviewHandler} className="space-y-5">
                  <div>
                    <label className="text-primary-700 text-sm font-medium mb-2 block">Rating</label>
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-surface-50 border border-surface-200 rounded-lg px-4 py-2.5 text-primary-900 focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-primary-700 text-sm font-medium mb-2 block">Comment</label>
                    <textarea 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)}
                      required
                      placeholder="What did you like or dislike?"
                      rows="4"
                      className="w-full bg-surface-50 border border-surface-200 rounded-lg px-4 py-3 text-primary-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 resize-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingReview}
                    className="w-full bg-surface-900 hover:bg-surface-800 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? <Loader2 size={18} className="animate-spin" /> : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="bg-surface-50 border border-surface-200 rounded-xl p-6 text-center">
                  <p className="text-primary-600 text-sm mb-4">You must be logged in to write a review.</p>
                  <Link to="/login" className="inline-block bg-surface-900 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-surface-800 transition-colors">
                    Login Now
                  </Link>
                </div>
              )}
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-6">
              {product.reviews.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-surface-100 shadow-sm text-center">
                  <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={24} className="text-primary-400" />
                  </div>
                  <h3 className="text-primary-900 font-semibold mb-1">No reviews yet</h3>
                  <p className="text-primary-500 text-sm">Be the first to share your thoughts!</p>
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev._id} className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-100 rounded-full flex items-center justify-center font-bold text-primary-600">
                          {rev.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-primary-900">{rev.name}</p>
                          <p className="text-xs text-primary-400">{new Date(rev.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">{renderStars(rev.rating)}</div>
                    </div>
                    <p className="text-primary-600 text-sm leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
