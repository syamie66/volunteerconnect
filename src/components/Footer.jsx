import React from 'react';
import { Link } from 'react-router-dom';
import { FaBehance, FaInstagram, FaFacebookF } from 'react-icons/fa';


export default function Footer() {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        
        {/* Top Section: Large Contact Info */}
        <div className="footer-hero">
          <h2 className="hero-email">
            <a href="mailto:info@volunteerconnect.my">info@volunteerconnect.my</a>
          </h2>
          <h2 className="hero-phone">(+60) 123 456 789</h2>
        </div>

        {/* Middle Section: Links & Info */}
        <div className="footer-details-grid">
          
          <div className="detail-col">
            <span className="label">Location</span>
            <p className="highlight">Penang, Malaysia</p>
            <p className="muted">Est. 2025</p>
          </div>
          
          <div className="detail-col center">
            <span className="label">Explore</span>
            <div className="nav-links">
              <Link to="/" className="nav-item">Home</Link>
              <span className="dot">•</span>
              <Link to="/events" className="nav-item">Events</Link>
            </div>
          </div>

          <div className="detail-col right">
            <span className="label">Availability</span>
            <p className="highlight">Mon — Fri / 10-6</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="copyright">
            © 2025 Created by <span className="brand">VolunteerConnect</span>
          </div>
          
          <div className="social-legal">
            <div className="social-icons">
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaFacebookF /></a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}