import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import Footer from '../components/Footer';

// Import your SDG images 
import sdg11Img from '../images/E_SDG_Icons-11.jpg'; 
import sdg17Img from '../images/e-web-goal-17.png';

// Imports for Mission Cards
import imgWhoWeAre from '../images/image1.jpeg'; 
import imgMission from '../images/image3.jpeg';
import imgVolunteer from '../images/image4.jpeg';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const auth = getAuth();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Handle the logic for "Apply" / "Join" buttons
  const handleApplyClick = () => {
    if (user) {
      // If user is already logged in -> Go to Events page
      navigate('/events');
    } else {
      // If user is NOT logged in -> Go to Login page
      navigate('/login');
    }
  };

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
            <button 
              onClick={handleApplyClick} 
              className="main-cta-btn" 
              style={{border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem'}}
            >
              EXPLORE OPPORTUNITIES
            </button>
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
            <div className="header-left">
              <span className="section-tag">HOW TO GET INVOLVED</span>
              <h2>Take the First Step Toward Empowering Youth and Strengthening Our Community</h2>
              <p className="involved-desc">
                Volunteering with Building Bridges is your chance to make a real difference in the community. Whether you have just a few hours or are ready to make a long-term commitment, we have a role for you.
              </p>
            </div>
            <div className="header-right">
              <button 
                onClick={handleApplyClick} 
                className="join-btn" 
                style={{border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem'}}
              >
                Join Now
              </button>
            </div>
          </div>

          <div className="steps-grid">
            
            {/* Step 1 */}
            <div className="step-item featured-step">
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h4>1. Explore Opportunities</h4>
              <p>Take a look at the variety of volunteer positions we offer. From hands-on roles like event support to behind-the-scenes work, there is something for everyone.</p>
              <Link to="/events" className="card-btn">Browse Events</Link>
            </div>

            {/* Step 2 */}
            <div className="step-item">
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </div>
              <h4>2. Fill Out Application</h4>
              <p>Once your application is filled out, we will schedule an interview with you to thoroughly explain the program and our Strength-Based Approach philosophy.</p>
              <button 
                onClick={handleApplyClick} 
                className="card-btn" 
                style={{border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit', fontSize: '0.9rem'}}
              >
                Apply Now
              </button>
            </div>

            {/* Step 3 - FIXED: Removed disabled styling */}
            <div className="step-item">
              <div className="step-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
              <h4>3. Start Making An Impact</h4>
              <p>With the proper training and support, you’ll begin contributing to one of our exciting initiatives. Together, we’ll make a difference.</p>
              {/* Removed pointerEvents: 'none' */}
              <Link to="/events" className="card-btn">Events</Link>
            </div>

          </div>
        </section>

        {/* --- SDG SECTION --- */}
        <section className="sdg-section">
          <div className="sdg-header-left">
            <h2>Supporting the Goals</h2>
            <p className="sdg-subtitle">Sustainable Development Goals (SDGs)</p>
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
            {['Illysha Amira', 'Nur Syuhailie', 'Nur Durrah', 'Roisatul Syamiela'].map((name, i) => (
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