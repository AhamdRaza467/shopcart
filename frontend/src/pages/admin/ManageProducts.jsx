import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';

const API = 'http://localhost:5000/api';
const CATEGORIES = ['Electronics', 'Clothing', 'Shoes', 'Accessories'];
const emptyForm = { name: '', price: '', description: '', category: 'Electronics', image: '', stock: '' };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/products?limit=100`);
      setProducts(data.products);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpen = (product = null) => {
    setEditProduct(product);
    setForm(product ? { name: product.name, price: product.price, description: product.description, category: product.category, image: product.image, stock: product.stock } : emptyForm);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editProduct) {
        await axios.put(`${API}/products/${editProduct._id}`, form);
        toast.success('Product updated!');
      } else {
        await axios.post(`${API}/products`, form);
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const formatPrice = (p) => `Rs. ${Number(p).toLocaleString('en-PK')}`;

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary-900 mb-1">Manage Products</h1>
            <p className="text-primary-500 text-sm">{products.length} products total</p>
          </div>
          <button id="add-product-btn" onClick={() => handleOpen()}
            className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-100">
                <h2 className="font-semibold text-primary-900 text-lg">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg text-primary-400 hover:text-primary-600 hover:bg-surface-100 transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                {[
                  { name: 'name', label: 'Product Name', type: 'text', placeholder: 'Wireless Headphones' },
                  { name: 'price', label: 'Price (Rs.)', type: 'number', placeholder: '8999' },
                  { name: 'stock', label: 'Stock Quantity', type: 'number', placeholder: '50' },
                  { name: 'image', label: 'Image Path', type: 'text', placeholder: '/images/products/headphones.jpg' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label className="text-primary-700 text-sm font-medium mb-1.5 block">{label}</label>
                    <input id={`product-${name}`} type={type} value={form[name]}
                      onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                      placeholder={placeholder} className="input-field" required />
                  </div>
                ))}
                <div>
                  <label className="text-primary-700 text-sm font-medium mb-1.5 block">Category</label>
                  <select id="product-category" value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="input-field cursor-pointer">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-primary-700 text-sm font-medium mb-1.5 block">Description</label>
                  <textarea id="product-description" value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Product description..." rows={3} className="input-field resize-none" required />
                </div>
                <div className="flex gap-3 pt-4 border-t border-surface-100 mt-6">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                  <button id="save-product-btn" type="submit" disabled={saving}
                    className="btn-primary flex items-center gap-2 flex-1 justify-center">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-surface-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-100">
                <tr className="text-primary-500 text-left">
                  {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium uppercase tracking-wider text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-6 bg-surface-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : products.map((p) => (
                  <tr key={p._id} className="text-primary-700 hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-100 border border-surface-200 shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=e2e8f0&color=0f172a&size=80`; }} />
                        </div>
                        <span className="font-medium text-primary-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4"><span className="badge bg-indigo-50 text-indigo-700 border border-indigo-100">{p.category}</span></td>
                    <td className="px-4 py-4 font-semibold text-primary-900">{formatPrice(p.price)}</td>
                    <td className="px-4 py-4">
                      <span className={p.stock === 0 ? 'text-red-600 font-medium' : p.stock <= 5 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-primary-500">⭐ {p.rating.toFixed(1)}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button id={`edit-${p._id}`} onClick={() => handleOpen(p)}
                          className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors border border-indigo-100">
                          <Edit2 size={14} />
                        </button>
                        <button id={`delete-${p._id}`} onClick={() => handleDelete(p._id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && products.length === 0 && (
              <p className="text-center text-primary-500 py-8 text-sm">No products found. Add your first product!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
