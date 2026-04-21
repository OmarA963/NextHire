import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './PersonalBrandingAssistant.css';
import brandingGraphic from '../../assets/ai_design.png';

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

export default function PersonalBrandingAssistant() {
    const [input, setInput] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const analyzeBranding = (e) => {
        e.preventDefault();
        if (!input) return;

        setLoading(true);
        setTimeout(() => {
            const inputLower = input.toLowerCase();
            let detectedRole = "Professional";
            let detectedSkill = "Technology";

            if (inputLower.includes("engineer") || inputLower.includes("developer")) detectedRole = "Software Engineer";
            if (inputLower.includes("react") || inputLower.includes("frontend")) detectedSkill = "React & Frontend Development";
            else if (inputLower.includes("node") || inputLower.includes("backend")) detectedSkill = "Scalable Backend Systems";
            else if (inputLower.includes("design") || inputLower.includes("ui")) detectedSkill = "UI/UX Design";

            const generatedResults = {
                professional: SUGGESTION_TEMPLATES.professional[0]
                    .replace("{role}", detectedRole)
                    .replace("{skill}", detectedSkill),
                creative: SUGGESTION_TEMPLATES.creative[0]
                    .replace("{role}", detectedRole)
                    .replace("{skill}", detectedSkill),
                minimalist: SUGGESTION_TEMPLATES.minimalist[0]
                    .replace("{role}", detectedRole)
                    .replace("{skill}", detectedSkill)
            };

            setResults(generatedResults);
            setLoading(false);
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 1500);
    };

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container personal-branding">
                <div className="branding-container">
                    <div className="text-center mb-5">
                        <div className="position-relative d-inline-block mb-4">
                            <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'150%', height:'150%'}}></div>
                            <img src={brandingGraphic} alt="AI Branding" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '280px'}} />
                        </div>
                        <h1 className="text-white fw-bold">Identity <span className="text-cyan">Optimizer</span></h1>
                        <p className="text-secondary">Refine your professional narrative across global recruitment matrices.</p>
                    </div>

                    <div className="branding-input-card">
                        <h3 className="text-white mb-3">Input Prototype</h3>
                        <p className="text-secondary mb-4">Provide your current professional bio or mission statement for AI synthesis.</p>

                        <form onSubmit={analyzeBranding} className="mt-4">
                            <div className="mb-4">
                                <textarea
                                    className="glass-input w-100"
                                    rows="5"
                                    placeholder="e.g. I am a software engineer focused on building scalable web apps with React..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button className="btn btn-cyan-glow py-3 px-5 fw-bold" type="submit" disabled={loading || !input}>
                                    {loading ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin me-2"></i>Analyzing Neural Data...
                                        </>
                                    ) : "Optimize Persona"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {results && (
                        <div className="result-card animate-in">
                            <h2 className="text-white mb-5 text-center">Synthesized <span className="text-cyan">Profiles</span></h2>

                            <div className="suggestion-box">
                                <span className="tag tag-professional">Professional Protocol</span>
                                <p className="text-white fs-5 mb-3">{results.professional}</p>
                                <button className="btn btn-sm copy-btn px-3 py-2" onClick={() => navigator.clipboard.writeText(results.professional)}>
                                    <i className="fa-regular fa-copy me-2"></i>Copy Stream
                                </button>
                            </div>

                            <div className="suggestion-box">
                                <span className="tag tag-creative">Creative Spectrum</span>
                                <p className="text-white fs-5 mb-3">{results.creative}</p>
                                <button className="btn btn-sm copy-btn px-3 py-2" onClick={() => navigator.clipboard.writeText(results.creative)}>
                                    <i className="fa-regular fa-copy me-2"></i>Copy Stream
                                </button>
                            </div>

                            <div className="suggestion-box">
                                <span className="tag tag-minimalist">Minimalist / HUD Headline</span>
                                <p className="text-white fs-5 mb-3">{results.minimalist}</p>
                                <button className="btn btn-sm copy-btn px-3 py-2" onClick={() => navigator.clipboard.writeText(results.minimalist)}>
                                    <i className="fa-regular fa-copy me-2"></i>Copy Stream
                                </button>
                            </div>

                            <div className="text-center mt-5">
                                <button className="btn btn-link text-cyan text-decoration-none" onClick={() => setResults(null)}>
                                    <i className="fa-solid fa-rotate-left me-2"></i>Initialize New Optimization
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

