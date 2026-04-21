import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./ResumeMatcher.css";
import matcherGraphic from "../../assets/ai_code.png";

const SKILL_KEYWORDS = [
    'react', 'javascript', 'node.js', 'python', 'java', 'html', 'css',
    'sql', 'mongodb', 'docker', 'aws', 'git', 'typescript', 'redux',
    'express', 'next.js', 'tailwind', 'bootstrap', 'agile', 'scrum'
];

const SKILL_RESOURCES = {
    'react': 'https://react.dev/learn',
    'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'node.js': 'https://nodejs.org/en/learn',
    'python': 'https://www.py4e.com/',
    'java': 'https://dev.java/learn/',
    'html': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'css': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    'sql': 'https://www.w3schools.com/sql/',
    'mongodb': 'https://university.mongodb.com/',
    'docker': 'https://docs.docker.com/get-started/',
    'aws': 'https://aws.amazon.com/training/',
    'git': 'https://git-scm.com/book/en/v2',
    'typescript': 'https://www.typescriptlang.org/docs/',
    'redux': 'https://redux.js.org/introduction/getting-started',
    'express': 'https://expressjs.com/en/starter/installing.html',
    'next.js': 'https://nextjs.org/learn',
    'tailwind': 'https://tailwindcss.com/docs/installation',
    'bootstrap': 'https://getbootstrap.com/docs/5.3/getting-started/introduction/',
    'agile': 'https://www.atlassian.com/agile',
    'scrum': 'https://www.scrum.org/resources/what-is-scrum'
};

const SKILL_PROJECTS = {
    'react': { title: 'Dynamic Dashboard', desc: 'Build a real-time analytics dashboard with React hooks and chart libraries.' },
    'javascript': { title: 'JS Game Engine', desc: 'Create a simple 2D game engine using HTML5 Canvas and vanilla JS.' },
    'node.js': { title: 'RESTful API Server', desc: 'Develop a secure backend server for a task management application.' },
    'python': { title: 'AI Automation Script', desc: 'Write a Python script to automate data scraping and analysis.' },
    'java': { title: 'Inventory Management System', desc: 'Build a desktop/web app to track stock and sales using Spring Boot.' },
    'html': { title: 'Static Landing Page', desc: 'Design a high-conversion, responsive landing page from scratch.' },
    'css': { title: 'CSS Animation Gallery', desc: 'Create a set of complex, pure-CSS UI animations and transitions.' },
    'sql': { title: 'E-commerce Database Design', desc: 'Model and implement a relational database for an online store.' },
    'mongodb': { title: 'Social Media NoSQL Backend', desc: 'Schema design and implementation for a highly-scalable social app.' },
    'docker': { title: 'Microservices Containerization', desc: 'Containerize a MERN stack app and deploy to a cloud provider.' },
    'aws': { title: 'Serverless File Processor', desc: 'Use AWS Lambda and S3 to automatically process uploaded images.' },
    'git': { title: 'Open Source Contribution', desc: 'Contribute a significant feature to a popular GitHub repository.' },
    'typescript': { title: 'Type-Safe E-commerce Frontend', desc: 'Refactor a React store to use strict TypeScript interfaces.' },
    'redux': { title: 'Global State Management Hub', desc: 'Build a complex app with multi-stage forms and local storage persistence.' },
    'express': { title: 'Real-time Chat Application', desc: 'Use Socket.io and Express to build a live messaging platform.' },
    'next.js': { title: 'SEO Optimized Blog System', desc: 'Build a full-stack blog with server-side rendering and markdown support.' },
    'tailwind': { title: 'SaaS UI Template Kit', desc: 'Design a reusable set of UI components using utility-first CSS.' },
    'bootstrap': { title: 'Admin Dashboard Template', desc: 'Create a clean, responsive admin panel with Bootstrap 5 components.' },
    'agile': { title: 'Agile Project Simulation', desc: 'Lead a team project using Jira/Trello following Scrum ceremonies.' },
    'scrum': { title: 'Sprint Planning Automation', desc: 'Develop a tool to calculate team velocity and automate sprint tasks.' }
};

