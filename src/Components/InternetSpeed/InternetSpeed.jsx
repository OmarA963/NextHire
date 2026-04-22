import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './InternetSpeed.css';
import speedBanner from '../../assets/speed_banner.png';

export default function InternetSpeed() {
    const [speed, setSpeed] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("AWAITING CONNECTION");

    const checkSpeed = () => {
        const imageLink = "https://upload.wikimedia.org/wikipedia/commons/a/a1/Tokyo_Sky_Tree_East_Tower_2012.JPG";
        const downloadSize = 11855374; // Bytes
        const timeStart = new Date().getTime();
        const downloadSrc = new Image();

        setSpeed(null);
        setIsLoading(true);
        setStatus("ANALYZING PACKET FLOW...");

        downloadSrc.src = imageLink + "?cache=" + timeStart;

        downloadSrc.onload = () => {
            const timeEnd = new Date().getTime();
            const timeDuration = (timeEnd - timeStart) / 1000;
            const loadedBytes = downloadSize * 8;
            const totalSpeed = ((loadedBytes / timeDuration) / 1024 / 1024).toFixed(2);

            let i = 0;
            const animate = () => {
                if (i < parseFloat(totalSpeed)) {
                    setSpeed(i.toFixed(2));
                    setTimeout(animate, 20);
                    i += 1.5;
                } else {
                    setSpeed(totalSpeed);
                    setIsLoading(false);
                    setStatus("NETWORK DIAGNOSTIC COMPLETE");
                }
            };
            animate();
        };
    };

    return (
        <div className="speed-test-page">
            <Header />
            
            <div className="speed-wrapper">
                {/* Header Section */}
                <div className="speed-header-card">
                    <img src={speedBanner} alt="Speed Test" className="speed-banner-img" />
                    <div className="speed-intro-text">
                        <h1>Connectivity Optimizer</h1>
                        <p>Ensure your network infrastructure is ready for high-fidelity remote interviews and real-time collaboration.</p>
                    </div>
                </div>

                {/* Speed Widget */}
                <div className="speed-widget-card animate-in">
                    <div className={`speed-circle-display ${isLoading ? 'testing' : ''}`}>
                        <div className="speed-value-big">{speed || '0.0'}</div>
                        <div className="speed-unit-label">MBPS</div>
                    </div>

                    <div className="speed-status-text">
                        {status}
                    </div>

                    <button 
                        className="speed-btn-action" 
                        onClick={checkSpeed} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'ANALYZING...' : (speed ? 'RERUN DIAGNOSTIC' : 'START SPEED TEST')}
                    </button>

                    <div className="ping-stats-row">
                        <div className="stat-item-box">
                            <label>Latency</label>
                            <span>24 ms</span>
                        </div>
                        <div className="stat-item-box">
                            <label>Jitter</label>
                            <span>3 ms</span>
                        </div>
                        <div className="stat-item-box">
                            <label>Stability</label>
                            <span>Excellent</span>
                        </div>
                    </div>
                </div>

                <div className="mt-5 p-4 bg-light rounded-4 border-start border-4 border-primary">
                    <p className="small text-muted mb-0">
                        <strong>Neural Tip:</strong> For high-quality 4K video interviews, we recommend a minimum stable download speed of 15 MBPS.
                    </p>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
