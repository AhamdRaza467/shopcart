import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Shoes', 'Accessories'];
const SORT_OPTIONS = [
  { label: 'Latest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Highest Rated', value: '-rating' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Read URL params
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || '-createdAt';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${import.meta.env.VITE_API_URL || '/api'}/products?page=${currentPage}&sort=${currentSort}`;
        if (currentCategory !== 'All') url += `&category=${currentCategory}`;
        if (currentSearch) url += `&search=${currentSearch}`;

        const { data } = await axios.get(url);
        setProducts(data.products);
        setPagination({
          page: data.page,
          pages: data.pages,
          total: data.total,
        });
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchProducts();
  }, [currentCategory, currentSort, currentSearch, currentPage]);

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    if (key !== 'page') newParams.delete('page'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen pt-20 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">
              {currentSearch ? `Search: "${currentSearch}"` : currentCategory === 'All' ? 'All Products' : currentCategory}
            </h1>
            <p className="text-primary-500 text-sm">
              {loading ? 'Loading...' : `Showing ${products.length} of ${pagination.total || 0} products`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 rounded-lg text-sm font-medium text-primary-700 shadow-sm"
            >
              <Filter size={16} /> Filters
            </button>
            <div className="hidden md:flex items-center gap-2">
              <label className="text-sm text-primary-500 font-medium">Sort by:</label>
              <select
                value={currentSort}
                onChange={(e) => updateParams('sort', e.target.value)}
                className="bg-white border border-surface-200 text-primary-900 text-sm rounded-lg focus:ring-gray-500 focus:border-surface-500 block p-2 cursor-pointer shadow-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8 relative">
          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-surface-200 p-6 transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:w-64 md:border-r-0 md:bg-transparent md:p-0 md:z-0 ${
              showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <div className="flex items-center justify-between md:hidden mb-6">
              <h2 className="text-lg font-bold text-primary-900">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 text-primary-500 hover:bg-surface-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="md:sticky md:top-28 space-y-8">
              {/* Search Mobile */}
              <div className="md:hidden">
                <h3 className="text-sm font-semibold text-primary-900 uppercase tracking-wider mb-3">Search</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                  <input
                    type="text"
                    defaultValue={currentSearch}
                    onKeyDown={(e) => e.key === 'Enter' && updateParams('search', e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-white border border-surface-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold text-primary-900 uppercase tracking-[0.2em] mb-4">Categories</h3>
                <div className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { updateParams('category', cat); setShowFilters(false); }}
                      className={`block w-full text-left text-sm transition-all ${
                        currentCategory === cat
                          ? 'text-primary-900 font-bold translate-x-2'
                          : 'text-primary-600 hover:text-primary-900 hover:translate-x-1'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Sort */}
              <div className="md:hidden pt-6 border-t border-surface-200">
                <h3 className="text-xs font-bold text-primary-900 uppercase tracking-[0.2em] mb-4">Sort By</h3>
                <div className="space-y-3">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { updateParams('sort', opt.value); setShowFilters(false); }}
                      className={`block w-full text-left text-sm transition-all ${
                        currentSort === opt.value
                          ? 'text-primary-900 font-bold translate-x-2'
                          : 'text-primary-600 hover:text-primary-900 hover:translate-x-1'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 gap-y-12">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-surface-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-surface-100 shadow-sm">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-primary-900 mb-2">No products found</h3>
                <p className="text-primary-500 mb-6">We couldn't find anything matching your search or filters.</p>
                <button
                  onClick={() => { setSearchParams(new URLSearchParams()); setShowFilters(false); }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 gap-y-12">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-16 pb-8">
                    <button
                      onClick={() => updateParams('page', currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white border border-surface-200 text-primary-600 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => updateParams('page', i + 1)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            currentPage === i + 1
                              ? 'bg-surface-900 text-white shadow-md'
                              : 'bg-white border border-surface-200 text-primary-600 hover:bg-surface-50 shadow-sm'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => updateParams('page', currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="p-2 rounded-lg bg-white border border-surface-200 text-primary-600 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
