import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./OfferWeightCalculator.css";
import offerBanner from "../../assets/offer_banner.png";

export default function OfferWeightCalculator() {
    const defaultOffer = {
        salary: "",
        commute: "30",
        benefits: 7,
        growth: 7,
        stability: 7
    };

    const [offerA, setOfferA] = useState({ ...defaultOffer });
    const [offerB, setOfferB] = useState({ ...defaultOffer });
    const [result, setResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const calculateValues = () => {
        if (!offerA.salary || !offerB.salary) return;
        
        setIsAnalyzing(true);
        setTimeout(() => {
            const processOffer = (off) => {
                const s = parseFloat(off.salary) || 0;
                const c = parseFloat(off.commute) || 0;

                const salaryScore = (s / 150000) * 45; 
                const growthScore = off.growth * 3.0;
                const commutePenalty = (c / 120) * 15; 
                const stabilityScore = off.stability * 1.5;
                const benefitsScore = off.benefits * 1.5;

                return Math.round(Math.max(0, Math.min(100, salaryScore + growthScore + stabilityScore + benefitsScore - commutePenalty)));
            };

            const scoreA = processOffer(offerA);
            const scoreB = processOffer(offerB);

            setResult({
                scoreA,
                scoreB,
                winner: scoreA > scoreB ? "Offer A" : "Offer B",
                verdict: scoreA > scoreB 
                    ? "Offer A provides the best overall balance between financial reward and professional sustainability."
                    : "Offer B is the superior choice for long-term growth and quality of life."
            });
            setIsAnalyzing(false);
            window.scrollTo({ top: 800, behavior: 'smooth' });
        }, 1500);
    };

    return (
        <div className="offer-calc-page">
            <Header />
            
            <div className="offer-calc-wrapper">
                {/* Header Section */}
                <div className="offer-header-card">
                    <img src={offerBanner} alt="Offer Calculator" className="offer-banner-img" />
                    <div className="offer-intro-text">
                        <h1>Offer Value Calculator</h1>
                        <p>Go beyond the base salary. Compare multiple job offers using AI to find the perfect balance for your life and career.</p>
                    </div>
                </div>

                {/* Comparison Card */}
                <div className="comparison-container">
                    <div className="row g-4">
                        {/* Offer A */}
                        <div className="col-lg-5">
                            <div className="offer-column">
                                <h3>Offer Alpha <i className="fa-solid fa-building-circle-check text-primary"></i></h3>
                                
                                <div className="mb-4">
                                    <label className="slider-label">Annual Salary ($)</label>
                                    <input 
                                        type="number" 
                                        className="modern-calc-input"
                                        placeholder="e.g. 95000"
                                        value={offerA.salary}
                                        onChange={(e) => setOfferA({...offerA, salary: e.target.value})}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="slider-label">Daily Commute (mins)</label>
                                    <input 
                                        type="number" 
                                        className="modern-calc-input"
                                        placeholder="e.g. 45"
                                        value={offerA.commute}
                                        onChange={(e) => setOfferA({...offerA, commute: e.target.value})}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="slider-label">Career Growth <span>{offerA.growth}/10</span></label>
                                    <input type="range" className="form-range" min="1" max="10" value={offerA.growth} 
                                        onChange={(e) => setOfferA({...offerA, growth: e.target.value})} />
                                </div>

                                <div className="mb-4">
                                    <label className="slider-label">Benefits Index <span>{offerA.benefits}/10</span></label>
                                    <input type="range" className="form-range" min="1" max="10" value={offerA.benefits} 
                                        onChange={(e) => setOfferA({...offerA, benefits: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* VS Divider */}
                        <div className="col-lg-2 vs-divider">
                            <div className="vs-circle">VS</div>
                            <button 
                                className="calc-btn-primary" 
                                onClick={calculateValues}
                                disabled={isAnalyzing || !offerA.salary || !offerB.salary}
                            >
                                {isAnalyzing ? <i className="fa-solid fa-sync fa-spin"></i> : "Calculate"}
                            </button>
                        </div>

                        {/* Offer B */}
                        <div className="col-lg-5">
                            <div className="offer-column">
                                <h3>Offer Beta <i className="fa-solid fa-building-circle-arrow-right text-success"></i></h3>
                                
                                <div className="mb-4">
                                    <label className="slider-label">Annual Salary ($)</label>
                                    <input 
                                        type="number" 
                                        className="modern-calc-input"
                                        placeholder="e.g. 105000"
                                        value={offerB.salary}
                                        onChange={(e) => setOfferB({...offerB, salary: e.target.value})}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="slider-label">Daily Commute (mins)</label>
                                    <input 
                                        type="number" 
                                        className="modern-calc-input"
                                        placeholder="e.g. 20"
                                        value={offerB.commute}
                                        onChange={(e) => setOfferB({...offerB, commute: e.target.value})}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="slider-label">Career Growth <span>{offerB.growth}/10</span></label>
                                    <input type="range" className="form-range" min="1" max="10" value={offerB.growth} 
                                        onChange={(e) => setOfferB({...offerB, growth: e.target.value})} />
                                </div>

                                <div className="mb-4">
                                    <label className="slider-label">Benefits Index <span>{offerB.benefits}/10</span></label>
                                    <input type="range" className="form-range" min="1" max="10" value={offerB.benefits} 
                                        onChange={(e) => setOfferB({...offerB, benefits: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Display */}
                    {result && (
                        <div className="offer-results-box animate-in">
                            <div className="row g-4 text-center">
                                <div className="col-md-6">
                                    <div className="score-display">
                                        <div className="text-muted small fw-bold mb-2">Alpha Score</div>
                                        <div className="score-number">{result.scoreA}%</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="score-display">
                                        <div className="text-muted small fw-bold mb-2">Beta Score</div>
                                        <div className="score-number text-success">{result.scoreB}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="verdict-alert shadow-sm">
                                <div className="winner-label">🏆 Better Choice: {result.winner}</div>
                                <h4 className="fw-bold mb-2">Expert Analysis</h4>
                                <p className="mb-0 text-dark opacity-75 fs-5">{result.verdict}</p>
                            </div>

                            <div className="mt-5 text-center">
                                <button className="btn btn-link text-muted text-decoration-none" onClick={() => setResult(null)}>
                                    <i className="fa-solid fa-rotate-left me-2"></i> Reset Comparison
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
