import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Shield, Trash2 } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { userService } from '../../services/userService';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'BUYER',
    status: 'ACTIVE',
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (id) => {
    try {
      const updated = await userService.toggleUserStatus(id);
      setUsers(users.map((u) => (u.id === id ? updated : u)));
      showToast(`User status updated to ${updated.status}`);
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      showToast('User deleted successfully');
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to delete user');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required');
      return;
    }
    try {
      const newUser = await userService.createUser(formData);
      setUsers([...users, newUser]);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', role: 'BUYER', status: 'ACTIVE' });
      showToast('User created successfully');
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to create user');
    }
  };

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] bg-slate-950 text-white py-3 px-5 rounded-2xl shadow-xl text-xs font-bold animate-bounce">
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">User Management</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Manage corporate credentials, system roles, and account access permissions.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto py-2.5 px-4 bg-[#714B67] hover:bg-[#5E3E56] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer self-start"
        >
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Assigned Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    Loading user management records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-black text-slate-900">{u.name}</td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5">
                        <Shield size={12} className="text-[#714B67]" />
                        <strong className="text-slate-800">{u.role}</strong>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={u.status === 'ACTIVE' ? 'success' : 'neutral'}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id)}
                        className="py-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all font-bold text-[10px] cursor-pointer"
                      >
                        {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Add New User</h3>
              <p className="text-xs text-slate-500 font-medium">
                Create a new corporate account with custom access roles.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@vendorbridge.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block">
                    Assigned Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="BUYER">BUYER</option>
                    <option value="PROCUREMENT_MANAGER">MANAGER</option>
                    <option value="SUPPLIER">SUPPLIER</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-[#714B67] hover:bg-[#5E3E56] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
