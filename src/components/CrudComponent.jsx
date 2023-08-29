import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/CrudComponent.css";
import DummyAvatar from "../assets/user.png"; // Replace with the path to your SVG file
import { AiOutlineMail, AiOutlinePhone, AiOutlineGlobal } from "react-icons/ai";

const CrudComponent = () => {
  const inputNameRef = useRef(null);
  const inputEmailRef = useRef(null);
  const inputPhoneRef = useRef(null);
  const inputWebsiteRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });
  const [validationError, setValidationError] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.website) {
      setValidationError(true);
      return;
    }

    try {
      setValidationError(false);
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        newUser
      );
      setUsers([...users, response.data]);
      setNewUser({
        name: "",
        email: "",
        phone: "",
        website: "",
      });
      setEditingUser(null);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const updateUser = async (id) => {
    if (id >= 11) {
      setValidationError(false);
      console.error("Error while updating New User");
      setEditingUser(null);
      return;
    }

    try {
      setValidationError(false);
      await axios.put(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        editingUser
      );
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, ...editingUser } : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });

    // Set focus on the input fields
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
      <div className="user-form-container">
        <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
        <input
          ref={inputNameRef}
          className="user-form-input"
          type="text"
          placeholder="Name"
          value={editingUser ? editingUser.name : newUser.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
        <input
          ref={inputEmailRef}
          className="user-form-input"
          type="text"
          placeholder="Email"
          value={editingUser ? editingUser.email : newUser.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
        />
        <input
          ref={inputPhoneRef}
          className="user-form-input"
          type="text"
          placeholder="Phone"
          value={editingUser ? editingUser.phone : newUser.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
        />
        <input
          ref={inputWebsiteRef}
          className="user-form-input"
          type="text"
          placeholder="Website"
          value={editingUser ? editingUser.website : newUser.website}
          onChange={(e) => handleFieldChange("website", e.target.value)}
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
  );
};

export default CrudComponent;
