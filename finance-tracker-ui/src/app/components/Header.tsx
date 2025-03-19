"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import "./header.css"; // Import styles
import { usePathname } from "next/navigation";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const links = isAuthenticated
    ? [
        { href: "/transactions", label: "Transactions" },
        { href: "/profile", label: "Profile" },
      ]
    : [
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ];

  return (
    <header className="header">
      <div className="logo">
        <Link href="/">💰 Finance Tracker</Link>
      </div>
      <nav className="nav-links">
        {links
          .filter((link) => link.href !== pathname) // Exclude current page
          .map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}

        {isAuthenticated && <button onClick={logout}>Logout</button>}
      </nav>
    </header>
  );
};

export default Header;
