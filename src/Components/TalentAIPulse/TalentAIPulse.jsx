import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './TalentAIPulse.css';
import pulseBannerCalm from '../../assets/pulse_banner_calm.png';

const TICKER_DATA = [
    { label: "Frontend Dev", surge: "+12%" },
    { label: "AI Engineer", surge: "+45%" },
    { label: "Cybersecurity", surge: "+28%" },
    { label: "Product Manager", surge: "+8%" },
    { label: "Data Scientist", surge: "+22%" },
    { label: "Cloud Architect", surge: "+34%" },
    { label: "UX Designer", surge: "+15%" }
];

const SECTOR_TRENDS = [
    { name: "FinTech", growth: "+18.5%", volume: "High" },
    { name: "HealthTech", growth: "+22.1%", volume: "Medium" },
    { name: "AI & ML", growth: "+54.2%", volume: "Extreme" },
    { name: "Green Energy", growth: "+14.8%", volume: "Growing" },
    { name: "E-Commerce", growth: "+9.2%", volume: "Stable" }
];

export default function TalentAIPulse() {
    const [counter, setCounter] = useState(145000);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(prev => prev + Math.floor(Math.random() * 5));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pulse-page">
            <Header />
            
            <div className="pulse-wrapper">
                {/* Hero Banner Section */}
                <div className="pulse-header-card">
                    <img src={pulseBannerCalm} alt="Market Pulse" className="pulse-banner-img" />
                    <div className="pulse-header-overlay">
                        <h1>TalentAI Pulse</h1>
                        <p className="text-secondary fs-5">Synchronizing global recruitment frequencies in real-time.</p>
                    </div>
                </div>

                {/* Live Ticker Section */}
                <div className="live-ticker-container">
                    <div className="ticker-content">
                        {TICKER_DATA.concat(TICKER_DATA).map((item, index) => (
                            <div key={index} className="ticker-item">
                                {item.label} <span>{item.surge}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="pulse-main-grid">
                    {/* Market Volume Card */}
                    <div className="pulse-card-premium">
                        <h3><i className="fa-solid fa-chart-pie text-primary"></i> Market Ecosystem</h3>
                        <p className="text-muted mb-5">A comprehensive view of the current hiring volume and sector performance across global nodes.</p>
                        
                        <div className="data-grid">
                            <div className="data-point">
                                <h4>{counter.toLocaleString()}</h4>
                                <p>Active Job Slots</p>
                            </div>
                            <div className="data-point">
                                <h4>42,102</h4>
                                <p>Hiring Companies</p>
                            </div>
                            <div className="data-point">
                                <h4>$92k</h4>
                                <p>Avg. Global Salary</p>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-top">
                            <h5 className="fw-bold mb-4">Live Activity Log</h5>
                            <div className="alert alert-primary bg-light border-0 rounded-4 p-3 d-flex align-items-center">
                                <div className="spinner-grow spinner-grow-sm text-primary me-3"></div>
                                <span className="small fw-semibold">New hiring surge detected in "AI & Machine Learning" sector (New York Node).</span>
                            </div>
                        </div>
                    </div>

                    {/* Sector Performance Sidebar */}
                    <div className="pulse-card-premium">
                        <h3><i className="fa-solid fa-bolt text-warning"></i> Hot Sectors</h3>
                        <div className="sector-list mt-2">
                            {SECTOR_TRENDS.map((sector, index) => (
                                <div key={index} className="sector-item animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="sector-info">
                                        <h5>{sector.name}</h5>
                                        <span>Volume: {sector.volume}</span>
                                    </div>
                                    <div className="sector-trend">{sector.growth}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Insight Panel */}
                <div className="insight-panel-premium shadow-lg">
                    <div className="insight-icon-box">
                        <i className="fa-solid fa-microchip"></i>
                    </div>
                    <div>
                        <h3 className="text-white mb-2 fw-bold">Neural Insight</h3>
                        <p className="opacity-75 fs-5 m-0">
                            "Current data patterns indicate a 12% rise in demand for <strong>Hybrid Work</strong> roles. 
                            Companies are increasingly prioritizing <strong>System Architecture</strong> over individual tool proficiency."
                        </p>
                    </div>
                </div>

                <div className="text-center mt-5 opacity-50">
                    <p className="small"><i className="fa-solid fa-clock-rotate-left me-2"></i> Last global sync: 2 minutes ago</p>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
