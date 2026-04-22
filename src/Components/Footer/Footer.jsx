import React from 'react'
import { Link } from 'react-router-dom'
import "./Footer.css"

export default function Footer() {
    return (
        <footer className="footer-container pt-5 pb-4 mt-5">
            <div className="container px-4">
                <div className="row">
                    {/* Brand Column */}
                    <div className="col-lg-3 col-md-12 mb-4 mb-md-0 d-flex flex-column pe-lg-5">
                        <Link to="/" className="text-decoration-none mb-3 d-inline-block">
                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-chart-line fs-4 me-2" style={{color: '#4A90E2'}}></i>
                                <h4 className="footer-logo m-0 fw-bold" style={{color: '#1A1A1A'}}>NextHire</h4>
                            </div>
                        </Link>
                        <p className="footer-subtext mb-5">
                            Unlock Your Career Potential<br/>with AI-Driven Recruitment
                        </p>
                        <p className="footer-bottom-text mt-lg-5 pt-lg-4 mb-0">Montserrat/Inter</p>
                    </div>

                    {/* Company Column */}
                    <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
                        <h6 className="footer-heading mb-4 fw-bold">Company</h6>
                        <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                            <li><Link to="/alljobs" className="footer-link">Job Seekers</Link></li>
                            <li><Link to="/companypage" className="footer-link">Employers</Link></li>
                            <li><Link to="/internetspeed" className="footer-link">Speed Test</Link></li>
                            <li><Link to="#" className="footer-link">Platform</Link></li>
                            <li><Link to="/about" className="footer-link">About</Link></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
                        <h6 className="footer-heading mb-4 fw-bold">Resources</h6>
                        <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                            <li><Link to="/about" className="footer-link">About Us</Link></li>
                            <li><Link to="/alljobs" className="footer-link">Recruitments</Link></li>
                            <li><Link to="#" className="footer-link">Contact</Link></li>
                            <li><Link to="/companypage" className="footer-link">Company Insights</Link></li>
                            <li><Link to="#" className="footer-link">Terms of Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us Column */}
                    <div className="col-lg-3 col-md-4 mb-4 mb-md-0 d-flex flex-column position-relative">
                        <h6 className="footer-heading mb-4 fw-bold">Contact Us</h6>
                        <div className="social-icons d-flex gap-2 mb-4">
                            <a href="#" className="social-icon"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" className="social-icon"><i className="fa-brands fa-twitter"></i></a>
                            <a href="#" className="social-icon"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a href="#" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
                        </div>
                        
                        <p className="footer-bottom-text mb-0 position-absolute bottom-0 end-0">NextHire © 2026</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
