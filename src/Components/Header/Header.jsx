import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TheUserContext } from '../UserContext/UserContext'
import "./Header.css"

const NOTIFICATIONS = [
    { id: 1, text: "3 new React Developer jobs posted!", time: "5m ago" },
    { id: 2, text: "Your saved job 'Backend Engineer' is still open.", time: "1h ago" },
    { id: 3, text: "New AI tools added to the platform.", time: "3h ago" },
];

export default function Header() {
    const { userData, logout } = useContext(TheUserContext);
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [showBell, setShowBell] = useState(false);
    const [unreadCount] = useState(NOTIFICATIONS.length);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <nav className="navbar navbar-expand-lg top-nav-floating">
            <div className="container nav-pill-container d-flex justify-content-between align-items-center">
                {/* Logo */}
                <Link className="navbar-brand text-decoration-none" to="/">
                    <div className="d-flex align-items-center logo-text">
                        <span className="logo-icon me-2">N</span>
                        <span className="logo-word">Next<span className="logo-cyan">Hire</span></span>
                    </div>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#photoNavbar" aria-controls="photoNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Central Links */}
                <div className="collapse navbar-collapse justify-content-center" id="photoNavbar">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 gap-2">
                        <li className="nav-item">
                            <Link className="nav-link text-light nav-photo-link" to="/alljobs">Job Seekers</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-light nav-photo-link" to="/companypage">Employers</Link>
                        </li>

                        {/* Services Dropdown */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle text-light nav-photo-link" to="#" id="servicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                AI Services
                            </Link>
                            <ul className="dropdown-menu glass-dropdown shadow-lg border-0 mt-3" aria-labelledby="servicesDropdown">
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/resume-matcher"><i className="fa-solid fa-file-contract text-cyan me-2 w-20"></i>Resume Matcher</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/cvbuilder"><i className="fa-solid fa-pen-nib text-cyan me-2 w-20"></i>AI CV Builder</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/cover-letter"><i className="fa-solid fa-envelope-open-text text-cyan me-2 w-20"></i>Cover Letter Architect</Link></li>
                                <li><hr className="dropdown-divider neon-divider mx-3 my-2" /></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/mock-interview"><i className="fa-solid fa-microphone-lines text-cyan me-2 w-20"></i>Mock Interview</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/career-roadmap"><i className="fa-solid fa-map-location-dot text-cyan me-2 w-20"></i>Career Roadmap</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/branding-assistant"><i className="fa-solid fa-user-astronaut text-cyan me-2 w-20"></i>Branding Assistant</Link></li>
                                <li><hr className="dropdown-divider neon-divider mx-3 my-2" /></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/pivot-predictor"><i className="fa-solid fa-shuffle text-cyan me-2 w-20"></i>Pivot Predictor</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/offer-calculator"><i className="fa-solid fa-scale-balanced text-cyan me-2 w-20"></i>Offer Analyzer</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/internetspeed"><i className="fa-solid fa-gauge-high text-cyan me-2 w-20"></i>Speed Test</Link></li>
                                <li><hr className="dropdown-divider neon-divider mx-3 my-2" /></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/saved-jobs"><i className="fa-solid fa-heart text-cyan me-2 w-20"></i>Saved Jobs</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2" to="/my-applications"><i className="fa-solid fa-list-check text-cyan me-2 w-20"></i>My Applications</Link></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link text-light nav-photo-link" to="/about">About</Link>
                        </li>
                    </ul>
                </div>

                {/* Right Area */}
                <div className="d-none d-lg-flex align-items-center gap-3">
                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                        <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
                    </button>

                    {/* Notification Bell */}
                    {userData && (
                        <div className="position-relative">
                            <button className="bell-btn" onClick={() => setShowBell(!showBell)} title="Notifications">
                                <i className="fa-solid fa-bell"></i>
                                {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
                            </button>
                            {showBell && (
                                <div className="notif-dropdown glass-dropdown p-2 shadow-lg">
                                    <p className="text-cyan small fw-bold px-2 mb-2 border-bottom border-secondary border-opacity-25 pb-2">
                                        Notifications
                                    </p>
                                    {NOTIFICATIONS.map(n => (
                                        <div key={n.id} className="notif-item px-2 py-2 rounded-2 mb-1">
                                            <p className="text-light small mb-0">{n.text}</p>
                                            <span className="text-secondary" style={{ fontSize: "0.7rem" }}>{n.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {userData ? (
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-white fw-bold">
                                <i className="fa-solid fa-user-circle text-cyan me-2"></i>
                                {userData.name}
                            </span>
                            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm px-3 py-1">
                                <i className="fa-solid fa-power-off"></i>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn login-signup-btn text-white px-4 py-2">
                            Log In / Sign Up
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
