import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="home-page">
      <main className="main-content">
        {/* HERO SECTION */}
        <section className="hero">
          <h1>Empowering Communities Through Volunteering</h1>
          <p>Connect with NGOs, discover local causes, and make an impact in your community.</p>
          <Link to="/events" className="hero-btn">
            Explore Opportunities
          </Link>
        </section>

        {/* SDG SECTION */}
        <section className="sdg-section fade-in">
          <h2>Sustainable Development Goals</h2>
          <div className="sdg-wrapper">
            <div className="sdg-cards">
              <div className="sdg-card slide-up sdg-11">
              </div>
              <div className="sdg-card slide-up sdg-17">
              </div>
            </div>
            <div className="sdg-description slide-up">
              <div className="sdg-line"></div>
              <h3>Why We Focus on SDGs</h3>
              <p>
                Volunteering directly supports the Sustainable Development Goals by building stronger communities,
                encouraging partnerships, and creating sustainable solutions in Penang. SDG 11 and SDG 17 guide our
                mission to make a tangible impact locally and globally.Our volunteering initiatives are closely linked to SDG 11 (Sustainable Cities and Communities) 
                and SDG 17 (Partnerships for the Goals). By promoting inclusive, safe, resilient, and sustainable urban development,
                we help create vibrant communities. Through collaboration with NGOs and local organizations, we foster partnerships that drive collective action towards achieving these goals.
              </p>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="section benefits fade-in">
          <h2>Why Volunteer With Us?</h2>
          <div className="benefit-cards">
            <div className="benefit-card slide-up">
              <h3>Discover Events</h3>
              <p>Explore meaningful opportunities across Penang with trusted NGOs.</p>
            </div>
            <div className="benefit-card slide-up">
              <h3>Connect With NGOs</h3>
              <p>Build relationships with organizations making positive change.</p>
            </div>
            <div className="benefit-card slide-up">
              <h3>Make Real Impact</h3>
              <p>Contribute to causes that matter to your community.</p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section fade-in">
          <h2>Ready to Make an Impact?</h2>
          <p>Join thousands of volunteers contributing to meaningful causes.</p>
          <Link to="/events" className="cta-btn">
            Get Started
          </Link>
        </section>
      </main>

      {/* FOOTER ONLY ON HOME PAGE */}
      <Footer />
    </div>
  );
}
