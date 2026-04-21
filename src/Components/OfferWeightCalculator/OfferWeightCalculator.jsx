import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./OfferWeightCalculator.css";
import calcGraphic from "../../assets/ai_management.png";

export default function OfferWeightCalculator() {
    const defaultOffer = {
        salary: "",
        commute: "",
        benefits: 5,
        growth: 5,
        stability: 5
    };

    const [offerA, setOfferA] = useState({ ...defaultOffer });
    const [offerB, setOfferB] = useState({ ...defaultOffer });
    const [result, setResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const calculateValues = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const processOffer = (off) => {
                const s = parseFloat(off.salary) || 0;
                const c = parseFloat(off.commute) || 0;

                const salaryScore = (s / 200000) * 40; 
                const growthScore = off.growth * 2.5;
                const commutePenalty = (c / 120) * 15; 
                const stabilityScore = off.stability * 1.0;
                const benefitsScore = off.benefits * 1.0;

                const total = salaryScore + growthScore + stabilityScore + benefitsScore - commutePenalty;
                return Math.max(0, Math.min(100, total));
            };

            const scoreA = processOffer(offerA);
            const scoreB = processOffer(offerB);

            let verdict = "";
            if (Math.abs(scoreA - scoreB) < 5) {
                verdict = "Statistical equilibrium reached. Both offers represent similar potential energy. Base your final selection on team cultural resonance.";
            } else if (scoreA > scoreB) {
                const reason = offerA.salary > offerB.salary && scoreA > scoreB
                    ? "Offer A provides optimal fiscal throughput and lifestyle alignment."
                    : "Despite variance in base compensation, Offer A wins due to superior growth velocity and reduced transit overhead.";
                verdict = `Offer A is the strategic vector winner. ${reason}`;
            } else {
                const reason = offerB.salary > offerA.salary && scoreB > scoreA
                    ? "Offer B suggests a higher probability of life satisfaction and long-term accumulation."
                    : "Offer B is the definitive choice for long-term career resilience, despite initial salary parameters.";
                verdict = `Offer B represents the optimal career path. ${reason}`;
            }

            setResult({
                scoreA: Math.round(scoreA),
                scoreB: Math.round(scoreB),
                winner: scoreA > scoreB ? "Offer A" : "Offer B",
                verdict: verdict
            });
            setIsAnalyzing(false);
            window.scrollTo({ top: 800, behavior: 'smooth' });
        }, 1500);
    };

    const handleInput = (offer, setOffer, field, value) => {
        setOffer({ ...offer, [field]: value });
    };

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container offer-calc-container">
                <div className="text-center mb-5">
                    <div className="position-relative d-inline-block mb-4">
                        <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'150%', height:'150%'}}></div>
                        <img src={calcGraphic} alt="Offer Calculator" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '280px'}} />
                    </div>
                    <h1 className="text-white fw-bold">Neural <span className="text-cyan">Balancer</span></h1>
                    <p className="text-secondary">Quantifying the 'Total Life Value' of career opportunities beyond baseline compensation.</p>
                </div>

                <div className="calc-card">
                    <div className="row g-5">
                        {/* Offer A Column */}
                        <div className="col-lg-5">
                            <div className="offer-header header-a">VECTOR ALPHA (OFFER A)</div>
                            <div className="mb-4">
                                <label className="input-group-label">PROJECTED SALARY ($)</label>
                                <input type="number" className="glass-input w-100" placeholder="e.g. 85000"
                                    value={offerA.salary} onChange={(e) => handleInput(offerA, setOfferA, 'salary', e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="input-group-label">TRANSIT LATENCY (MINUTES)</label>
                                <input type="number" className="glass-input w-100" placeholder="e.g. 45"
                                    value={offerA.commute} onChange={(e) => handleInput(offerA, setOfferA, 'commute', e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="input-group-label d-flex justify-content-between">
                                    GROWTH VELOCITY <span>{offerA.growth}/10</span>
                                </label>
                                <input type="range" className="form-range" min="1" max="10"
                                    value={offerA.growth} onChange={(e) => handleInput(offerA, setOfferA, 'growth', e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="input-group-label d-flex justify-content-between">
                                    BENEFITS INDEX <span>{offerA.benefits}/10</span>
                                </label>
                                <input type="range" className="form-range" min="1" max="10"
                                    value={offerA.benefits} onChange={(e) => handleInput(offerA, setOfferA, 'benefits', e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="input-group-label d-flex justify-content-between">
                                    SYSTEM STABILITY <span>{offerA.stability}/10</span>
                                </label>
                                <input type="range" className="form-range" min="1" max="10"
                                    value={offerA.stability} onChange={(e) => handleInput(offerA, setOfferA, 'stability', e.target.value)} />
                            </div>
                        </div>

                        {/* VS Indicator */}
                        <div className="col-lg-2 d-flex flex-column justify-content-center align-items-center">
                            <div className="text-secondary opacity-25 fw-black display-4 mb-4">VS</div>
                            <button className="btn btn-cyan-glow w-100 py-3 fw-bold" onClick={calculateValues} disabled={isAnalyzing}>
                                {isAnalyzing ? <i className="fa-solid fa-spinner fa-spin"></i> : "EQUILIBRIUM"}
                            </button>
                        </div>

                        {/* Offer B Column */}
                        <div className="col-lg-5">
                            <div className="offer-header header-b">VECTOR BETA (OFFER B)</div>
                            <div className="mb-4">
                                <label className="input-group-label">PROJECTED SALARY ($)</label>
                                <input type="number" className="glass-input w-100" placeholder="e.g. 95000"
                                    value={offerB.salary} onChange={(e) => handleInput(offerB, setOfferB, 'salary', e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="input-group-label">TRANSIT LATENCY (MINUTES)</label>
                                <input type="number" className="glass-input w-100" placeholder="e.g. 20"
                                    value={offerB.commute} onChange={(e) => handleInput(offerB, setOfferB, 'commute', e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="input-group-label d-flex justify-content-between">
                                    GROWTH VELOCITY <span>{offerB.growth}/10</span>
                                </label>
                                <input type="range" className="form-range" min="1" max="10"
                                    value={offerB.growth} onChange={(e) => handleInput(offerB, setOfferB, 'growth', e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="input-group-label d-flex justify-content-between">
                                    BENEFITS INDEX <span>{offerB.benefits}/10</span>
                                </label>
                                <input type="range" className="form-range" min="1" max="10"
                                    value={offerB.benefits} onChange={(e) => handleInput(offerB, setOfferB, 'benefits', e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="input-group-label d-flex justify-content-between">
                                    SYSTEM STABILITY <span>{offerB.stability}/10</span>
                                </label>
                                <input type="range" className="form-range" min="1" max="10"
                                    value={offerB.stability} onChange={(e) => handleInput(offerB, setOfferB, 'stability', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className="comparison-result animate-in">
                            <div className="row text-center align-items-center">
                                <div className="col-md-5">
                                    <h4 className="text-white mb-3">Alpha Index</h4>
                                    <div className="display-4 fw-bold text-cyan">{result.scoreA}%</div>
                                    <div className="score-bar-container">
                                        <div className="score-bar bar-a" style={{ width: `${result.scoreA}%` }}></div>
                                    </div>
                                </div>
                                <div className="col-md-2 text-secondary fw-bold fs-3">PHI</div>
                                <div className="col-md-5">
                                    <h4 className="text-white mb-3">Beta Index</h4>
                                    <div className="display-4 fw-bold text-purple">{result.scoreB}%</div>
                                    <div className="score-bar-container">
                                        <div className="score-bar bar-b" style={{ width: `${result.scoreB}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="verdict-box">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0 uppercase tracking-widest"><i className="fa-solid fa-brain text-cyan me-2"></i>Strategic Synthesis</h5>
                                    <span className="winner-badge">{result.winner} IS OPTIMAL</span>
                                </div>
                                <p className="text-white opacity-90 fs-5">{result.verdict}</p>
                            </div>

                            <div className="text-center mt-5">
                                <button className="btn btn-link text-secondary text-decoration-none" onClick={() => setResult(null)}>
                                    <i className="fa-solid fa-rotate-left me-2"></i>Reset Comparison Matrix
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

