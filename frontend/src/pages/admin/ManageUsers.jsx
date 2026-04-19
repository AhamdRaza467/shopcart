import { useState, useEffect } from 'react';
import { ShieldOff, ShieldCheck, Loader2, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';

const API = 'http://localhost:5000/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${API}/admin/users`);
        setUsers(data);
      } catch { toast.error('Failed to load users'); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId) => {
    setToggling(userId);
    try {
      const { data } = await axios.put(`${API}/admin/users/${userId}/block`);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isBlocked: data.isBlocked } : u));
      toast.success(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setToggling(null); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await axios.delete(`${API}/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-primary-900 mb-1">Manage Users</h1>
          <p className="text-primary-500 text-sm">{users.length} total users</p>
        </div>

        <div className="bg-white border border-surface-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-100">
                <tr className="text-primary-500 text-left">
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium uppercase tracking-wider text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-6 bg-surface-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : users.map((user) => (
                  <tr key={user._id} className="text-primary-700 hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-900 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">{user.name[0].toUpperCase()}</span>
                        </div>
                        <span className="text-primary-900 font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-primary-600">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className={`badge border ${user.role === 'admin' ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-surface-100 text-primary-600 border-surface-200'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge border ${user.isBlocked ? 'bg-red-100 text-red-700 border-red-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-primary-500">{new Date(user.createdAt).toLocaleDateString('en-PK')}</td>
                    <td className="px-4 py-4">
                      {user.role !== 'admin' ? (
                        <div className="flex items-center gap-2">
                          <button id={`toggle-${user._id}`} onClick={() => handleToggleBlock(user._id)}
                            disabled={toggling === user._id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                              user.isBlocked
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                                : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                            }`}>
                            {toggling === user._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : user.isBlocked ? (
                              <><ShieldCheck size={14} /> Unblock</>
                            ) : (
                              <><ShieldOff size={14} /> Block</>
                            )}
                          </button>
                          <button id={`delete-${user._id}`} onClick={() => handleDeleteUser(user._id)}
                            className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-primary-400 text-xs font-medium">Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && users.length === 0 && (
              <p className="text-center text-primary-500 py-8 text-sm">No users found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
