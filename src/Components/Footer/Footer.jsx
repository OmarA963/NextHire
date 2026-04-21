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
                            <h4 className="footer-logo m-0 fw-bold">Next<span className="text-white">Hire</span></h4>
                        </Link>
                        <p className="footer-subtext text-secondary mb-5">
                            Unlock Your Career Potential<br/>with AI-Driven Recruitment
                        </p>
                        <p className="footer-bottom-text text-secondary mt-lg-5 pt-lg-4 mb-0">Montserrat/Inter</p>
                    </div>

                    {/* Company Column */}
                    <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
                        <h6 className="footer-heading mb-4 text-white fw-bold">Company</h6>
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
                        <h6 className="footer-heading mb-4 text-white fw-bold">Resources</h6>
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
                        <h6 className="footer-heading mb-4 text-white fw-bold">Contact Us</h6>
                        <div className="social-icons d-flex gap-2 mb-4">
                            <a href="#" className="social-icon"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" className="social-icon"><i className="fa-brands fa-twitter"></i></a>
                            <a href="#" className="social-icon"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a href="#" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" className="social-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
                                </svg>
                            </a>
                            <a href="#" className="social-icon"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                        
                        <p className="footer-bottom-text text-secondary mb-0 position-absolute bottom-0 end-0">Donama © 2023</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
