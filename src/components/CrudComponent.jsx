import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CrudComponent.css";

const CrudComponent = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });

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
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        newUser
      );
      setUsers([...users, response.data]);
      setNewUser({ name: "", email: "" });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const updateUser = async (id, updatedUser) => {
    try {
      // Since JSONPlaceholder doesn't actually support updates, I'll just log the attempt here.
      console.log(`Attempting to update user with id ${id}:`, updatedUser);
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

  return (
    <div className="crud-container">
      <h2 className="crud-title">Users</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
            <div className="user-actions">
              <button
                className="edit-button"
                onClick={() =>
                  updateUser(user.id, {
                    name: "Updated Name",
                    email: "updated@email.com",
                  })
                }
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="crud-title">Create User</h2>
      <div className="create-form">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="input-field"
        />
        <button className="create-button" onClick={createUser}>
          Create
        </button>
      </div>
    </div>
  );
};

export default CrudComponent;
