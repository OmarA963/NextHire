import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Home.css";

import heroImg1 from "../../assets/hero_img_1.png";
import heroImg2 from "../../assets/hero_img_2.png";
import heroImg3 from "../../assets/hero_img_3.png";

export default function Home() {
  return (
    <div className="landing-page-wrapper pb-5">
      <Header />
      {/* Background Decorators */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      
      <div className="container position-relative hero-container" style={{ zIndex: 1, paddingTop: '80px' }}>
        
        {/* Floating Images */}
        <div className="floating-img-container img-left d-none d-lg-block">
          <img src={heroImg2} alt="Team working" className="floating-img rounded-circle shadow-lg" />
          <div className="floating-badge badge-remote shadow-sm">Remote</div>
        </div>
        
        <div className="floating-img-container img-right-top d-none d-lg-block">
          <img src={heroImg1} alt="Colleagues" className="floating-img rounded-circle shadow-lg" />
        </div>
        
        <div className="floating-img-container img-right-bottom d-none d-lg-block">
          <img src={heroImg3} alt="Meeting" className="floating-img rounded-circle shadow-lg" />
          <div className="floating-badge badge-startups shadow-sm">Startups</div>
        </div>

        {/* Hero Content */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <h1 className="hero-title fw-bold text-dark mb-4 mx-auto" style={{ maxWidth: '600px', fontSize: '4rem', lineHeight: '1.1' }}>
              Unlock Your Career<br/>Potential with AI.
            </h1>
            <p className="hero-subtitle text-secondary fs-5 mb-5 mx-auto" style={{ maxWidth: '500px' }}>
              Your smarter path to the perfect job. Let our advanced AI match your skills with the best opportunities globally.
            </p>
            
            {/* Search Bar */}
            <div className="hero-search-wrapper mx-auto position-relative" style={{ maxWidth: '700px' }}>
              <div className="search-box bg-white rounded-pill shadow-lg d-flex align-items-center p-2 mb-3">
                <input 
                  type="text" 
                  className="form-control border-0 bg-transparent ps-4 fs-5" 
                  placeholder="Find your dream job... (e.g., Software Engineer, Marketing)" 
                  style={{ boxShadow: 'none' }}
                />
                <button className="btn btn-search rounded-circle d-flex justify-content-center align-items-center" style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa' }}>
                  <i className="fa-solid fa-magnifying-glass text-secondary"></i>
                </button>
              </div>
              
              {/* Tags */}
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-normal">Engineering</span>
                <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-normal">Full-time</span>
                <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-normal">New York</span>
                <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-normal">Data Science</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row justify-content-center g-4 stats-row mb-5" style={{ marginTop: '80px' }}>
          <div className="col-md-6 col-lg-3">
            <div className="stat-card bg-white p-4 rounded-4 shadow-sm h-100">
              <div className="stat-icon-wrapper mb-3" style={{ color: '#4A90E2' }}>
                <i className="fa-solid fa-microchip fs-4"></i>
              </div>
              <h2 className="fw-bold text-dark mb-1">92%</h2>
              <h6 className="fw-bold text-dark mb-2">AI Match Rate</h6>
              <p className="text-secondary small mb-0">High accuracy in candidate evaluation.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="stat-card bg-white p-4 rounded-4 shadow-sm h-100">
              <div className="stat-icon-wrapper mb-3" style={{ color: '#48BB78' }}>
                <i className="fa-solid fa-briefcase fs-4"></i>
              </div>
              <h2 className="fw-bold text-dark mb-1">150,000+</h2>
              <h6 className="fw-bold text-dark mb-2">Active Jobs</h6>
              <p className="text-secondary small mb-0">Advanced AI research and active jobs.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="stat-card bg-white p-4 rounded-4 shadow-sm h-100">
              <div className="stat-icon-wrapper mb-3" style={{ color: '#4299E1' }}>
                <i className="fa-regular fa-building fs-4"></i>
              </div>
              <h2 className="fw-bold text-dark mb-1">45,000+</h2>
              <h6 className="fw-bold text-dark mb-2">Trusted Companies</h6>
              <p className="text-secondary small mb-0">Providing trusted companies and roles.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="stat-card bg-white p-4 rounded-4 shadow-sm h-100">
              <div className="stat-icon-wrapper mb-3" style={{ color: '#805AD5' }}>
                <i className="fa-solid fa-user-check fs-4"></i>
              </div>
              <h2 className="fw-bold text-dark mb-1">1M+</h2>
              <h6 className="fw-bold text-dark mb-2">Successful Hires</h6>
              <p className="text-secondary small mb-0">1M+ successful hires worldwide.</p>
            </div>
          </div>
        </div>

        {/* Benefits & Success Stories */}
        <div className="row g-5 py-5 mb-5 align-items-center">
          {/* Benefits */}
          <div className="col-lg-6 pe-lg-5">
            <h2 className="fw-bold text-dark mb-5" style={{ fontSize: '2.5rem' }}>NextHire Platform<br/>Benefits</h2>
            
            <div className="d-flex mb-4 benefit-item">
              <div className="flex-shrink-0 mt-1">
                <div className="benefit-icon bg-light text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
              </div>
              <div className="ms-4">
                <h5 className="fw-bold text-dark mb-1">Environment benefit</h5>
                <p className="text-secondary">Advanced automation and routing of your platform.</p>
              </div>
            </div>
            
            <div className="d-flex mb-4 benefit-item">
              <div className="flex-shrink-0 mt-1">
                <div className="benefit-icon bg-light text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="fa-solid fa-microchip"></i>
                </div>
              </div>
              <div className="ms-4">
                <h5 className="fw-bold text-dark mb-1">Eminence technology</h5>
                <p className="text-secondary">Setup and rationalized reduced components.</p>
              </div>
            </div>

            <div className="d-flex benefit-item">
              <div className="flex-shrink-0 mt-1">
                <div className="benefit-icon bg-light text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="fa-solid fa-layer-group"></i>
                </div>
              </div>
              <div className="ms-4">
                <h5 className="fw-bold text-dark mb-1">Controller animation</h5>
                <p className="text-secondary">Easy-to-submit quality job material.</p>
              </div>
            </div>
          </div>

          {/* Success Stories Slider */}
          <div className="col-lg-6">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold text-dark mb-0" style={{ fontSize: '2.5rem' }}>Success Stories</h2>
              <div className="d-flex gap-2">
                <button className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }}><i className="fa-solid fa-chevron-left text-secondary"></i></button>
                <button className="btn bg-white rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }}><i className="fa-solid fa-chevron-right text-primary"></i></button>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-10">
                <div className="testimonial-card p-4 rounded-4" style={{ backgroundColor: '#F3E5D8' }}>
                  <p className="text-dark fw-medium mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    "NextHire helps us to get entirely innovative sourcing. It creates an AI section that ever-adapts to job monitoring. <strong>Let our advanced AI match your skills with the best opportunities globally.</strong>"
                  </p>
                  <div className="d-flex align-items-center">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Dady" className="rounded-circle me-3" width="45" height="45" />
                    <div>
                      <h6 className="fw-bold text-dark mb-0">Dady</h6>
                      <span className="text-secondary small">HR Director</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Job Listings */}
        <div className="jobs-container rounded-5 p-5 mb-5 shadow-sm" style={{ backgroundColor: '#D9E8F5' }}>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-2">Dynamic job listings</h2>
              <p className="text-secondary mb-0">Create perfect teams and connect with top talent<br/>including your dynamic job listings.</p>
            </div>
            <Link to="/alljobs" className="btn bg-white rounded-pill text-dark px-4 py-2 fw-semibold shadow-sm">
              View All <i className="fa-solid fa-chevron-right ms-2 small"></i>
            </Link>
          </div>

          <div className="row g-4">
            {[1, 2, 3].map((item) => (
              <div className="col-md-4" key={item}>
                <div className="card bg-white border-0 rounded-4 p-4 shadow-sm h-100 transition-all hover-lift">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-dark rounded p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                        <i className="fa-solid fa-chart-line text-white small"></i>
                      </div>
                      <span className="text-dark small fw-semibold">New York</span>
                    </div>
                    <span className="badge rounded-pill text-success" style={{ backgroundColor: '#E6F4EA' }}>Full-time</span>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">Data Science</h5>
                  <p className="text-secondary small mb-4">(e.g., Software Engineer)</p>
                  <div className="d-flex align-items-center mt-auto pt-3 border-top">
                    <img src={`https://i.pravatar.cc/150?img=${item+20}`} alt="Recruiter" className="rounded-circle me-2" width="24" height="24" />
                    <span className="text-secondary small">New York • High Street</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
