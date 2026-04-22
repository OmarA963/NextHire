import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './CareerRoadmap.css';
import roadmapBanner from '../../assets/roadmap_banner.png';

const ROADMAP_TEMPLATES = {
    "frontend": [
        { title: "HTML & CSS Mastery", desc: "Learn layout techniques (Flexbox, Grid) and semantic HTML.", icon: "fa-html5" },
        { title: "JavaScript Fundamentals", desc: "Deep dive into ES6+, DOM manipulation, and Async JS.", icon: "fa-js" },
        { title: "React Ecosystem", desc: "Master components, hooks, and state management (Redux/Context).", icon: "fa-react" },
        { title: "Styling Frameworks", desc: "Explore Tailwind CSS, Bootstrap, or CSS-in-JS.", icon: "fa-palette" },
        { title: "Testing & Deployment", desc: "Learn Jest, RTL and deploying to Vercel/Netlify.", icon: "fa-cloud-arrow-up" }
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
        { title: "Backend Systems", desc: "Design and implement scalable server architectures.", icon: "fa-gears" },
        { title: "Database Integration", desc: "Connect frontend apps to persistent data storage.", icon: "fa-link" },
        { title: "Full Stack Projects", desc: "Build end-to-end applications from scratch.", icon: "fa-project-diagram" },
        { title: "System Design", desc: "Learn high-level architectural patterns for large apps.", icon: "fa-microchip" }
    ]
};

export default function CareerRoadmap() {
    const [goal, setGoal] = useState("");
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [completedSteps, setCompletedSteps] = useState([]);

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
            setCompletedSteps(new Array(result.length).fill(false));
            setLoading(false);
            window.scrollTo({ top: 700, behavior: 'smooth' });
        }, 1200);
    };

    const toggleStep = (index) => {
        const newSteps = [...completedSteps];
        newSteps[index] = !newSteps[index];
        setCompletedSteps(newSteps);
    };

    const calculateProgress = () => {
        if (!completedSteps.length) return 0;
        const completed = completedSteps.filter(s => s).length;
        return Math.round((completed / completedSteps.length) * 100);
    };

    return (
        <div className="career-roadmap-page">
            <Header />
            
            <div className="roadmap-wrapper">
                {/* Header Section */}
                <div className="roadmap-header-card">
                    <img src={roadmapBanner} alt="Career Roadmap" className="roadmap-banner-img" />
                    <div className="roadmap-intro-text">
                        <h1>Career Path Architect</h1>
                        <p>Map out your professional journey and track your progress toward mastering new industries.</p>
                    </div>
                </div>

                {/* Input Card */}
                <div className="roadmap-input-card-modern">
                    <h3>Where do you want to go?</h3>
                    <p>Enter your career goal to generate a personalized learning roadmap.</p>
                    <form onSubmit={generateRoadmap} className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                        <input
                            type="text"
                            className="modern-roadmap-input"
                            placeholder="e.g. Fullstack Developer"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                        />
                        <button className="generate-path-btn" type="submit" disabled={loading}>
                            {loading ? <><i className="fa-solid fa-circle-notch fa-spin me-2"></i> Generating...</> : "Generate Roadmap"}
                        </button>
                    </form>
                </div>

                {/* Timeline Results */}
                {roadmap && (
                    <div className="roadmap-timeline-section animate-in">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2>Roadmap: <span className="text-primary text-capitalize">{goal}</span></h2>
                            <div className="text-end">
                                <div className="fw-bold mb-1">Overall Progress: {calculateProgress()}%</div>
                                <div className="progress" style={{width: '200px', height: '10px', borderRadius: '10px'}}>
                                    <div className="progress-bar bg-success" style={{width: `${calculateProgress()}%`}}></div>
                                </div>
                            </div>
                        </div>

                        <div className="modern-timeline">
                            {roadmap.map((step, index) => (
                                <div 
                                    key={index} 
                                    className={`timeline-milestone ${completedSteps[index] ? 'completed' : ''}`}
                                    onClick={() => toggleStep(index)}
                                >
                                    <div className="milestone-marker">
                                        {completedSteps[index] && <i className="fa-solid fa-check"></i>}
                                    </div>
                                    <div className="milestone-card">
                                        <div className="milestone-icon-box">
                                            <i className={`fa-solid ${step.icon}`}></i>
                                        </div>
                                        <div className="milestone-info">
                                            <h4>{step.title}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                        <div className="milestone-check">
                                            <i className={completedSteps[index] ? "fa-solid fa-circle-check" : "fa-regular fa-circle"}></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="roadmap-actions">
                            <button className="btn btn-outline-dark rounded-pill px-4" onClick={() => window.print()}>
                                <i className="fa-solid fa-download me-2"></i> Download PDF
                            </button>
                            <button className="btn btn-link text-muted text-decoration-none" onClick={() => setRoadmap(null)}>
                                <i className="fa-solid fa-rotate-left me-2"></i> Start Over
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}
