import React, { useContext, useState } from 'react'
import Header from '../Header/Header'
import Trendings from '../Trendings/Trendings'
import "./AllJobs.css"
import Footer from '../Footer/Footer'
import { Link } from 'react-router-dom'
import { TheUserContext } from '../UserContext/UserContext'

export default function AllJobs() {
    const { searchQuery } = useContext(TheUserContext)
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showCheckInternet, setShowCheckInternet] = useState(false);
    const time = 2000;

    const btnClick = () => {
        if (count < 3) {
            setLoading(true);
            setTimeout(() => {
                setCount(prev => prev + 1);
                setLoading(false);
            }, time);
        } else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setShowCheckInternet(true);
            }, 5000);
        }
    };

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container all-jobs-container py-5">
                <div className="text-center mb-5">
                    <span className="section-tag animate-in">Market Intelligence</span>
                    <h1 className="display-4 fw-bold text-white mb-3">Global <span className="text-cyan">Job Matrix</span></h1>
                    <p className="text-secondary opacity-75">Accessing real-time professional opportunities synthesized by TalentAI.</p>
                </div>

                <div className="all-jobs">
                    {/* Jobs Mapping */}
                    {[...Array(count)].map((_, i) => (
                        <div key={i} className="animate-in" style={{ animationDelay: `${i * 0.2}s` }}>
                            <Trendings number={localStorage.getItem("numberJobs")} search={searchQuery} />
                        </div>
                    ))}

                    {/* Spinner */}
                    {loading && (
                        <div className="thespinner text-center my-5">
                            <i className="fa-solid fa-spinner fa-spin fa-3x text-cyan shadow-glow"></i>
                            <p className="text-cyan mt-3 tracking-widest">EXPANDING NEURAL DATASET...</p>
                        </div>
                    )}

                    {/* View More Button */}
                    <div className="text-center mt-5">
                        {!loading && !showCheckInternet && count < 4 && (
                            <button
                                onClick={btnClick}
                                className="btn btn-cyan-glow px-5 py-3 fw-bold"
                            >
                                LOAD ADDITIONAL DATA VECTORS
                            </button>
                        )}

                        {/* Internet Check */}
                        {!loading && showCheckInternet && (
                            <div className="animate-in">
                                <p className="text-danger mb-4"><i className="fa-solid fa-triangle-exclamation me-2"></i> Latency Detected in Sub-Neural Node</p>
                                <Link
                                    to={"/internetspeed"}
                                    className="btn btn-outline-danger px-5 py-3 fw-bold"
                                >
                                    DIAGNOSE CONNECTION BANDWIDTH
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

