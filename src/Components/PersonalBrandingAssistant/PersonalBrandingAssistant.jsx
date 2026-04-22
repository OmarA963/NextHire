import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './PersonalBrandingAssistant.css';
import brandingBanner from '../../assets/branding_banner.png';

const CHECKLIST_ITEMS = [
    "Upload a high-quality professional headshot",
    "Write a keyword-optimized LinkedIn headline",
    "Complete the 'About' section with a compelling story",
    "Feature at least 2 top projects or certifications",
    "Request recommendations from 3 former colleagues",
    "Customize your LinkedIn profile URL",
    "Add 15+ relevant skills to your profile"
];

const SUGGESTION_TEMPLATES = {
    professional: [
        "Results-oriented {role} with a proven track record of delivering high-quality solutions. Expertise in {skill} and a passion for optimizing performance.",
        "Strategic {role} specializing in {skill}. Dedicated to driving innovation and fostering collaborative environments to achieve business objectives."
    ],
    creative: [
        "Crafting digital experiences as a {role}. Turning complex problems into elegant {skill} solutions with a dash of creativity.",
        "Weaving code and design together. I'm a {role} who believes that {skill} is the secret sauce to great products."
    ],
    minimalist: [
        "{role} | {skill} Enthusiast | Builder",
        "Passionate {role} focused on {skill}."
    ]
};

const HEADLINE_IDEAS = [
    "{role} | Specializing in {skill} | Helping companies build better products",
    "{role} passionate about {skill} & Innovation",
    "Building the future of {skill} as a {role}",
    "{role} @ [Your Company] | Expert in {skill}"
];

export default function PersonalBrandingAssistant() {
    const [input, setInput] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checklist, setChecklist] = useState(new Array(CHECKLIST_ITEMS.length).fill(false));

    const analyzeBranding = (e) => {
        e.preventDefault();
        if (!input) return;

        setLoading(true);
        setTimeout(() => {
            const inputLower = input.toLowerCase();
            let detectedRole = "Professional";
            let detectedSkill = "Modern Technology";

            if (inputLower.includes("engineer") || inputLower.includes("developer")) detectedRole = "Software Engineer";
            if (inputLower.includes("react") || inputLower.includes("frontend")) detectedSkill = "React & Frontend Architecture";
            else if (inputLower.includes("node") || inputLower.includes("backend")) detectedSkill = "Scalable Backend Systems";
            else if (inputLower.includes("design") || inputLower.includes("ui")) detectedSkill = "Intuitive UX/UI Design";

            const generatedResults = {
                professional: SUGGESTION_TEMPLATES.professional[0].replace("{role}", detectedRole).replace("{skill}", detectedSkill),
                creative: SUGGESTION_TEMPLATES.creative[0].replace("{role}", detectedRole).replace("{skill}", detectedSkill),
                minimalist: SUGGESTION_TEMPLATES.minimalist[0].replace("{role}", detectedRole).replace("{skill}", detectedSkill),
                headlines: HEADLINE_IDEAS.map(h => h.replace("{role}", detectedRole).replace("{skill}", detectedSkill))
            };

            setResults(generatedResults);
            setLoading(false);
            window.scrollTo({ top: 800, behavior: 'smooth' });
        }, 1500);
    };

    const toggleCheckItem = (index) => {
        const newChecklist = [...checklist];
        newChecklist[index] = !newChecklist[index];
        setChecklist(newChecklist);
    };

    return (
        <div className="branding-assistant-page">
            <Header />
            
            <div className="branding-wrapper">
                {/* Header Section */}
                <div className="branding-header-card">
                    <img src={brandingBanner} alt="Branding Assistant" className="branding-banner-img" />
                    <div className="branding-intro-text">
                        <h1>Personal Branding Assistant</h1>
                        <p>Elevate your professional presence and stand out in the global job market with AI-powered identity optimization.</p>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Sidebar: Checklist */}
                    <div className="col-lg-4">
                        <div className="checklist-card">
                            <h3><i className="fa-solid fa-list-check text-success"></i> Branding Checklist</h3>
                            <div className="checklist-items-container">
                                {CHECKLIST_ITEMS.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className={`checklist-item ${checklist[index] ? 'completed' : ''}`}
                                        onClick={() => toggleCheckItem(index)}
                                    >
                                        <div className="custom-checkbox">
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-top text-center text-muted small">
                                {checklist.filter(i => i).length} of {CHECKLIST_ITEMS.length} completed
                            </div>
                        </div>

                        <div className="checklist-card bg-light border-0">
                            <h4 className="fs-5 fw-bold mb-3"><i className="fa-solid fa-lightbulb text-warning me-2"></i>Content Idea</h4>
                            <p className="small text-muted">Post about a recent challenge you solved in your field to build authority on LinkedIn.</p>
                        </div>
                    </div>

                    {/* Main Section: Bio Generator */}
                    <div className="col-lg-8">
                        <div className="generator-card">
                            <h3>Identity Synthesis</h3>
                            <p className="text-muted mb-4">Paste your current bio or a brief description of your experience to generate optimized profiles.</p>
                            
                            <form onSubmit={analyzeBranding}>
                                <textarea
                                    className="modern-branding-textarea"
                                    rows="6"
                                    placeholder="e.g. I am a software engineer with 3 years of experience in building React apps..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                ></textarea>
                                <div className="text-end">
                                    <button className="branding-action-btn" type="submit" disabled={loading || !input}>
                                        {loading ? <><i className="fa-solid fa-circle-notch fa-spin me-2"></i> Analyzing...</> : "Optimize My Brand"}
                                    </button>
                                </div>
                            </form>

                            {results && (
                                <div className="results-grid-modern animate-in">
                                    <hr className="my-5" />
                                    
                                    <div className="mb-5">
                                        <h4 className="fw-bold mb-4"><i className="fa-solid fa-wand-sparkles text-primary me-2"></i>Recommended Headlines</h4>
                                        <div className="list-group">
                                            {results.headlines.map((h, i) => (
                                                <div key={i} className="list-group-item d-flex justify-content-between align-items-center bg-light border-0 mb-2 rounded-3">
                                                    <span className="fw-600">{h}</span>
                                                    <button className="btn btn-sm" onClick={() => navigator.clipboard.writeText(h)}>
                                                        <i className="fa-regular fa-copy"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <h4 className="fw-bold mb-4">Profile Summaries</h4>
                                    
                                    <div className="suggestion-card-premium">
                                        <span className="result-tag tag-pro">Professional</span>
                                        <p className="result-text">{results.professional}</p>
                                        <button className="btn btn-dark btn-sm rounded-pill px-3" onClick={() => navigator.clipboard.writeText(results.professional)}>
                                            <i className="fa-regular fa-copy me-2"></i> Copy Bio
                                        </button>
                                    </div>

                                    <div className="suggestion-card-premium">
                                        <span className="result-tag tag-creative">Creative</span>
                                        <p className="result-text">{results.creative}</p>
                                        <button className="btn btn-dark btn-sm rounded-pill px-3" onClick={() => navigator.clipboard.writeText(results.creative)}>
                                            <i className="fa-regular fa-copy me-2"></i> Copy Bio
                                        </button>
                                    </div>

                                    <div className="suggestion-card-premium">
                                        <span className="result-tag tag-minimal">Minimalist</span>
                                        <p className="result-text">{results.minimalist}</p>
                                        <button className="btn btn-dark btn-sm rounded-pill px-3" onClick={() => navigator.clipboard.writeText(results.minimalist)}>
                                            <i className="fa-regular fa-copy me-2"></i> Copy Bio
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
