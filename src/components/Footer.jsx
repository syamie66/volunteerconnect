import React from 'react';


export default function Footer() {
  return (
    <footer className="home-container-unique footer-main">
      <div className="footer-container">
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-details">
            <p>Email: info@volunteerconnect.my</p>
            <p>Phone: +60 12-345 6789</p>
            <p>Penang, Malaysia</p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p className="newsletter-text">Join our community updates.</p>
          <form className="footer-form">
            <input type="email" placeholder="Your email" required />
            <button type="submit" className="footer-sub-btn">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-line"></div>
        <p>© 2025 VolunteerConnect. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
