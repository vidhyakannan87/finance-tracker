// src/app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import "./login.css"; // Import CSS for login page styling
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Set loading state to true while waiting for the response
    setLoading(true);
    setError(null);

    // Create the user data to send in the request
    const userCreds = { email, password };
    try {
      // Send a POST request to the server
      const response = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCreds),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Invalid Credentials");
      }

      // Handle the successful response
      const data = await response.json();
      login(data.accessToken);
      router.push("/transactions");

      // Redirect or show a success message (you can redirect to login or homepage)
    } catch (err: unknown) {
      // Handle errors
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Just a moment..." : "Login"}
            </button>
            <button type="button" className="forgot-password-btn" onClick={() => router.push("/forgot-password")}>
              Forgot Password?
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
