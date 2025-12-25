import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

// Import your SDG images 
import sdg11Img from '../images/E_SDG_Icons-11.jpg'; 
import sdg17Img from '../images/e-web-goal-17.png';

// Imports for Mission Cards
import imgWhoWeAre from '../images/image1.jpeg'; 
import imgMission from '../images/image3.jpeg';
import imgVolunteer from '../images/image4.jpeg';

export default function Home() {
  return (
    <div className="home-container-unique">
      
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
              <div 
                className="card-img-placeholder" 
                style={{ backgroundImage: `url(${imgWhoWeAre})` }}
              ></div>
              <div className="mission-overlay">
                <h3>WHO WE ARE</h3>
                <p>We are a community-driven organization connecting volunteers with NGOs in Penang.</p>
              </div>
            </div>

            <div className="mission-card">
              <div 
                className="card-img-placeholder" 
                style={{ backgroundImage: `url(${imgMission})` }}
              ></div>
              <div className="mission-overlay">
                <h3>OUR MISSION</h3>
                <p>Building resilient communities through sustainable action.</p>
              </div>
            </div>

            <div className="mission-card">
              <div 
                className="card-img-placeholder" 
                style={{ backgroundImage: `url(${imgVolunteer})` }}
              ></div>
              <div className="mission-overlay">
                <h3>VOLUNTEER</h3>
                <p>Explore meaningful opportunities across Penang with trusted NGOs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- HOW TO GET INVOLVED SECTION --- */}
        <section className="get-involved-section">
          <div className="involved-header">
            <span className="section-tag">HOW TO GET INVOLVED</span>
            <h2>Take the First Step Toward Empowering Youth and Strengthening Our Community</h2>
            <p className="involved-desc">
              Volunteering with Building Bridges is your chance to make a real difference in the community. Whether you have just a few hours or are ready to make a long-term commitment, we have a role for you. <strong>Here’s how you can begin:</strong>
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h4>Explore Our Volunteer Opportunities:</h4>
              <p>Take a look at the variety of volunteer positions we offer. From hands-on roles like event support to behind-the-scenes work, there is something for everyone.</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h4>Fill Out Our Volunteer Application:</h4>
              <p>Once your application is filled out, we will schedule an interview with you to thoroughly explain the program and our Strength-Based Approach philosophy.</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h4>Start Making An Impact</h4>
              <p>With the proper training and support, you’ll begin contributing to one of our exciting initiatives. Together, we’ll make a difference.</p>
            </div>
          </div>
        </section>

        {/* --- NEW SDG SECTION (Green/Pink Aesthetic) --- */}
        <section className="sdg-section">
          <div className="sdg-header-left">
            <h2>Supporting the Goals</h2>
            <p className="sdg-subtitle">Sustainable Development Goals (SDGs)...</p>
          </div>
          
          <div className="sdg-row">
            
            {/* ITEM 1 */}
            <div className="sdg-item">
              <div className="sdg-dashed-box">
                <img src={sdg11Img} alt="SDG 11" />
              </div>
              <div className="sdg-text-content">
                <h3 className="pink-number">SDG 11</h3>
                <h4 className="sdg-title">Sustainable Cities</h4>
                <p>
                  Make cities and human settlements inclusive, safe, resilient, and sustainable. 
                  We work to ensure Penang remains a vibrant home for all generations.
                </p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="sdg-item">
              <div className="sdg-dashed-box">
                <img src={sdg17Img} alt="SDG 17" />
              </div>
              <div className="sdg-text-content">
                <h3 className="pink-number">SDG 17</h3>
                <h4 className="sdg-title">Partnerships</h4>
                <p>
                  Strengthen the means of implementation and revitalize the global partnership for sustainable development. 
                  We connect NGOs, volunteers, and corporates.
                </p>
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