"use client";

import { useState } from "react";
import "./forgot-password.css";
import Link from "next/link";

export default function ForgotPassword() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const updatedUserCreds = { email, newPassword };
    console.log(updatedUserCreds);

    try {
      const response = await fetch(`${apiUrl}/user/forgot-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserCreds),
      });
      if (response.ok) {
        setShowModal(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="newPassworrd">New Password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter Your New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating Your Password..." : "Change Password"}
            </button>
          </div>
        </form>

        {message && <p className="message">{message}</p>}
        {/* ✅ Success Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Password Updated!</h2>
              <p>Your password has been successfully updated.</p>
              <Link href="/login">
                <button className="modal-btn">Go to Login</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
