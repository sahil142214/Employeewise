import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';
import { useAuth } from './context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null); 
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });

  const { logout } = useAuth(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers(page);
      setUsers(data.data);
      setTotalPages(data.total_pages);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email, avatar: user.avatar });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateUser(editingUser.id, formData);
      setUsers(users.map(user => (user.id === editingUser.id ? { ...updatedUser, avatar: editingUser.avatar } : user)));
      setEditingUser(null); 
    } catch (err) {
      setError('Failed to update user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User List</h2>
        <button
          onClick={handleLogout} 
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
      {editingUser && (
        <form onSubmit={handleFormSubmit} className="mb-4 p-4 bg-gray-100 rounded">
          <h3 className="text-xl font-semibold mb-2">Edit User</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <img 
              src={user.avatar} 
              alt={`${user.first_name} ${user.last_name}`} 
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{`${user.first_name} ${user.last_name}`}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEdit(user)}
                className="text-blue-500 hover:text-blue-700"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`px-4 py-2 rounded ${
              page === pageNum 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;