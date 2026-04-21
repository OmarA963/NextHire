import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./PivotPredictor.css";
import predictGraphic from "../../assets/ai_tech.png";

export default function PivotPredictor() {
    const [skills, setSkills] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const analyzeFuture = () => {
        setIsAnalyzing(true);

        setTimeout(() => {
            const skillList = skills.toLowerCase().split(',').map(s => s.trim());

            const database = {
                'react': { risk: 65, timeline: 'High automation for basic UI in 2.5 years', pivot: 'Focus on AI Agent Interfaces & Edge Reactivity' },
                'javascript': { risk: 30, timeline: 'Core logic remains stable, boilerplate goes to AI', pivot: 'Universal Compute & WebAssembly (WASM)' },
                'html': { risk: 85, timeline: 'Zero-code generation in 18 months', pivot: 'Accessibility Engineering & Semantic Architecture' },
                'css': { risk: 80, timeline: 'Design-to-Code AI is winning', pivot: 'Motion Design & Spatial UI (AR/VR)' },
                'python': { risk: 20, timeline: 'Remains the language of AI research', pivot: 'MLOps & LLM Fine-tuning' },
                'node.js': { risk: 40, timeline: 'Backend boilerplate automated', pivot: 'Distributed Systems & Serverless Architecture' },
                'java': { risk: 45, timeline: 'Enterprise legacy stable, new dev shifting', pivot: 'Cloud-Native & Quarkus Optimization' },
                'sql': { risk: 15, timeline: 'Data remains king, but AI writes queries', pivot: 'Vector Databases & Data Engineering' }
            };

            let totalRisk = 0;
            let foundSkills = 0;
            let timelineSteps = [];
            let pivotActions = [];

            skillList.forEach(s => {
                if (database[s]) {
                    totalRisk += database[s].risk;
                    foundSkills++;
                    timelineSteps.push({ skill: s, text: database[s].timeline });
                    pivotActions.push({ skill: s, action: database[s].pivot });
                }
            });

            const score = foundSkills > 0 ? (totalRisk / foundSkills) : 35;
            const longevity = 100 - score;

            setResult({
                longevity: Math.round(longevity),
                riskLevel: score > 70 ? 'Extreme' : score > 40 ? 'Moderate' : 'Low',
                timeline: timelineSteps.length > 0 ? timelineSteps : [{ skill: 'General', text: 'Market shifting towards AI integration across all stacks.' }],
                pivots: pivotActions.length > 0 ? pivotActions : [{ skill: 'Core', action: 'Move towards AI Management and Strategy.' }],
                verdict: score > 60
                    ? "Critical Alert: Your current technical stack is highly vulnerable to rapid AI automation within this cycle."
                    : score > 30
                        ? "Stable integration: Your core algorithmic logic remains valuable, though boilerplate efficiency is being consumed by neural tools."
                        : "Elite Singularity: Your current specializations are within the high-complexity 'Safe Zone' of non-trivial computing."
            });

            setIsAnalyzing(false);
            window.scrollTo({ top: 600, behavior: 'smooth' });
        }, 2000);
    };

    const getRiskClass = (level) => {
        if (level === 'Extreme') return 'risk-high';
        if (level === 'Moderate') return 'risk-medium';
        return 'risk-low';
    };

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container predictor-container">
                <div className="predictor-card">
                    <div className="text-center mb-5">
                        <div className="position-relative d-inline-block mb-4">
                            <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'150%', height:'150%'}}></div>
                            <img src={predictGraphic} alt="AI Predictor" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '280px'}} />
                        </div>
                        <h1 className="text-white fw-bold">Neural <span className="text-cyan">Oracle</span></h1>
                        <p className="text-secondary">Projecting technical obsolescence and strategic pivot vectors for the next fiscal cycle.</p>
                    </div>

                    {!result ? (
                        <div className="skill-input-card text-center py-5">
                            <h3 className="text-white mb-3">Skillset Quantification</h3>
                            <p className="text-secondary mb-4">Initialize scanning of your core competencies (e.g. React, Python, SQL).</p>
                            <div className="row justify-content-center">
                                <div className="col-md-9">
                                    <input
                                        className="glass-input w-100 mb-4 text-center fs-5"
                                        placeholder="React, Distributed Systems, Python..."
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-cyan-glow px-5 py-3 fw-bold"
                                        onClick={analyzeFuture}
                                        disabled={isAnalyzing || !skills}
                                    >
                                        {isAnalyzing ? (
                                            <><i className="fa-solid fa-spinner fa-spin me-2"></i>Initiating Market Matrix Scan...</>
                                        ) : "Execute Predictive Analysis"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="analysis-results animate-in">
                            <div className="row g-4 align-items-center">
                                <div className="col-md-4 text-center">
                                    <div className="gauge-container">
                                        <div className="gauge-ring"></div>
                                        <div
                                            className="gauge-fill"
                                            style={{ transform: `rotate(${result.longevity * 1.8}deg)` }}
                                        ></div>
                                        <div className="gauge-value">{result.longevity}%</div>
                                    </div>
                                    <h5 className="text-secondary mt-3">Longevity Coefficient</h5>
                                    <span className={`risk-tag ${getRiskClass(result.riskLevel)}`}>
                                        {result.riskLevel} Persistence
                                    </span>
                                </div>
                                <div className="col-md-8">
                                    <div className="analysis-verdict">
                                        <h4 className="text-cyan mb-3"><i className="fa-solid fa-microchip me-2"></i>Neural Strategic Verdict</h4>
                                        <p className="text-white fs-5 opacity-90">{result.verdict}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-5 g-4">
                                <div className="col-lg-6">
                                    <h4 className="text-white mb-4"><i className="fa-solid fa-hourglass-half text-cyan me-2"></i> Obsolescence Log</h4>
                                    <div className="timeline-container ps-3">
                                        {result.timeline.map((item, i) => (
                                            <div key={i} className="timeline-step">
                                                <strong className="text-capitalize">{item.skill} Vector</strong>
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <h4 className="text-white mb-4"><i className="fa-solid fa-bolt text-purple me-2"></i> Survival Protocols</h4>
                                    <div className="row g-3">
                                        {result.pivots.map((item, i) => (
                                            <div key={i} className="col-12">
                                                <div className="pivot-card">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="badge bg-purple-glow text-white text-capitalize">{item.skill}</span>
                                                        <i className="fa-solid fa-shield-halved text-cyan opacity-50"></i>
                                                    </div>
                                                    <p className="mb-0 text-white opacity-75">{item.action}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-5">
                                <button className="btn btn-purple-glow px-5 py-3" onClick={() => setResult(null)}>
                                    <i className="fa-solid fa-rotate-left me-2"></i>Reset Market Scan
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

