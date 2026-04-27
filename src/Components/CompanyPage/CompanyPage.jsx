import React, { useState, useContext, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { TheUserContext } from '../UserContext/UserContext';
import { jobsAPI, applicationsAPI } from '../../services/api';
import './CompanyPage.css';
import companyBanner from "../../assets/company_banner.png";

export default function CompanyPage({ userData }) {
    const { setJobs } = useContext(TheUserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [myJobs, setMyJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [viewMode, setViewMode] = useState('post'); // 'post' or 'manage'

    const [job, setJob] = useState({
        title: '',
        description: '',
        location: '',
        salary_min: '',
        salary_max: '',
        currency: 'EGP',
        job_type: 'FULL_TIME'
    });

    useEffect(() => {
        if (userData?.role === 'EMPLOYER' || userData?.role === 'Company') {
            fetchMyJobs();
        }
    }, [userData]);

    const fetchMyJobs = async () => {
        try {
            const res = await jobsAPI.getMyJobs();
            setMyJobs(res.data);
        } catch (e) {
            console.error("Error fetching my jobs:", e);
        }
    };

    const fetchApplicants = async (jobId) => {
        setSelectedJobId(jobId);
        try {
            const res = await applicationsAPI.getByJob(jobId);
            setApplicants(res.data);
        } catch (e) {
            console.error("Error fetching applicants:", e);
        }
    };

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEmployer = userData?.role === 'EMPLOYER' || userData?.role === 'Company';
        if (!isEmployer) {
            alert("Error: You must be logged in as an Employer to post jobs.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await jobsAPI.create(job);
            setJobs(prevJobs => [res.data.job, ...prevJobs]);
            setMyJobs(prev => [res.data.job, ...prev]);
            alert("Job published successfully! 🚀");
            setJob({ title: '', description: '', location: '', salary_min: '', salary_max: '', currency: 'EGP', job_type: 'FULL_TIME' });
            setViewMode('manage');
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Failed to post job."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="company-page-wrapper">
            <Header userData={userData} />
            
            <div className="container py-5">
                <div className="d-flex justify-content-center gap-3 mb-5">
                    <button className={`btn rounded-pill px-4 ${viewMode === 'post' ? 'btn-primary shadow' : 'btn-outline-primary'}`} onClick={() => setViewMode('post')}>
                        <i className="fa-solid fa-plus-circle me-2"></i>Post Job
                    </button>
                    <button className={`btn rounded-pill px-4 ${viewMode === 'manage' ? 'btn-primary shadow' : 'btn-outline-primary'}`} onClick={() => setViewMode('manage')}>
                        <i className="fa-solid fa-tasks me-2"></i>Manage Jobs
                    </button>
                </div>

                {viewMode === 'post' ? (
                    <div className="job-post-container mx-auto animate-in">
                        <div className="job-post-card-premium">
                            <div className="card-header-visual">
                                <img src={companyBanner} alt="Recruitment" className="header-banner-img" />
                                <div className="header-text-overlay">
                                    <h2>Grow Your Team</h2>
                                    <p>Find the best talent for your next big project.</p>
                                </div>
                            </div>
                            <div className="card-body-form p-4 p-md-5">
                                <form onSubmit={handleSubmit} className="premium-job-form">
                                    <div className="row">
                                        <div className="col-12 mb-4">
                                            <label className="form-label-custom">Job Title</label>
                                            <input type="text" name="title" className="modern-input-field" value={job.title} onChange={handleChange} placeholder="e.g. Senior Frontend Architect" required />
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label className="form-label-custom">Job Description</label>
                                            <textarea name="description" className="modern-textarea-field" rows="5" value={job.description} onChange={handleChange} placeholder="Outline requirements..." required />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <label className="form-label-custom">Location</label>
                                            <input type="text" name="location" className="modern-input-field" value={job.location} onChange={handleChange} placeholder="Cairo, Egypt" required />
                                        </div>
                                        <div className="col-md-3 mb-4">
                                            <label className="form-label-custom">Min Salary</label>
                                            <input type="number" name="salary_min" className="modern-input-field" value={job.salary_min} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-3 mb-4">
                                            <label className="form-label-custom">Max Salary</label>
                                            <input type="number" name="salary_max" className="modern-input-field" value={job.salary_max} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <button type="submit" className="post-job-btn-premium w-100" disabled={isLoading}>
                                        {isLoading ? "Deploying..." : "Publish Job Listing"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="manage-jobs-container animate-in">
                        <h3 className="text-white mb-4"><i className="fa-solid fa-clipboard-list me-2"></i> Your Active Listings</h3>
                        {myJobs.length === 0 ? (
                            <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                                <p className="text-muted">You haven't posted any jobs yet.</p>
                            </div>
                        ) : (
                            <div className="row g-4">
                                <div className="col-lg-5">
                                    <div className="list-group shadow-sm rounded-4 overflow-hidden">
                                        {myJobs.map(j => (
                                            <button 
                                                key={j.job_id} 
                                                className={`list-group-item list-group-item-action p-4 border-0 ${selectedJobId === j.job_id ? 'bg-primary text-white' : ''}`}
                                                onClick={() => fetchApplicants(j.job_id)}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-1 fw-bold">{j.title}</h6>
                                                        <small className={selectedJobId === j.job_id ? 'text-white-50' : 'text-muted'}>{j.location}</small>
                                                    </div>
                                                    <span className="badge bg-light text-dark rounded-pill">{j.applicant_count} Applicants</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                                        <h5 className="fw-bold mb-4">Applicants {selectedJobId && `for ${myJobs.find(j => j.job_id === selectedJobId)?.title}`}</h5>
                                        {!selectedJobId ? (
                                            <p className="text-muted text-center py-5">Select a job to view applicants</p>
                                        ) : applicants.length === 0 ? (
                                            <p className="text-muted text-center py-5">No applications received yet.</p>
                                        ) : (
                                            <div className="applicants-list">
                                                {applicants.map(app => (
                                                    <div key={app.application_id} className="applicant-item p-3 border rounded-3 mb-3 d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <div className="fw-bold">{app.name}</div>
                                                            <div className="small text-muted">{app.email}</div>
                                                            <div className="mt-1"><span className="badge bg-info text-dark small">{app.status}</span></div>
                                                        </div>
                                                        <button className="btn btn-outline-primary btn-sm">View Profile</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
