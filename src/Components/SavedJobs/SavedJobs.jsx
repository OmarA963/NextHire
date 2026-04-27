import React, { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { NavLink } from "react-router-dom";
import { TheUserContext } from "../UserContext/UserContext";
import { jobsAPI } from "../../services/api";
import "./SavedJobs.css";

import aiCode from "../../assets/ai_code.png";
import aiManagement from "../../assets/ai_management.png";
import aiDesign from "../../assets/ai_design.png";
import aiTech from "../../assets/ai_tech.png";

const imageMap = {
    frontend: aiCode, react: aiCode, backend: aiCode, developer: aiCode, node: aiCode,
    project: aiManagement, manager: aiManagement, product: aiManagement,
    civil: aiDesign, designer: aiDesign, ui: aiDesign, ux: aiDesign, figma: aiDesign,
    network: aiTech, doctor: aiTech, mechanical: aiTech, ai: aiTech,
};

const getImageForJob = (title = "", description = "") => {
    const text = (title + " " + description).toLowerCase();
    for (const key in imageMap) {
        if (text.includes(key)) return imageMap[key];
    }
    return aiTech;
};

export default function SavedJobs() {
    const { likedJobs, toggleLikeJob } = useContext(TheUserContext);
    const [apiSavedJobs, setApiSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [useApiData, setUseApiData] = useState(false);

    useEffect(() => {
        async function loadSavedJobs() {
            setLoading(true);
            try {
                // ─── Try Real API ─────────────────────────────────────
                const res = await jobsAPI.getSaved();
                setApiSavedJobs(res.data);
                setUseApiData(true);
            } catch (err) {
                // ─── Fallback to context likedJobs ────────────────────
                console.warn('⚠️ Backend unavailable, using locally saved jobs.');
                setUseApiData(false);
            } finally {
                setLoading(false);
            }
        }
        loadSavedJobs();
    }, []);

    const handleUnsave = async (job) => {
        const jobId = job.job_id || job.jobId;
        if (useApiData && jobId) {
            try {
                await jobsAPI.unsave(jobId);
                setApiSavedJobs(prev => prev.filter(j => j.job_id !== jobId));
            } catch (e) {
                console.warn('Could not unsave on backend:', e.message);
            }
        } else {
            toggleLikeJob(job);
        }
    };

    const displayedJobs = useApiData ? apiSavedJobs : likedJobs;

    if (loading) return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="text-center py-5 mt-5">
                <i className="fa-solid fa-circle-notch fa-spin text-cyan fs-2 mb-3"></i>
                <p className="text-secondary">Loading your saved jobs...</p>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container py-5 mt-3">
                <div className="text-center mb-5">
                    <span className="section-tag animate-in">Neural Bookmarks</span>
                    <h1 className="display-4 fw-bold text-white mb-3">
                        Saved <span className="text-cyan">Jobs</span>
                    </h1>
                    <p className="text-secondary opacity-75">Your personally curated list of high-potential career vectors.</p>
                </div>

                {displayedJobs.length === 0 ? (
                    <div className="empty-state text-center py-5 animate-in">
                        <i className="fa-regular fa-heart text-secondary mb-4" style={{ fontSize: "4rem" }}></i>
                        <h4 className="text-white mb-2">No Neural Bookmarks Found</h4>
                        <p className="text-secondary mb-4">Browse the Job Matrix and save roles that match your signal.</p>
                        <NavLink to="/alljobs" className="btn btn-cyan-glow px-5 py-3 fw-bold">
                            Explore Job Matrix
                        </NavLink>
                    </div>
                ) : (
                    <div className="row g-4">
                        {displayedJobs.map((job, index) => (
                            <div key={job.job_id || job.jobId || index} className="col-lg-4 col-md-6 animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="job-glass-card neon-card-cyan d-flex flex-column h-100 p-4 rounded-4">
                                    <div className="image-wrapper w-100 rounded-3 overflow-hidden mb-3" style={{ height: "150px" }}>
                                        <img src={getImageForJob(job.title, job.description)} alt="Job" className="w-100 h-100" style={{ objectFit: "cover" }} />
                                    </div>
                                    <span className="badge location-badge mb-2">{job.location}</span>
                                    <h5 className="text-white fw-bold">{job.title}</h5>
                                    <p className="cyan-text fw-medium">{job.salaryRange || (job.salary_min ? `${job.currency || ''} ${job.salary_min}–${job.salary_max}` : 'Competitive')}</p>
                                    <div className="cyan-divider mb-3"></div>
                                    <p className="text-secondary small flex-grow-1">{job.description}</p>
                                    <div className="d-flex gap-2 mt-3">
                                        <NavLink
                                            to="/jobdetails"
                                            onClick={() => localStorage.setItem("selectedJobId", job.job_id || job.jobId)}
                                            className="btn job-btn flex-grow-1 py-2"
                                        >
                                            Apply
                                        </NavLink>
                                        <button
                                            className="btn btn-outline-danger px-3"
                                            onClick={() => handleUnsave(job)}
                                            title="Remove"
                                        >
                                            <i className="fa-solid fa-heart-crack"></i>
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
