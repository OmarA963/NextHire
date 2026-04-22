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
                        <i className="fa-solid fa-chart-line fs-4 logo-icon-svg me-2"></i>
                        <span className="logo-word">NextHire</span>
                    </div>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#photoNavbar" aria-controls="photoNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Central Links */}
                <div className="collapse navbar-collapse justify-content-center" id="photoNavbar">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 gap-2">
                        <li className="nav-item">
                            <Link className="nav-link text-dark nav-photo-link fw-semibold" to="/">Home</Link>
                        </li>
                        {/* Services Dropdown as Features */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle text-dark nav-photo-link fw-semibold" to="#" id="servicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Features
                            </Link>
                            <ul className="dropdown-menu glass-dropdown shadow-lg border-0 mt-3 p-2" aria-labelledby="servicesDropdown" style={{ minWidth: '280px' }}>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/pulse"><i className="fa-solid fa-bolt text-primary me-2"></i>TalentAI Pulse</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/resume-matcher"><i className="fa-solid fa-file-contract text-primary me-2"></i>Resume Matcher</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/cvbuilder"><i className="fa-solid fa-pen-nib text-primary me-2"></i>AI CV Builder</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/cover-letter"><i className="fa-solid fa-envelope-open-text text-primary me-2"></i>Cover Letter Architect</Link></li>
                                <li><hr className="dropdown-divider my-2 opacity-50" /></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/mock-interview"><i className="fa-solid fa-microphone-lines text-primary me-2"></i>Mock Interview</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/career-roadmap"><i className="fa-solid fa-map-location-dot text-primary me-2"></i>Career Roadmap</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/branding-assistant"><i className="fa-solid fa-user-astronaut text-primary me-2"></i>Branding Assistant</Link></li>
                                <li><hr className="dropdown-divider my-2 opacity-50" /></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/pivot-predictor"><i className="fa-solid fa-arrows-spin text-primary me-2"></i>Pivot Predictor</Link></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/offer-calculator"><i className="fa-solid fa-calculator text-primary me-2"></i>Offer Weight Calculator</Link></li>
                                <li><hr className="dropdown-divider my-2 opacity-50" /></li>
                                <li><Link className="dropdown-item glass-dropdown-item py-2 rounded-2" to="/internetspeed"><i className="fa-solid fa-gauge-high text-primary me-2"></i>Internet Speed</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark nav-photo-link fw-semibold" to="/companypage">For Companies</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark nav-photo-link fw-semibold" to="/alljobs">For Candidates</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark nav-photo-link fw-semibold" to="/about">About</Link>
                        </li>
                    </ul>
                </div>

                {/* Right Area */}
                <div className="d-none d-lg-flex align-items-center gap-3">
                    {/* Notification Bell */}
                    {userData && (
                        <div className="position-relative">
                            <button className="bell-btn bg-white shadow-sm border-0 rounded-circle p-2" onClick={() => setShowBell(!showBell)} title="Notifications">
                                <i className="fa-solid fa-bell text-secondary"></i>
                                {unreadCount > 0 && <span className="bell-badge bg-danger rounded-circle p-1 position-absolute top-0 end-0"></span>}
                            </button>
                            {showBell && (
                                <div className="notif-dropdown bg-white p-2 shadow-lg rounded-3 position-absolute end-0 mt-2" style={{width: '250px', zIndex: 1000}}>
                                    <p className="text-dark small fw-bold px-2 mb-2 border-bottom pb-2">
                                        Notifications
                                    </p>
                                    {NOTIFICATIONS.map(n => (
                                        <div key={n.id} className="notif-item px-2 py-2 rounded-2 mb-1 bg-light">
                                            <p className="text-dark small mb-0">{n.text}</p>
                                            <span className="text-secondary" style={{ fontSize: "0.7rem" }}>{n.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {userData ? (
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-dark fw-bold">
                                <i className="fa-solid fa-user-circle text-cyan me-2"></i>
                                {userData.name}
                            </span>
                            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm px-3 py-1 rounded-pill">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center gap-2">
                            <Link to="/register" className="btn-signup-clean">
                                Sign Up
                            </Link>
                            <Link to="/login" className="btn-login-clean">
                                Log In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
