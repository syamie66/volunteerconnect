import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
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
          <p>Email: info@volunteerconnect.my</p>
          <p>Phone: +60 12-345 6789</p>
          <p>Penang, Malaysia</p>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <form>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 VolunteerConnect. All Rights Reserved.
      </div>
    </footer>
  );
}



