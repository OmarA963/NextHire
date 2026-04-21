import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("BOOTING NEURAL CORE...");

    const STATUS_STEPS = [
        { at: 20, text: "LOADING AI MATRIX..." },
        { at: 45, text: "SYNCING JOB DATABASE..." },
        { at: 70, text: "CALIBRATING TALENT ENGINE..." },
        { at: 90, text: "ESTABLISHING SECURE LINK..." },
        { at: 100, text: "SYSTEM READY." },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 1.5;
                const step = STATUS_STEPS.find(s => Math.round(next) === s.at);
                if (step) setStatusText(step.text);
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 600);
                    return 100;
                }
                return next;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="loading-logo">
                    <span className="loading-logo-n">N</span>
                    <span className="loading-logo-word">ext<span className="loading-logo-hire">Hire</span></span>
                </div>
                <p className="loading-status">{statusText}</p>
                <div className="loading-bar-track">
                    <div className="loading-bar-fill" style={{ width: `${progress}%` }}></div>
                    <div className="loading-bar-glow" style={{ left: `${progress}%` }}></div>
                </div>
                <p className="loading-percent">{Math.round(progress)}%</p>
                <div className="loading-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
            <div className="loading-grid-overlay"></div>
        </div>
    );
}
