import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { applicationsAPI } from "../../services/api";
import "./ApplicationTracker.css";

const STATUSES = ["APPLIED", "IN_REVIEW", "INTERVIEW_SCHEDULED", "INTERVIEW_COMPLETED", "OFFER_RECEIVED", "ACCEPTED"];
const STATUS_DISPLAY = {
    APPLIED: "Applied",
    IN_REVIEW: "In Review",
    INTERVIEW_SCHEDULED: "Interview",
    INTERVIEW_COMPLETED: "Completed",
    OFFER_RECEIVED: "Offer",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected"
};
const STATUS_COLORS = {
    APPLIED: "rgba(255, 193, 7, 0.2)",
    IN_REVIEW: "rgba(0, 240, 255, 0.2)",
    INTERVIEW_SCHEDULED: "rgba(176, 38, 255, 0.2)",
    INTERVIEW_COMPLETED: "rgba(0, 180, 255, 0.2)",
    OFFER_RECEIVED: "rgba(40, 200, 100, 0.2)",
    ACCEPTED: "rgba(40, 200, 100, 0.35)",
    REJECTED: "rgba(255, 80, 80, 0.2)",
    // Legacy mock statuses
    Pending: "rgba(255, 193, 7, 0.2)",
    Reviewed: "rgba(0, 240, 255, 0.2)",
    Interview: "rgba(176, 38, 255, 0.2)",
    Decision: "rgba(40, 200, 100, 0.2)",
};
const STATUS_TEXT_COLORS = {
    APPLIED: "#ffc107",
    IN_REVIEW: "#00f0ff",
    INTERVIEW_SCHEDULED: "#b026ff",
    INTERVIEW_COMPLETED: "#00b4ff",
    OFFER_RECEIVED: "#28c878",
    ACCEPTED: "#28c878",
    REJECTED: "#ff5050",
    Pending: "#ffc107",
    Reviewed: "#00f0ff",
    Interview: "#b026ff",
    Decision: "#28c878",
};

export default function ApplicationTracker() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadApplications() {
            setLoading(true);
            try {
                // ─── Try Real API ────────────────────────────────────
                const res = await applicationsAPI.getMyApplications();
                setApplications(res.data);
            } catch (err) {
                // ─── Fallback to localStorage ─────────────────────────
                console.warn('⚠️ Backend unavailable, loading local applications.');
                const stored = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
                setApplications(stored);
            } finally {
                setLoading(false);
            }
        }
        loadApplications();
    }, []);

    const advanceStatus = async (index) => {
        const app = applications[index];
        const currentIdx = STATUSES.indexOf(app.status);
        if (currentIdx < 0 || currentIdx >= STATUSES.length - 1) return;
        const nextStatus = STATUSES[currentIdx + 1];
        const updated = [...applications];
        updated[index] = { ...updated[index], status: nextStatus };
        setApplications(updated);

        // Update in backend if we have real application_id
        if (app.application_id) {
            try {
                await applicationsAPI.updateStatus(app.application_id, nextStatus);
            } catch (e) {
                console.warn('Could not update status on backend:', e.message);
            }
        } else {
            // Update localStorage for mock mode
            localStorage.setItem("appliedJobs", JSON.stringify(updated));
        }
    };

    const removeApplication = async (index) => {
        const app = applications[index];
        const updated = applications.filter((_, i) => i !== index);
        setApplications(updated);

        if (app.application_id) {
            try {
                await applicationsAPI.delete(app.application_id);
            } catch (e) {
                console.warn('Could not delete application on backend:', e.message);
            }
        } else {
            localStorage.setItem("appliedJobs", JSON.stringify(updated));
        }
    };

    // Normalize app data from both API and localStorage
    const normalizeApp = (app) => ({
        ...app,
        title: app.title || app.job_title || 'Position',
        location: app.location || app.job_location || 'Remote',
        status: app.status || 'Pending',
    });

    const DISPLAY_STATUSES = ["APPLIED", "IN_REVIEW", "INTERVIEW_SCHEDULED", "ACCEPTED"];

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
                    {DISPLAY_STATUSES.map((s, i) => (
                        <React.Fragment key={s}>
                            <div className="pipeline-step" style={{ background: STATUS_COLORS[s], color: STATUS_TEXT_COLORS[s] }}>
                                {STATUS_DISPLAY[s]}
                            </div>
                            {i < DISPLAY_STATUSES.length - 1 && <span className="text-secondary align-self-center">→</span>}
                        </React.Fragment>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <i className="fa-solid fa-circle-notch fa-spin text-cyan fs-2 mb-3"></i>
                        <p className="text-secondary">Loading your applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-5 animate-in">
                        <i className="fa-regular fa-folder-open text-secondary mb-4" style={{ fontSize: "4rem" }}></i>
                        <h4 className="text-white mb-2">No Applications Tracked</h4>
                        <p className="text-secondary">Apply to jobs from the Job Matrix — your career pipeline will populate here.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {applications.map((rawApp, i) => {
                            const app = normalizeApp(rawApp);
                            return (
                                <div key={app.application_id || i} className="col-lg-6 animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
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
                                                {STATUS_DISPLAY[app.status] || app.status}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="progress-track mb-4">
                                            {DISPLAY_STATUSES.map((s, idx) => (
                                                <div
                                                    key={s}
                                                    className="progress-node"
                                                    style={{
                                                        background: STATUSES.indexOf(app.status) >= STATUSES.indexOf(s)
                                                            ? STATUS_TEXT_COLORS[app.status]
                                                            : "rgba(255,255,255,0.1)"
                                                    }}
                                                ></div>
                                            ))}
                                        </div>

                                        <div className="d-flex gap-2">
                                            {app.status !== "ACCEPTED" && app.status !== "REJECTED" && (
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
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
