import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './CareerRoadmap.css';
import roadmapGraphic from '../../assets/ai_management.png';

const ROADMAP_TEMPLATES = {
    "frontend": [
        { title: "HTML & CSS Mastery", desc: "Learn layout techniques (Flexbox, Grid) and semantic HTML.", icon: "fa-html5" },
        { title: "JavaScript Fundamentals", desc: "Deep dive into ES6+, DOM manipulation, and Async JS.", icon: "fa-js" },
        { title: "React Ecosystem", desc: "Master components, hooks, and state management (Redux/Context).", icon: "fa-react" },
        { title: "Styling Frameworks", desc: "Explore Tailwind CSS, Bootstrap, or CSS-in-JS.", icon: "fa-css3-alt" },
        { title: "Testing & Deployment", desc: "Learn Jest, RTL and deploying to Vercel/Netlify.", icon: "fa-cloud-upload-alt" }
    ],
    "backend": [
        { title: "Server-side Language", desc: "Master Node.js, Python, or Java for backend logic.", icon: "fa-node-js" },
        { title: "Database Architecture", desc: "Learn SQL (PostgreSQL) and NoSQL (MongoDB) fundamentals.", icon: "fa-database" },
        { title: "API Development", desc: "Build RESTful and GraphQL APIs with robust security.", icon: "fa-server" },
        { title: "Authentication", desc: "Implement JWT, OAuth, and secure session management.", icon: "fa-user-lock" },
        { title: "DevOps Basics", desc: "Explore Docker, CI/CD pipelines, and cloud hosting.", icon: "fa-docker" }
    ],
    "fullstack": [
        { title: "Frontend Core", desc: "Build responsive UIs using modern JS frameworks.", icon: "fa-desktop" },
        { title: "Backend Systems", desc: "Design and implement scalable server architectures.", icon: "fa-cog" },
        { title: "Database Integration", desc: "Connect frontend apps to persistent data storage.", icon: "fa-link" },
        { title: "Full Stack Projects", desc: "Build end-to-end applications from scratch.", icon: "fa-project-diagram" },
        { title: "System Design", desc: "Learn high-level architectural patterns for large apps.", icon: "fa-microchip" }
    ]
};

export default function CareerRoadmap() {
    const [goal, setGoal] = useState("");
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateRoadmap = (e) => {
        e.preventDefault();
        if (!goal) return;

        setLoading(true);
        setTimeout(() => {
            const lowerGoal = goal.toLowerCase();
            let result = null;

            if (lowerGoal.includes("front")) result = ROADMAP_TEMPLATES.frontend;
            else if (lowerGoal.includes("back")) result = ROADMAP_TEMPLATES.backend;
            else if (lowerGoal.includes("full")) result = ROADMAP_TEMPLATES.fullstack;
            else {
                result = [
                    { title: "Core Basics", desc: `Learn the fundamentals related to ${goal}.`, icon: "fa-graduation-cap" },
                    { title: "Intermediate Skills", desc: `Advance your knowledge in ${goal} specializations.`, icon: "fa-book" },
                    { title: "Practical Application", desc: "Build real-world projects to build your portfolio.", icon: "fa-tools" },
                    { title: "Advanced Topics", desc: `Master complex concepts in the ${goal} field.`, icon: "fa-brain" },
                    { title: "Job Readiness", desc: "Prepare for interviews and launch your career.", icon: "fa-briefcase" }
                ];
            }

            setRoadmap(result);
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container career-roadmap">
                <div className="roadmap-container">
                    <div className="text-center mb-5">
                        <div className="position-relative d-inline-block mb-4">
                            <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'150%', height:'150%'}}></div>
                            <img src={roadmapGraphic} alt="AI Roadmap" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '280px'}} />
                        </div>
                        <h1 className="text-white fw-bold">Trajectory <span className="text-cyan">Architect</span></h1>
                        <p className="text-secondary">Synthesize a comprehensive roadmap based on your professional aspirations.</p>
                    </div>

                    <div className="roadmap-input-card text-center">
                        <h3 className="text-white mb-3">Target Objective</h3>
                        <p className="text-secondary mb-4">Define your career vector to initialize path synthesis.</p>
                        <form onSubmit={generateRoadmap} className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center">
                            <input
                                type="text"
                                className="glass-input flex-grow-1"
                                placeholder="e.g. Senior Software Architect"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                style={{maxWidth: '400px'}}
                            />
                            <button className="btn btn-cyan-glow py-3 px-5 fw-bold" type="submit" disabled={loading}>
                                {loading ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Analyzing...</> : "Synthesize Path"}
                            </button>
                        </form>
                    </div>

                    {roadmap && (
                        <div className="timeline-section mt-5 animate-in">
                            <h2 className="text-center text-white mb-5">Deployment Log: <span className="text-cyan text-capitalize">{goal}</span></h2>
                            <div className="timeline">
                                {roadmap.map((step, index) => (
                                    <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-content">
                                            <div className="timeline-icon">
                                                <i className={`fa-solid ${step.icon}`}></i>
                                            </div>
                                            <h4>{step.title}</h4>
                                            <p className="mb-0">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-5">
                                <button className="btn btn-purple-glow px-5 py-3" onClick={() => setRoadmap(null)}>
                                    Reset Trajectory
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

