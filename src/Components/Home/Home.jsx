import React, { useContext, useState, useEffect, useRef } from "react";
import Header from "../Header/Header";
import "./Home.css";
import heroImage from "../../assets/ai_hero.png";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import { TheUserContext } from "../UserContext/UserContext";

const STATS = [
    { value: 12000, suffix: "+", label: "Active Jobs" },
    { value: 95, suffix: "%", label: "Match Rate" },
    { value: 500, suffix: "+", label: "Companies" },
    { value: 200, suffix: "+", label: "AI Tools" },
];

function useCountUp(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

function StatCard({ value, suffix, label, start }) {
    const count = useCountUp(value, 2000, start);
    return (
        <div className="stat-card text-center">
            <div className="stat-number">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

export default function Home() {
  const { handleSearch, handlePillClick } = useContext(TheUserContext);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            setStatsVisible(true);
            observer.disconnect();
        }
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll Reveal for all sections
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal-section").forEach(el => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className="container-fluid p-0 position-relative home-grand-wrapper">
      {/* ABSOLUTE BACKGROUND AI BRAIN */}
      <div className="hero-bg-wrapper">
        <img src={heroImage} alt="AI Brain" />
      </div>

      <Header />
      <div className="container main-content-wrapper pb-5">
        
        {/* HERO SECTION */}
        <div className="hero-container d-flex mt-5 pt-4 pb-4">
          <div className="info">
            <h2>
              Welcome to <br/><span>NextHire</span>
            </h2>
            <p className="hero-subtext mt-3">
              Unlock Your Career Potential with<br/>AI-Driven Recruitment
            </p>
          </div>
        </div>

        {/* SEARCH AND PILLS SECTION */}
        <div className="search-section mt-4 position-relative d-flex justify-content-center align-items-center">
            <div className="pills-container d-flex flex-column align-items-end me-3 gap-3">
                <span className="search-pill" onClick={() => handlePillClick("Remote")}>Remote</span>
                <span className="search-pill push-left" onClick={() => handlePillClick("Engineering")}>Engineering</span>
                <span className="search-pill" onClick={() => handlePillClick("Full-time")}>Full-time</span>
            </div>
            
            <form
              className="d-flex align-items-center search-glass text-light gradient-border-wrapper"
              role="search"
              onSubmit={handleSearch}
            >
              <input
                className="form-control me-2 flex-grow-1 ps-4"
                type="search"
                id="search"
                name="search"
                placeholder="Search jobs, skills, or companies..."
                aria-label="Search"
              />
              <button className="btn search-btn rounded-circle d-flex align-items-center justify-content-center me-1" type="submit">
                <i className="fa-solid fa-magnifying-glass text-dark"></i>
              </button>
            </form>

            <div className="pills-container d-flex flex-column align-items-start ms-3 gap-3">
                <span className="search-pill" onClick={() => handlePillClick("Marketing")}>Marketing</span>
                <span className="search-pill push-right" onClick={() => handlePillClick("Design")}>Design</span>
                <span className="search-pill" onClick={() => handlePillClick("Startup")}>Startup</span>
            </div>
        </div>

        {/* STATS SECTION */}
        <div ref={statsRef} className="stats-section py-4 reveal-section animate-in">
            <div className="stats-grid">
                {STATS.map((s) => (
                    <StatCard key={s.label} {...s} start={statsVisible} />
                ))}
            </div>
        </div>

        {/* FEATURES CARDS SECTION */}
        <div className="row features-row mt-5 pt-5 mb-5 pb-5 position-relative z-3 reveal-section">
            <div className="col-lg-4 col-md-6 mb-4">
                <div className="job-glass-card neon-card-cyan h-100 d-flex flex-column">
                    <div className="card-top d-flex align-items-center mb-3">
                        <div className="icon-box me-3 d-flex justify-content-center align-items-center" style={{width: '50px', height: '50px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '12px'}}>
                            <i className="fa-solid fa-network-wired text-cyan fs-4"></i>
                        </div>
                        <h4 className="m-0 text-white fw-bold">Neural<br/>Matching</h4>
                    </div>
                    <div className="cyan-divider mb-3"></div>
                    <p className="text-secondary mb-4 card-desc">Proprietary AI algorithms match your technical signature with elite roles.</p>
                    <Link to="/alljobs" className="btn btn-cyan-glow w-100 py-3 mt-auto">Find Hubs</Link>
                </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
                <div className="job-glass-card neon-card-purple h-100 d-flex flex-column">
                    <div className="card-top d-flex align-items-center mb-3">
                        <div className="icon-box me-3 d-flex justify-content-center align-items-center" style={{width: '50px', height: '50px', background: 'rgba(176, 38, 255, 0.1)', borderRadius: '12px'}}>
                            <i className="fa-solid fa-bolt text-purple fs-4"></i>
                        </div>
                        <h4 className="m-0 text-white fw-bold">Instant<br/>Deployment</h4>
                    </div>
                    <div className="cyan-divider mb-3"></div>
                    <p className="text-secondary mb-4 card-desc">Accelerated application protocols ensuring you reach decision makers instantly.</p>
                    <Link to="/employeepage" className="btn btn-purple-glow w-100 py-3 text-white mt-auto">Track Signal</Link>
                </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
                <div className="job-glass-card neon-card-teal h-100 d-flex flex-column">
                    <div className="card-top d-flex align-items-center mb-3">
                        <div className="icon-box me-3 d-flex justify-content-center align-items-center" style={{width: '50px', height: '50px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '12px'}}>
                            <i className="fa-regular fa-building text-cyan fs-4"></i>
                        </div>
                        <h4 className="m-0 text-white fw-bold">Corporate<br/>Insights</h4>
                    </div>
                    <div className="cyan-divider mb-3"></div>
                    <p className="text-secondary mb-4 card-desc">Deep-link visualizations into company culture and technical stack metrics.</p>
                    <Link to="/companypage" className="btn btn-cyan-glow w-100 py-3 mt-auto">Explore Data</Link>
                </div>
            </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
