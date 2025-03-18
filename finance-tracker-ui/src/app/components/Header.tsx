"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import "./header.css"; // Import styles

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link href="/">💰 Finance Tracker</Link>
      </div>
      <nav className="nav-links">
        {isAuthenticated ? (
          <>
            <Link href="/transactions">Transactions</Link>
            <Link href="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