export default function ResumeMatcher() {
    const navigate = useNavigate();
    const [resume, setResume] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const calculateMatch = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const resumeLower = resume.toLowerCase();
            const jobLower = jobDesc.toLowerCase();

            const jobSkills = SKILL_KEYWORDS.filter(skill => jobLower.includes(skill.toLowerCase()));
            const matchedSkills = jobSkills.filter(skill => resumeLower.includes(skill.toLowerCase()));
            const missingSkills = jobSkills.filter(skill => !resumeLower.includes(skill.toLowerCase()));

            let score = 0;
            if (jobSkills.length > 0) {
                score = Math.round((matchedSkills.length / jobSkills.length) * 100);
            } else if (resume.length > 50 && jobDesc.length > 50) {
                score = 70; 
            }

            setResult({
                score,
                matchedSkills,
                missingSkills,
                resources: missingSkills.map(skill => ({
                    name: skill,
                    link: SKILL_RESOURCES[skill.toLowerCase()] || `https://www.youtube.com/results?search_query=learn+${skill}`
                })),
                projects: missingSkills.map(skill => ({
                    skill: skill,
                    ...(SKILL_PROJECTS[skill.toLowerCase()] || {
                        title: `${skill} Integration Project`,
                        desc: `Build a real-world application that demonstrates your proficiency in ${skill}.`
                    })
                })),
                tips: missingSkills.map(skill => `Include your experience with ${skill} specifically.`)
            });
            setLoading(false);
            window.scrollTo({ top: 800, behavior: 'smooth' });
        }, 1500);
    };

    const getScoreClass = (score) => {
        if (score >= 80) return 'score-perfect';
        if (score >= 60) return 'score-good';
        if (score >= 40) return 'score-average';
        return 'score-low';
    };

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container resume-matcher">
                <div className="matcher-container">
                    <div className="text-center mb-5">
                        <div className="position-relative d-inline-block mb-4">
                            <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'150%', height:'150%'}}></div>
                            <img src={matcherGraphic} alt="AI Matcher" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '280px'}} />
                        </div>
                        <h1 className="text-white fw-bold">Neural <span className="text-cyan">Comparator</span></h1>
                        <p className="text-secondary">Cross-reference your skill profile with industry-specific job requirements.</p>
                    </div>

                    <div className="input-section">
                        <div className="input-card">
                            <h4 className="text-white mb-3"><i className="fa-solid fa-file-invoice text-cyan me-2"></i>Resource Data</h4>
                            <textarea
                                className="glass-input w-100"
                                rows="10"
                                placeholder="Paste your raw resume text here..."
                                value={resume}
                                onChange={(e) => setResume(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="input-card">
                            <h4 className="text-white mb-3"><i className="fa-solid fa-briefcase text-purple me-2"></i>Target Vector</h4>
                            <textarea
                                className="glass-input w-100"
                                rows="10"
                                placeholder="Paste the job description or requirements here..."
                                value={jobDesc}
                                onChange={(e) => setJobDesc(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            className="btn btn-cyan-glow py-3 px-5 fw-bold"
                            onClick={calculateMatch}
                            disabled={loading || !resume || !jobDesc}
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>Propagating Match Analysis...
                                </>
                            ) : "Execute Match Analysis"}
                        </button>
                    </div>

                    {result && (
                        <div className="score-card animate-in">
                            <div className={`circular-score ${getScoreClass(result.score)}`}>
                                {result.score}%
                            </div>
                            <h2 className="text-white mb-4">Compatibility Index</h2>
                            <div className="d-flex justify-content-center gap-3 mb-5">
                                <button
                                    className="btn btn-purple-glow px-4 py-2"
                                    onClick={() => navigate('/cover-letter', { state: { resume, jobDesc } })}
                                >
                                    <i className="fa-solid fa-file-signature me-2"></i> Synthesize Cover Letter
                                </button>
                            </div>
                            <p className="fs-5 text-secondary mb-5">
                                {result.score >= 80 ? "Critical compatibility achieved. Optimal alignment with target vector." :
                                    result.score >= 60 ? "Substantial alignment. Minor parameter refinement recommended." :
                                        "Threshold not met. Significant knowledge gaps detected."}
                            </p>

                            <div className="analysis-grid">
                                <div className="analysis-item matched-skills">
                                    <h5 className="text-success mb-3"><i className="fa-solid fa-circle-check me-2"></i> Detected Proficiencies</h5>
                                    <div className="mt-2">
                                        {result.matchedSkills.length > 0 ? (
                                            result.matchedSkills.map(s => <span key={s} className="skill-tag">{s}</span>)
                                        ) : <p className="text-secondary small">No direct keyword intersections found.</p>}
                                    </div>
                                </div>
                                <div className="analysis-item missing-skills">
                                    <h5 className="text-danger mb-3"><i className="fa-solid fa-circle-xmark me-2"></i> Missing Vectors</h5>
                                    <div className="mt-2">
                                        {result.missingSkills.length > 0 ? (
                                            result.missingSkills.map(s => (
                                                <span key={s} className="skill-tag">
                                                    {s}
                                                    <a
                                                        href={SKILL_RESOURCES[s.toLowerCase()] || `https://www.youtube.com/results?search_query=learn+${s}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm learn-btn"
                                                    >
                                                        Learn
                                                    </a>
                                                </span>
                                            ))
                                        ) : <p className="text-secondary small">Full capability range detected.</p>}
                                    </div>
                                </div>
                            </div>

                            {result.resources.length > 0 && (
                                <div className="mt-5 text-start">
                                    <h4 className="text-white mb-4"><i className="fa-solid fa-graduation-cap text-cyan me-2"></i> Accelerated Learning Paths</h4>
                                    <div className="list-group resource-list">
                                        {result.resources.map((res, i) => (
                                            <a
                                                key={i}
                                                href={res.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <strong className="text-capitalize text-white">{res.name} Protocol</strong>
                                                    <p className="mb-0 text-secondary small">Initialize data acquisition via curated external stream.</p>
                                                </div>
                                                <span className="text-cyan fw-bold">Execute <i className="fa-solid fa-arrow-up-right-from-square ms-1"></i></span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {result.projects.length > 0 && (
                                <div className="mt-5 text-start">
                                    <h4 className="text-white mb-4"><i className="fa-solid fa-hammer text-purple me-2"></i> Simulation Specs</h4>
                                    <p className="text-secondary small mb-4">Functional blueprints to bridge the detected proficiency gap.</p>
                                    <div className="row g-4">
                                        {result.projects.map((proj, i) => (
                                            <div key={i} className="col-md-6">
                                                <div className="project-card h-100">
                                                    <div className="mb-3">
                                                        <span className="badge bg-purple-glow text-white small">{proj.skill}</span>
                                                    </div>
                                                    <h5 className="text-white">{proj.title}</h5>
                                                    <p className="small text-secondary">{proj.desc}</p>
                                                    <button className="btn btn-sm btn-cyan-glow w-100 mt-3 py-2 fw-bold">Build Specs</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button className="btn btn-link text-secondary mt-5 text-decoration-none" onClick={() => setResult(null)}>
                                <i className="fa-solid fa-rotate-left me-2"></i>Reset Comparator
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

