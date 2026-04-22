import React, { useState, useContext } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { TheUserContext } from '../UserContext/UserContext';
import './CompanyPage.css';
import companyBanner from "../../assets/company_banner.png";

export default function CompanyPage({ userData }) {
    const { setJobs } = useContext(TheUserContext);
    const [job, setJob] = useState({
        title: '',
        description: '',
        location: '',
        salaryRange: ''
    });

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Try getting ID from localStorage or UserContext
        const companyId = localStorage.getItem("company-id") || (userData?.role === 'Company' ? userData.id : null);

        if (!companyId) {
            alert("Error: Company identity missing. Please log in as a company to post jobs.");
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const newJob = {
                jobId: Date.now().toString(),
                companyId: companyId,
                title: job.title,
                description: job.description,
                location: job.location,
                type: 'Full-time',
                salaryRange: job.salaryRange,
                postedDate: new Date().toISOString(),
                company: "Enterprise X (Mock)"
            };

            const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
            existingJobs.unshift(newJob);
            localStorage.setItem('jobs', JSON.stringify(existingJobs));

            setJobs(prevJobs => [newJob, ...prevJobs]);

            alert("Job posted successfully! It is now visible to candidates.");
            setJob({ title: '', description: '', location: '', salaryRange: '' });

        } catch (error) {
            alert("Error: Failed to post the job. Please try again.");
        }
    };

    return (
        <div className="company-page-wrapper">
            <Header userData={userData} />
            
            <div className="container py-5">
                <div className="job-post-container mx-auto">
                    <div className="job-post-card-premium">
                        {/* Header Section with Image */}
                        <div className="card-header-visual">
                            <img src={companyBanner} alt="Recruitment" className="header-banner-img" />
                            <div className="header-text-overlay">
                                <h2>Grow Your Team</h2>
                                <p>Find the best talent for your next big project.</p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="card-body-form">
                            <div className="form-intro mb-5">
                                <h3><i className="fa-solid fa-file-circle-plus me-2 text-primary"></i> Create Job Posting</h3>
                                <p className="text-muted">Fill in the details below to deploy your job to the NextHire network.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="premium-job-form">
                                <div className="row">
                                    <div className="col-12 mb-4">
                                        <label className="form-label-custom">Job Title</label>
                                        <div className="input-with-icon">
                                            <i className="fa-solid fa-briefcase"></i>
                                            <input
                                                type="text"
                                                name="title"
                                                className="modern-input-field"
                                                value={job.title}
                                                onChange={handleChange}
                                                placeholder="e.g. Senior Product Designer"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 mb-4">
                                        <label className="form-label-custom">Job Description</label>
                                        <textarea
                                            name="description"
                                            className="modern-textarea-field"
                                            rows="5"
                                            value={job.description}
                                            onChange={handleChange}
                                            placeholder="Outline the responsibilities, requirements, and what makes this role special..."
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label-custom">Location</label>
                                        <div className="input-with-icon">
                                            <i className="fa-solid fa-location-dot"></i>
                                            <input
                                                type="text"
                                                name="location"
                                                className="modern-input-field"
                                                value={job.location}
                                                onChange={handleChange}
                                                placeholder="Remote / City, Country"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label-custom">Salary Range</label>
                                        <div className="input-with-icon">
                                            <i className="fa-solid fa-money-bill-wave"></i>
                                            <input
                                                type="text"
                                                name="salaryRange"
                                                className="modern-input-field"
                                                value={job.salaryRange}
                                                onChange={handleChange}
                                                placeholder="e.g. $120k - $150k"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-footer mt-4">
                                    <button type="submit" className="post-job-btn-premium">
                                        Publish Job Listing <i className="fa-solid fa-paper-plane ms-2"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
