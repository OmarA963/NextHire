import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./ApplicationTracker.css";

const STATUSES = ["Pending", "Reviewed", "Interview", "Decision"];
const STATUS_COLORS = {
    Pending: "rgba(255, 193, 7, 0.2)",
    Reviewed: "rgba(0, 240, 255, 0.2)",
    Interview: "rgba(176, 38, 255, 0.2)",
    Decision: "rgba(40, 200, 100, 0.2)",
};
const STATUS_TEXT_COLORS = {
    Pending: "#ffc107",
    Reviewed: "#00f0ff",
    Interview: "#b026ff",
    Decision: "#28c878",
};

export default function ApplicationTracker() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
        setApplications(stored);
    }, []);

    const advanceStatus = (index) => {
        const updated = [...applications];
        const currentIdx = STATUSES.indexOf(updated[index].status);
        if (currentIdx < STATUSES.length - 1) {
            updated[index].status = STATUSES[currentIdx + 1];
            setApplications(updated);
            localStorage.setItem("appliedJobs", JSON.stringify(updated));
        }
    };

    const removeApplication = (index) => {
        const updated = applications.filter((_, i) => i !== index);
        setApplications(updated);
        localStorage.setItem("appliedJobs", JSON.stringify(updated));
    };

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container py-5 mt-3">
                <div className="text-center mb-5">
                    <span className="section-tag animate-in">Career Pipeline</span>
                    <h1 className="display-4 fw-bold text-white mb-3">
                        Application <span className="text-purple">Tracker</span>
                    </h1>
                    <p className="text-secondary opacity-75">Monitor your application status across all active career vectors.</p>
                </div>

                {/* Status Pipeline Legend */}
                <div className="pipeline-legend d-flex justify-content-center gap-2 flex-wrap mb-5">
                    {STATUSES.map((s, i) => (
                        <React.Fragment key={s}>
                            <div className="pipeline-step" style={{ background: STATUS_COLORS[s], color: STATUS_TEXT_COLORS[s] }}>
                                {s}
                            </div>
                            {i < STATUSES.length - 1 && <span className="text-secondary align-self-center">→</span>}
                        </React.Fragment>
                    ))}
                </div>

                {applications.length === 0 ? (
                    <div className="text-center py-5 animate-in">
                        <i className="fa-regular fa-folder-open text-secondary mb-4" style={{ fontSize: "4rem" }}></i>
                        <h4 className="text-white mb-2">No Applications Tracked</h4>
                        <p className="text-secondary">Apply to jobs from the Job Matrix — your career pipeline will populate here.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {applications.map((app, i) => (
                            <div key={i} className="col-lg-6 animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="job-glass-card p-4 rounded-4 application-card">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 className="text-white fw-bold mb-1">{app.title}</h5>
                                            <span className="text-secondary small">{app.location}</span>
                                        </div>
                                        <span
                                            className="status-badge px-3 py-1 rounded-pill fw-bold small"
                                            style={{ background: STATUS_COLORS[app.status], color: STATUS_TEXT_COLORS[app.status] }}
                                        >
                                            {app.status}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="progress-track mb-4">
                                        {STATUSES.map((s, idx) => (
                                            <div
                                                key={s}
                                                className="progress-node"
                                                style={{
                                                    background: STATUSES.indexOf(app.status) >= idx
                                                        ? STATUS_TEXT_COLORS[app.status]
                                                        : "rgba(255,255,255,0.1)"
                                                }}
                                            ></div>
                                        ))}
                                    </div>

                                    <div className="d-flex gap-2">
                                        {app.status !== "Decision" && (
                                            <button
                                                className="btn btn-purple-glow flex-grow-1 py-2 small"
                                                onClick={() => advanceStatus(i)}
                                            >
                                                <i className="fa-solid fa-arrow-right me-2"></i>Advance Status
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-outline-secondary px-3"
                                            onClick={() => removeApplication(i)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
