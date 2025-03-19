"use client";

import { useState, useEffect } from "react";
import "./profile.css";

// Define type for user details
type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  password: string;
};

export default function Profile() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isResetPassword, setIsResetPassword] = useState<boolean>(false); // For password reset form visibility
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

  // Define which fields to display
  const fieldsToDisplay: (keyof UserDetails)[] = ["firstName", "lastName"];

  // Fetch user profile data on component load
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view the profile.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${apiUrl}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data: UserDetails = await response.json();
        setUserDetails(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [apiUrl]);

  const handleEditClick = (field: keyof UserDetails) => {
    setEditingField(field);
    if (userDetails) setNewValue(userDetails[field]);
  };

  const handleSaveClick = () => {
    if (editingField && newValue && userDetails) {
      const updateProfile = async () => {
        if (!userDetails || !editingField) return;

        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("You must be logged in to edit your profile.");
          }
          const response = await fetch(`${apiUrl}/user/update`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              [editingField]: newValue,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update profile");
          }

          setUserDetails({
            ...userDetails,
            [editingField]: newValue,
          });
          setEditingField(null);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
        }
      };
      updateProfile();
      setEditingField(null);
    }
  };

  // Password reset functionality
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPasswordError("You must be logged in to reset your password.");
        return;
      }
      const response = await fetch(`${apiUrl}/user/reset-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      // Clear the form and provide success feedback
      setIsResetPassword(false);
      setPasswordError(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password reset successful.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPasswordError(err.message);
      } else {
        setPasswordError("An unknown error occurred");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Profile</h1>
        <div className="profile-info">
          {userDetails &&
            fieldsToDisplay.map((field) => (
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
                    <p>{userDetails[field]}</p>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(field)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>

        {/* Button to initiate password reset */}
        {!isResetPassword && (
          <button
            className="reset-password-btn"
            onClick={() => setIsResetPassword(true)}
          >
            Change Password
          </button>
        )}

        {/* Password reset form */}
        {isResetPassword && (
          <div className="password-reset-form">
            <h2>Reset Your Password</h2>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {passwordError && <p className="error">{passwordError}</p>}
            <button className="save-btn" onClick={handleResetPassword}>
              Reset Password
            </button>
            <button
              className="cancel-btn"
              onClick={() => setIsResetPassword(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
