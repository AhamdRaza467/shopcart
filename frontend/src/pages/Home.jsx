import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80' },
  { name: 'Clothing', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80' },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&q=80' },
];

const SLIDES = [
  {
    title: 'Minimalist Essentials',
    subtitle: 'Discover the new standard of elegance',
    desc: 'Upgrade your lifestyle with our curated collection of premium products.',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
  },
  {
    title: 'Next Gen Tech',
    subtitle: 'Innovation at your fingertips',
    desc: 'Explore the latest gadgets and accessories to power your day.',
    img: 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=1600&q=80',
  },
];

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over Rs. 2,000' },
  { icon: ShieldCheck, title: 'Secure Shopping', desc: '100% protected payments' },
  { icon: CreditCard, title: 'Easy Payments', desc: 'JazzCash & COD available' },
  { icon: Clock, title: '24/7 Support', desc: 'Dedicated help center' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featRes, newRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products/featured'),
          axios.get('http://localhost:5000/api/products?sort=-createdAt&limit=8'),
        ]);
        setFeaturedProducts(featRes.data);
        setNewArrivals(newRes.data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative h-[80vh] md:h-[85vh] w-full overflow-hidden bg-surface-100">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={slide.img} alt={slide.title} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="absolute inset-0 flex items-center justify-center sm:justify-start">
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl text-center sm:text-left animate-slide-up">
                  <p className="text-white/80 font-medium tracking-widest uppercase mb-4 text-sm">{slide.subtitle}</p>
                  <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-6 leading-tight text-balance">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-white/90 mb-8 max-w-md mx-auto sm:mx-0">
                    {slide.desc}
                  </p>
                  <Link to="/products" className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-accent-500/30 hover:-translate-y-1">
                    Explore Collection <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
                <div className="w-12 h-12 bg-surface-50 rounded-full flex items-center justify-center text-primary-900">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900">{title}</h3>
                  <p className="text-sm text-primary-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-surface-200 mt-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-primary-500">Curated collections for every lifestyle</p>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1 text-accent-600 font-bold hover:text-accent-700 transition-all hover:translate-x-1">
            View All <ChevronRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group relative h-80 sm:h-96 overflow-hidden rounded-2xl bg-surface-100 shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end items-start">
                <h3 className="text-white font-display font-bold text-2xl sm:text-3xl mb-2 tracking-wide">{cat.name}</h3>
                <span className="text-white font-bold text-sm flex items-center gap-1 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  Shop Now <ChevronRight size={18} strokeWidth={3} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-surface-50 border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Selections</h2>
            <p className="text-primary-500">Hand-picked premium products just for you</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 gap-y-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-surface-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 gap-y-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-surface-200">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="section-title">New Arrivals</h2>
            <p className="text-primary-500">The latest additions to our store</p>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1 text-accent-600 font-bold hover:text-accent-700 transition-all hover:translate-x-1">
            View All <ChevronRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-surface-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 gap-y-12">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
