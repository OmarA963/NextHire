import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./PivotPredictor.css";
import pivotBanner from "../../assets/pivot_banner.png";

export default function PivotPredictor() {
    const [skills, setSkills] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const SKILL_DATABASE = {
        'react': { risk: 65, timeline: '2.5 years until heavy automation', pivot: 'Focus on AI Agent Interfaces & Edge Computing' },
        'javascript': { risk: 30, timeline: 'Stable core logic for 5+ years', pivot: 'Master Universal Compute & WebAssembly' },
        'python': { risk: 15, timeline: 'Essential for AI; Safe for 10+ years', pivot: 'Move into MLOps & Data Engineering' },
        'design': { risk: 40, timeline: 'UI generation is rising fast', pivot: 'Pivot to Spatial UI & Motion Storytelling' },
        'sql': { risk: 20, timeline: 'Data architecture remains critical', pivot: 'Vector DBs & Knowledge Graphs' },
        'node': { risk: 35, timeline: 'Backend boilerplate is automating', pivot: 'Distributed Systems & Security' }
    };

    const analyzeFuture = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const skillList = skills.toLowerCase().split(',').map(s => s.trim());
            let totalRisk = 0;
            let foundSkills = 0;
            let timelines = [];
            let pivots = [];

            skillList.forEach(s => {
                if (SKILL_DATABASE[s]) {
                    totalRisk += SKILL_DATABASE[s].risk;
                    foundSkills++;
                    timelines.push({ skill: s, text: SKILL_DATABASE[s].timeline });
                    pivots.push({ skill: s, action: SKILL_DATABASE[s].pivot });
                }
            });

            const score = foundSkills > 0 ? (totalRisk / foundSkills) : 40;
            const longevity = 100 - score;

            setResult({
                longevity: Math.round(longevity),
                verdict: score > 60
                    ? "Your current stack is at high risk of rapid AI displacement. Strategic pivot recommended immediately."
                    : "Your skills are well-positioned. Focus on specialized niches to maintain a competitive edge.",
                timelines: timelines.length > 0 ? timelines : [{ skill: 'General', text: 'Market shifting towards AI-first development.' }],
                pivots: pivots.length > 0 ? pivots : [{ skill: 'Strategy', action: 'Adopt AI-orchestration tools and hybrid management.' }]
            });

            setIsAnalyzing(false);
            window.scrollTo({ top: 800, behavior: 'smooth' });
        }, 1800);
    };

    return (
        <div className="pivot-page">
            <Header />

            <div className="pivot-wrapper">
                {/* Header Section */}
                <div className="pivot-header-card">
                    <img src={pivotBanner} alt="Pivot Predictor" className="pivot-banner-img" />
                    <div className="pivot-intro-text">
                        <h1>Pivot Predictor</h1>
                        <p>Analyze the future value of your skills and discover the most profitable career switch vectors for the AI era.</p>
                    </div>
                </div>

                {/* Input Section */}
                <div className="assessment-card text-center">
                    <h3>Analyze Your Skillset</h3>
                    <p className="text-muted mb-4">Enter your core skills (comma-separated) to project your technical longevity.</p>

                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <input
                                type="text"
                                className="modern-pivot-input text-center"
                                placeholder="e.g. React, Python, UI Design, SQL..."
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                            />
                            <button
                                className="pivot-btn-primary"
                                onClick={analyzeFuture}
                                disabled={isAnalyzing || !skills}
                            >
                                {isAnalyzing ? <><i className="fa-solid fa-sync fa-spin me-2"></i> Analyzing Matrix...</> : "Predict My Future"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="animate-in">
                        <div className="result-display-grid">
                            <div className="longevity-meter-box">
                                <div className="score-circle">
                                    <span className="score-value">{result.longevity}%</span>
                                    <span className="score-label">Longevity</span>
                                </div>
                                <h5 className="fw-bold text-dark">Stability Index</h5>
                                <p className="text-muted small">Based on current market volatility and AI automation rates.</p>
                            </div>

                            <div className="verdict-box">
                                <h4><i className="fa-solid fa-brain text-primary me-2"></i> Strategic Verdict</h4>
                                <p className="fs-5 text-dark lh-base">{result.verdict}</p>
                                <div className="mt-4 p-3 bg-light rounded-3 border-start border-4 border-primary">
                                    <p className="small text-muted mb-0"><strong>Neural Tip:</strong> Skills involving complex stakeholder management and creative problem solving remain in the 'Elite Zone'.</p>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-5 g-4">
                            <div className="col-lg-6">
                                <div className="assessment-card h-100">
                                    <h4 className="fw-bold mb-4"><i className="fa-solid fa-clock-rotate-left text-primary me-2"></i> Obsolescence Timeline</h4>
                                    <div className="timeline-list">
                                        {result.timelines.map((item, i) => (
                                            <div key={i} className="mb-3 p-3 bg-light rounded-3">
                                                <div className="fw-bold text-dark text-capitalize">{item.skill}</div>
                                                <div className="text-muted small">{item.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="assessment-card h-100">
                                    <h4 className="fw-bold mb-4"><i className="fa-solid fa-route text-success me-2"></i> Recommended Pivots</h4>
                                    <div className="pivot-options-grid mt-0">
                                        {result.pivots.map((item, i) => (
                                            <div key={i} className="modern-pivot-card p-3 mb-2">
                                                <span className="skill-tag-pill">{item.skill}</span>
                                                <p className="text-dark small mb-0">{item.action}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-5">
                            <button className="btn btn-link text-decoration-none text-muted" onClick={() => setResult(null)}>
                                <i className="fa-solid fa-rotate-left me-2"></i> Start New Analysis
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
