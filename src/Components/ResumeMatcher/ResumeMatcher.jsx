import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./ResumeMatcher.css";
import matcherBanner from "../../assets/matcher_banner.png";

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
                missingSkills
            });
            setLoading(false);
            window.scrollTo({ top: 700, behavior: 'smooth' });
        }, 1500);
    };

    const getScoreClass = (score) => {
        if (score >= 80) return 'score-perfect';
        if (score >= 60) return 'score-good';
        if (score >= 40) return 'score-average';
        return 'score-low';
    };

    return (
        <div className="resume-matcher-page">
            <Header />
            
            <div className="resume-matcher-wrapper">
                {/* Header Section */}
                <div className="matcher-header-card">
                    <img src={matcherBanner} alt="AI Matcher" className="matcher-banner-img" />
                    <div className="matcher-intro-text">
                        <h1>AI Resume Matcher</h1>
                        <p>Analyze how well your profile aligns with specific job requirements and discover areas for improvement.</p>
                    </div>
                </div>

                {/* Input Section */}
                <div className="matcher-input-grid">
                    <div className="input-glass-card">
                        <h4><i className="fa-solid fa-file-lines text-primary"></i> Your Resume</h4>
                        <textarea
                            className="modern-matcher-textarea"
                            rows="12"
                            placeholder="Paste your resume content here..."
                            value={resume}
                            onChange={(e) => setResume(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="input-glass-card">
                        <h4><i className="fa-solid fa-briefcase text-success"></i> Job Description</h4>
                        <textarea
                            className="modern-matcher-textarea"
                            rows="12"
                            placeholder="Paste the job requirements here..."
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    className="execute-match-btn"
                    onClick={calculateMatch}
                    disabled={loading || !resume || !jobDesc}
                >
                    {loading ? (
                        <><i className="fa-solid fa-circle-notch fa-spin me-2"></i> Analyzing Match...</>
                    ) : "Calculate Match Score"}
                </button>

                {/* Results Section */}
                {result && (
                    <div className="results-card-premium animate-in">
                        <div className={`score-circle-modern ${getScoreClass(result.score)}`}>
                            {result.score}%
                        </div>
                        <h2 className="mb-2 fw-bold">Compatibility Score</h2>
                        <p className="text-muted mb-4">Based on key skill identification and keyword intersection.</p>
                        
                        <div className="d-flex justify-content-center gap-3 mb-5">
                            <button
                                className="btn btn-dark rounded-pill px-4 py-2"
                                onClick={() => navigate('/cover-letter', { state: { resume, jobDesc } })}
                            >
                                <i className="fa-solid fa-pen-nib me-2"></i> Generate Cover Letter
                            </button>
                        </div>

                        <div className="skill-grid-modern">
                            <div className="skill-group-card">
                                <h5 className="text-success mb-3"><i className="fa-solid fa-check-circle me-2"></i> Matched Skills</h5>
                                <div className="d-flex flex-wrap">
                                    {result.matchedSkills.length > 0 ? (
                                        result.matchedSkills.map(s => <span key={s} className="skill-tag-modern">{s}</span>)
                                    ) : <p className="text-muted small">No direct skill matches detected.</p>}
                                </div>
                            </div>
                            <div className="skill-group-card">
                                <h5 className="text-danger mb-3"><i className="fa-solid fa-circle-exclamation me-2"></i> Missing Skills</h5>
                                <div className="d-flex flex-wrap">
                                    {result.missingSkills.length > 0 ? (
                                        result.missingSkills.map(s => (
                                            <span key={s} className="skill-tag-modern">
                                                {s}
                                                <a
                                                    href={SKILL_RESOURCES[s.toLowerCase()] || `https://www.youtube.com/results?search_query=learn+${s}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="learn-link-btn"
                                                >
                                                    Learn
                                                </a>
                                            </span>
                                        ))
                                    ) : <p className="text-muted small">Perfect match! No missing skills found.</p>}
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-link text-muted mt-5 text-decoration-none" onClick={() => setResult(null)}>
                            <i className="fa-solid fa-rotate-right me-2"></i> Start New Analysis
                        </button>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}
