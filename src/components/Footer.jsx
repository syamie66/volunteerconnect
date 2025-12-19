import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-area">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>info@volunteerconnect.my<br/>Penang, Malaysia</p>
        </div>
        <div className="footer-col">
          <h4>Newsletter</h4>
          <form className="footer-form">
            <input type="email" placeholder="Email" />
            <button type="submit">GO</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">© 2025 VolunteerConnect. All Rights Reserved.</div>
    </footer>
  );
}
