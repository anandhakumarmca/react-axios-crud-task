import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import Axios
import '../styles/CrudComponent.css';
import DummyAvatar from '../assets/user.png';
import { AiOutlineMail, AiOutlinePhone, AiOutlineGlobal } from 'react-icons/ai';

// Create an Axios instance with a common base URL
const api = axios.create({
  baseURL: 'https://6543385301b5e279de200732.mockapi.io/api/v1', // Replace with your API base URL
});

const CrudComponent = () => {
  const inputNameRef = useRef(null);
  const inputEmailRef = useRef(null);
  const inputPhoneRef = useRef(null);
  const inputWebsiteRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
  });
  const [validationError, setValidationError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users'); // Use a relative path here
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.website) {
      setValidationError(true);
      return;
    }

    try {
      setValidationError(false);
      const response = await api.post('/users', newUser); // Use a relative path here
      setUsers([...users, response.data]);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        website: '',
      });
      alert('New User Created Successfully');
      setEditingUser(null);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const updateUser = async (id) => {
    try {
      setValidationError(false);
      await api.put(`/users/${id}`, editingUser); // Use a relative path here
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, ...editingUser } : user
      );
      setUsers(updatedUsers);
      alert('User Details Updated Successfully');
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`); // Use a relative path here
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      alert('User Details Deleted Successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    inputNameRef.current.focus();
  };

  const handleFieldChange = (field, value) => {
    if (!editingUser) {
      setNewUser({ ...newUser, [field]: value });
    } else {
      setEditingUser({ ...editingUser, [field]: value });
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          <div className="user-form-container">
            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <input
              ref={inputNameRef}
              className="user-form-input"
              type="text"
              placeholder="Name"
              value={editingUser ? editingUser.name : newUser.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
            />
            <input
              ref={inputEmailRef}
              className="user-form-input"
              type="text"
              placeholder="Email"
              value={editingUser ? editingUser.email : newUser.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
            />
            <input
              ref={inputPhoneRef}
              className="user-form-input"
              type="tel"
              placeholder="Phone"
              value={editingUser ? editingUser.phone : newUser.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
            <input
              ref={inputWebsiteRef}
              className="user-form-input"
              type="text"
              placeholder="Website"
              value={editingUser ? editingUser.website : newUser.website}
              onChange={(e) => handleFieldChange('website', e.target.value)}
            />
            {validationError && (
              <p className="validation-error">Please fill in all required fields</p>
            )}
            {editingUser ? (
              <div className="user-form-button-group">
                <button
                  className="user-form-button user-card-save-button"
                  onClick={() => updateUser(editingUser.id)}
                >
                  Save
                </button>
                <button
                  className="user-form-button user-card-cancel-button"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="user-form-button user-card-create-button"
                  onClick={createUser}
                >
                  Create
                </button>
              </div>
            )}
          </div>
          <div className="user-card-row">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-avatar">
                  <img src={DummyAvatar} alt="Dummy Avatar" />
                </div>
                <span className="user-card-name">{user.name}</span>
                <span className="user-card-email">
                  <AiOutlineMail /> {user.email}
                </span>
                <span className="user-card-details">
                  <AiOutlinePhone /> {user.phone}
                </span>
                <span className="user-card-details">
                  <AiOutlineGlobal /> {user.website}
                </span>
                <div className="user-card-actions">
                  <button
                    className="user-card-edit-button"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="user-card-delete-button"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudComponent;
