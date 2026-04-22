import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import aboutBanner from "../../assets/about_banner.png";
import "./About.css";

const PLATFORM_FEATURES = [
    { title: "TalentAI Pulse", icon: "fa-bolt", desc: "Real-time job market trends and sector performance analysis.", path: "/pulse" },
    { title: "Mock Interview", icon: "fa-microphone-lines", desc: "AI-powered simulation with video, timer, and detailed feedback.", path: "/mock-interview" },
    { title: "AI CV Builder", icon: "fa-pen-nib", desc: "Create high-impact, ATS-optimized resumes in minutes.", path: "/cvbuilder" },
    { title: "Resume Matcher", icon: "fa-file-circle-check", desc: "Scan your resume against job descriptions for a perfect match.", path: "/resume-matcher" },
    { title: "Career Roadmap", icon: "fa-map-location-dot", desc: "Dynamic learning paths synthesized from successful career shifts.", path: "/career-roadmap" },
    { title: "Branding Assistant", icon: "fa-user-astronaut", desc: "Optimize your professional identity across LinkedIn and social media.", path: "/branding-assistant" },
    { title: "Pivot Predictor", icon: "fa-arrows-spin", desc: "Forecast technical longevity and find your next pivot vector.", path: "/pivot-predictor" },
    { title: "Offer Balancer", icon: "fa-scale-balanced", desc: "Compare job offers beyond salary using total life value metrics.", path: "/offer-calculator" },
    { title: "Internet Speed", icon: "fa-gauge-high", desc: "Ensure your infrastructure is ready for remote technical interviews.", path: "/internetspeed" }
];

export default function About() {
    return (
        <div className="about-grand-wrapper">
            <Header />
            
            <div className="container">
                {/* Hero Section */}
                <div className="about-glass-card">
                    <div className="about-logo">
                        <i className="fa-solid fa-chart-line me-2 text-primary"></i> NextHire
                    </div>
                    <h1 className="about-page-title">Innovating the<br/>Future of Work.</h1>

                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <img src={aboutBanner} alt="About NextHire" className="about-illustration" />
                        </div>
                        <div className="col-lg-6 ps-lg-5">
                            <h2 className="about-mission-title">Our Mission</h2>
                            <p className="about-mission-text">
                                We are on a mission to empower the global workforce by bridging the gap between human potential and artificial intelligence. 
                                NextHire provides the tools and insights needed to navigate the modern career landscape with confidence.
                            </p>
                            
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <h5 className="fw-bold mb-2"><i className="fa-solid fa-eye text-primary me-2"></i> Our Vision</h5>
                                    <p className="small text-muted">To become the world's most trusted AI career companion.</p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="fw-bold mb-2"><i className="fa-solid fa-heart text-danger me-2"></i> Our Values</h5>
                                    <p className="small text-muted">Innovation, Integrity, and People-First technology.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ecosystem Showcase Section */}
                <div className="ecosystem-section text-center">
                    <span className="section-tag">NextHire Ecosystem</span>
                    <h2 className="fw-black display-5 mb-3">Our Services & Features</h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Explore the powerful suite of AI-driven tools designed to accelerate your career journey.
                    </p>

                    <div className="ecosystem-grid">
                        {PLATFORM_FEATURES.map((feature, index) => (
                            <Link key={index} to={feature.path} className="feature-card-premium animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="feature-icon-box">
                                    <i className={`fa-solid ${feature.icon}`}></i>
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="cta-box-premium text-center">
                    <h2 className="display-5 mb-3">Ready to level up your career?</h2>
                    <p className="mb-4">Join thousands of professionals using NextHire to find their dream roles.</p>
                    <Link to="/alljobs" className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill text-primary shadow">Explore All Jobs</Link>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
