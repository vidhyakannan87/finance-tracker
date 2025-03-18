"use client";

import { useState } from "react";
import "./profile.css";

// Define type for user details
type UserDetails = {
  firstName: string;
  lastName: string;
  phone: string;
};

export default function Profile() {
  // Use the defined type for userDetails state
  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: "John",
    lastName: "Doe",
    phone: "+123456789",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>("");

  const handleEditClick = (field: keyof UserDetails) => {
    setEditingField(field);
    setNewValue(userDetails[field]);
  };

  const handleSaveClick = () => {
    if (editingField && newValue) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [editingField]: newValue,
      }));
      setEditingField(null);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Profile</h1>
        <div className="profile-info">
          {Object.keys(userDetails).map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {editingField === field ? (
                <>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                  <button className="save-btn" onClick={handleSaveClick}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p>{userDetails[field as keyof UserDetails]}</p>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(field as keyof UserDetails)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
