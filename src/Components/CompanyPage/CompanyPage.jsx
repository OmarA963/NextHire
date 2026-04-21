import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './CompanyPage.css';
import companyGraphic from "../../assets/ai_management.png";

export default function CompanyPage({ userData }) {
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
        const companyId = localStorage.getItem("company-id");

        if (!companyId) {
            alert("Security Protocol Violation: Company Identity Domain missing.");
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

            alert("NEURAL BROADCAST SUCCESSFUL: Job vector deployed to the matrix.");
            setJob({ title: '', description: '', location: '', salaryRange: '' });

        } catch (error) {
            alert("TRANSMISSION ERROR: System sync failed.");
        }
    };

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header userData={userData} />
            <div className="container company-page">
                <div className="row align-items-center g-5">
                    {/* Visual Section */}
                    <div className="col-lg-5 text-center animate-in">
                        <div className="position-relative d-inline-block">
                            <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'130%', height:'130%'}}></div>
                            <img src={companyGraphic} alt="Talent Management" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '350px'}} />
                        </div>
                        <h2 className="mt-5 text-white fw-black">Post a <span className="text-cyan">Job Vector</span></h2>
                        <p className="text-secondary">Deploy high-priority requirements to the global TalentAI network.</p>
                    </div>

                    {/* Form Section */}
                    <div className="col-lg-7">
                        <div className="job-post-card animate-in" style={{animationDelay: '0.2s'}}>
                            <form onSubmit={handleSubmit} className="job-post-form">
                                <div className="mb-4">
                                    <label className="input-group-label">PROJECT TITLE</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="glass-input w-100"
                                        value={job.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Lead Neural Architect"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="input-group-label">SPECIFICATIONS (DESCRIPTION)</label>
                                    <textarea
                                        name="description"
                                        className="glass-input w-100"
                                        rows="4"
                                        value={job.description}
                                        onChange={handleChange}
                                        placeholder="Outline the core mission and technical requirements..."
                                        required
                                    />
                                </div>
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="input-group-label">DEPLOYMENT ZONE (LOCATION)</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="glass-input w-100"
                                            value={job.location}
                                            onChange={handleChange}
                                            placeholder="Remote / HQ"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="input-group-label">RESOURCE BUDGET (SALARY)</label>
                                        <input
                                            type="text"
                                            name="salaryRange"
                                            className="glass-input w-100"
                                            value={job.salaryRange}
                                            onChange={handleChange}
                                            placeholder="$X - $Y"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-cyan-glow w-100 py-3 fw-black tracking-widest mt-2 uppercase">
                                    EXECUTE PROTOCOL: POST JOB
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

