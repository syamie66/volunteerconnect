

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';


export default function Home() {
  const { currentUser, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="home-container-unique">

      <main className="main-content">
        {/* HERO SECTION */}
        <section className="hero-split">
          <div className="hero-left-stripe">
            <div className="hero-image-frame">
               <div className="image-placeholder"></div>
            </div>
          </div>
          <div className="hero-right-content">
            <span className="welcome-tag">WELCOME TO THE HEART OF PENANG</span>
            <h1 className="display-serif">Empowering Communities Through Volunteering</h1>
            <p className="hero-subtext">Connect with NGOs, discover local causes, and make an impact.</p>
            <Link to="/events" className="outline-pill">EXPLORE OPPORTUNITIES</Link>
          </div>
        </section>

        <div className="orange-divider">
           OWNED & OPERATED BY A COMMITTEE OF LOCAL VOLUNTEERS & NGOS
        </div>

        {/* MISSION / WHO WE ARE SECTION */}
        <section className="mission-split">
          <div className="mission-card">
            <h2>Who We Are</h2>
            <p>We are a community-driven organization focused on connecting volunteers with NGOs in Penang. Since our inception, we have facilitated projects that enhance community welfare.</p>
          </div>
          <div className="mission-card">
            <h2>Our Mission (SDGs)</h2>
            <p>Volunteering supports <strong>SDG 11</strong> and <strong>SDG 17</strong> by building resilient communities. We foster partnerships that drive collective action.</p>
          </div>
        </section>

        {/* WAYS TO SUPPORT / BENEFITS */}
        <section className="benefits-section">
          <h2 className="section-title-italic">Ways to Support Us</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
               <h3>Discover Events</h3>
               <p>Explore meaningful opportunities across Penang with trusted NGOs.</p>
               <div className="tags"><span>✓ FLEXIBLE HRS</span> <span>✓ FAMILY FRIENDLY</span></div>
            </div>
            <div className="benefit-item">
               <h3>Connect With NGOs</h3>
               <p>Build relationships with organizations making positive change.</p>
               <div className="tags"><span>✓ PARTNERSHIPS</span> <span>✓ NETWORKING</span></div>
            </div>
            <div className="benefit-item">
               <h3>Make Real Impact</h3>
               <p>Contribute to causes that matter to your community.</p>
               <div className="tags"><span>✓ FREE TO JOIN</span> <span>✓ WEEKLY</span></div>
            </div>
            <div className="benefit-item">
               <h3>Learn & Grow</h3>
               <p>Develop new skills and gain valuable experience while helping others.</p>
               <div className="tags"><span>✓ SKILLS</span> <span>✓ 2-MONTH TRACK</span></div>
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="team-area">
          <h2 className="section-title-italic">Meet Our Team</h2>
          <div className="team-grid">
             {['Jane Doe', 'John Smith', 'Mary Lee', 'Ali Rahman'].map((name, i) => (
               <div key={i} className="team-card">
                 <div className="team-circle"></div>
                 <h4>{name}</h4>
                 <p>Coordinator</p>
               </div>
             ))}
          </div>
        </section>
      </main>{/* FOOTER */}
      <footer className="footer-area">
        <div className="footer-grid">
          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link><br/><Link to="/events">Events</Link>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p>info@volunteerconnect.my<br/>Penang, Malaysia</p>
          </div>
          <div>
            <h4>Newsletter</h4>
            <form className="footer-form">
              <input type="email" placeholder="Email" />
              <button type="submit">GO</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">© 2025 VolunteerConnect. All Rights Reserved.</div>
      </footer>
    </div>
  );
}
      
