import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'; // Footer stays here (or move to App.jsx if you want it global too)


// Import your SDG images
import sdg11Img from '../images/E_SDG_Icons-11.jpg'; 
import sdg17Img from '../images/e-web-goal-17.png';

export default function Home() {
  return (
    <div className="home-container-unique">
      {/* NAVBAR REMOVED FROM HERE - It will come from App.jsx */}

      <main className="main-content">
        
        {/* --- HERO SECTION --- */}
        <section className="hero-section">
          <div className="hero-text-content">
            <span className="welcome-tag">WELCOME TO THE HEART OF PENANG</span>
            <h1 className="display-serif">
              Empowering Communities Through <span className="highlight-pink">Volunteering</span>
            </h1>
            <p className="hero-subtext">
              Connect with NGOs, discover local causes, and make an impact. 
              We foster partnerships that drive collective action.
            </p>
            <Link to="/events" className="main-cta-btn">EXPLORE OPPORTUNITIES</Link>
          </div>
          
          <div className="hero-image-wrapper">
             <div className="blob-image-placeholder"></div>
          </div>
        </section>

        {/* --- MISSION SECTION --- */}
        <section className="mission-section">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="card-img-placeholder"></div>
              <div className="mission-overlay">
                <h3>WHO WE ARE</h3>
                <p>We are a community-driven organization connecting volunteers with NGOs in Penang.</p>
              </div>
            </div>
            <div className="mission-card">
              <div className="card-img-placeholder"></div>
              <div className="mission-overlay">
                <h3>OUR MISSION (SDGs)</h3>
                <p>Volunteering supports SDG 11 & 17 by building resilient communities.</p>
              </div>
            </div>
            <div className="mission-card">
              <div className="card-img-placeholder"></div>
              <div className="mission-overlay">
                <h3>VOLUNTEER</h3>
                <p>Explore meaningful opportunities across Penang with trusted NGOs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- WHAT WE DO SECTION --- */}
        <section className="what-we-do-section">
          <div className="section-header">
            <h2>What do we do? and what inspires us to do this?</h2>
          </div>
          <div className="services-grid">
            <div className="service-card active-card">
              <div className="icon-area"><img src={sdg11Img} alt="SDG 11" className="sdg-icon" /></div>
              <h4>SDG 11</h4>
              <p>Sustainable Cities: Making Penang resilient and inclusive.</p>
            </div>
            <div className="service-card">
              <div className="icon-area"><img src={sdg17Img} alt="SDG 17" className="sdg-icon" /></div>
              <h4>SDG 17</h4>
              <p>Partnerships: Strengthening connections between NGOs and people.</p>
            </div>
            <div className="service-card">
              <div className="icon-area text-icon">❤️</div>
              <h4>Caring</h4>
              <p>An opportunity to give something back to the community.</p>
            </div>
            <div className="service-card">
              <div className="icon-area text-icon">🤝</div>
              <h4>Helping</h4>
              <p>Helps earn respect, and turn tears into smiles.</p>
            </div>
          </div>
        </section>

        {/* --- IMPACT SECTION --- */ }
        <section className="impact-section">
          <div className="section-header-left">
            <h2>What did we do last year?</h2>
            <p className="subtitle">Help us to help others...</p>
          </div>
          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-image-placeholder"></div>
              <div className="impact-content">
                <span className="impact-number">2360+</span>
                <h4>Women Benefited</h4>
                <p>Empowered by us through vocational training and support groups.</p>
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-image-placeholder"></div>
              <div className="impact-content">
                <span className="impact-number">690k</span>
                <h4>Girls Supported</h4>
                <p>Provided with essential resources during and after emergencies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- TEAM SECTION --- */}
        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {['Jane Doe', 'John Smith', 'Mary Lee', 'Ali Rahman'].map((name, i) => (
              <div key={i} className="team-member">
                <div className="team-photo-placeholder"></div>
                <h4>{name}</h4>
                <p>Coordinator</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}