import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import aboutImage from "../../assets/ai_about.png";
import "./About.css";

export default function About() {
  return (
    <>
      <div className="container-fluid p-0 about-grand-wrapper">
        <Header />
        <div className="container">
          <div className="hero row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0 text-center">
                <div className="position-relative d-inline-block">
                    <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'130%', height:'130%'}}></div>
                    <img className="img-fluid rounded-4 shadow-lg position-relative z-2" src={aboutImage} alt="AI Core" style={{maxWidth: '450px'}} />
                </div>
            </div>
            <div className="info col-lg-6">
              <span className="section-tag">Our Mission</span>
              <h1 className="about-title fw-bold">Next-Gen <span className="text-cyan">TalentAI</span></h1>
              <p className="special-paragraph mb-4">
                We are a visionary team of developers and strategists committed to redefining the intersection of human talent and artificial intelligence. 
                NextHire isn't just a job board; it's a neural network for career growth. 
                Our mission is to eliminate the friction in modern hiring by providing intelligent, 
                data-driven tools that empower both candidates and corporations in an ever-evolving digital economy.
              </p>
              <div className="d-flex gap-3">
                <Link to={"/login"} className="btn btn-cyan-glow fw-bold px-4 py-3">Initialize Journey</Link>
                <Link to={"/register"} className="btn btn-purple-glow fw-bold px-4 py-3 text-white">Join the Network</Link>
              </div>
            </div>
          </div>

          <div className="theproperties">
            <span className="section-tag text-center w-100">Core Architecture</span>
            <h2 className="text-center">System Properties</h2>
            <div className="properties">
              <div className="property">
                <i className="fa-solid fa-earth-americas"></i>
                <h3>Universal Sync</h3>
                <p>Global accessibility across all borders. Deploy your career path anywhere in the digital world with real-time market synchronization.</p>
              </div>
              <div className="property">
                <i className="fa-solid fa-bolt"></i>
                <h3>Zero Friction</h3>
                <p>Eliminate mid-tier hurdles. Direct, high-bandwidth connection between elite talent and emerging opportunities.</p>
              </div>
              <div className="property">
                <i className="fa-solid fa-shield-halved"></i>
                <h3>Privacy First</h3>
                <p>Your professional data is encrypted and managed via neural protocols, ensuring maximum security in the age of AI.</p>
              </div>
            </div>
          </div>

          <div className="theproperties pt-0">
            <span className="section-tag text-center w-100">Neural Modules</span>
            <h2 className="text-center">Advanced Services</h2>
            <div className="properties">
              <div className="property">
                <i className="fa-solid fa-microphone-lines"></i>
                <h3>Interview Simulator</h3>
                <p>
                  <Link to="/mock-interview">Practice with our AI-powered voice simulator</Link> for high-stakes technical and cultural evaluations.
                </p>
              </div>
              <div className="property">
                <i className="fa-solid fa-map-location-dot"></i>
                <h3>Career Roadmap</h3>
                <p>
                  <Link to="/career-roadmap">Dynamic learning paths</Link> synthesized from millions of successful career transitions.
                </p>
              </div>
              <div className="property">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <h3>Branding Assistant</h3>
                <p>
                  <Link to="/branding-assistant">Algorithmic profile optimization</Link> to boost your index across professional networks.
                </p>
              </div>
              <div className="property">
                <i className="fa-solid fa-file-circle-check"></i>
                <h3>Resume Scorer</h3>
                <p>
                  <Link to="/resume-matcher">ATS-Optimized matching</Link> to ensure your technical profile reaches human eyes after neural filtering.
                </p>
              </div>
              <div className="property">
                <i className="fa-solid fa-crystal-ball"></i>
                <h3>Pivot Predictor</h3>
                <p>
                  <Link to="/pivot-predictor">Forecasting market shifts</Link> and identifying the next high-value technical skill to acquire.
                </p>
              </div>
              <div className="property">
                <i className="fa-solid fa-scale-balanced"></i>
                <h3>Offer Calculator</h3>
                <p>
                  <Link to="/offer-calculator">Total Life Value weightage</Link> to compare complex offers beyond the baseline salary parameter.
                </p>
              </div>
            </div>
          </div>
          
        </div>
        <Footer />
      </div>
    </>
  );
}
