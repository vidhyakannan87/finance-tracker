// src/app/page.tsx
"use client"; // Ensure this is a Client Component

import Link from 'next/link';
import './home.css'; // Import the CSS for styling

const Home = () => {
  return (
    <div className="home-container">
      <div className="content-wrapper">
        {/* Main Title */}
        <h1 className="title">Personal Finance Tracker</h1>
        <p className="description">
          Track your finances effortlessly and make smarter decisions.
        </p>

        {/* Call to Action */}
        <div className="cta-wrapper">
          <Link href="/register">
            <button className="cta-button">Get Started</button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="features-wrapper">
          <h2 className="features-title">Why Choose Us?</h2>
          <ul className="features-list">
            <li className="feature-item">Easy to use interface</li>
            <li className="feature-item">Detailed financial reports</li>
            <li className="feature-item">Secure and private</li>
          </ul>
        </div>

        {/* Existing Member Section */}
        <div className="existing-member-wrapper">
          <p className="existing-member-text">Already have an account?</p>
          <Link href="/login">
            <button >Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
