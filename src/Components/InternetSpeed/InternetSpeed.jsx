import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './InternetSpeed.css';

const InternetSpeedChecker = () => {
    const [speed, setSpeed] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonText, setButtonText] = useState('INITIALIZE TEST');

    const checkSpeed = () => {
        const imageLink = "https://upload.wikimedia.org/wikipedia/commons/a/a1/Tokyo_Sky_Tree_East_Tower_2012.JPG";
        const downloadSize = 11855374;
        const time_start = new Date().getTime();
        const chachImg = "?nn=" + time_start;
        const downloadSrc = new Image();

        setSpeed(null);
        setIsLoading(true);

        downloadSrc.src = imageLink + chachImg;

        downloadSrc.onload = () => {
            const time_end = new Date().getTime();
            const timeDuration = (time_end - time_start) / 1000;
            const loadedBytes = downloadSize * 8;
            const totalSpeed = ((loadedBytes / timeDuration) / 1024 / 1024).toFixed(2);

            let i = 0;
            const animate = () => {
                if (i < parseFloat(totalSpeed)) {
                    setSpeed(i.toFixed(2));
                    setTimeout(animate, 20);
                    i += 1.02;
                } else {
                    setSpeed(totalSpeed);
                    setIsLoading(false);
                    setButtonText('RERUN ANALYSIS');
                }
            };
            animate();
        };
    };

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container speed-checker-container animate-in">
                <div className="loader-widget">
                    <h1>Neural <span className="text-cyan">Speed Test</span></h1>
                    
                    <div className="speed-display">
                        {isLoading && <div className="loader"></div>}
                        <div className="speed-value">{speed || '00.00'}</div>
                        <div className="speed-unit">MBPS</div>
                    </div>

                    <div className="speed-status">
                        {isLoading ? 'ANALYZING PACKET VELOCITY...' : (speed ? 'DIAGNOSTIC COMPLETE' : 'AWAITING NEURAL LINK')}
                    </div>

                    <div className="d-block mb-4">
                        <button onClick={checkSpeed} className="btn-speed" disabled={isLoading}>
                            {isLoading ? 'ANALYZING...' : buttonText}
                        </button>
                    </div>

                    <div className="ping-info">
                        <div className="ping-item">
                            LATENCY <span>24ms</span>
                        </div>
                        <div className="ping-item">
                            JITTER <span>2ms</span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InternetSpeedChecker;

