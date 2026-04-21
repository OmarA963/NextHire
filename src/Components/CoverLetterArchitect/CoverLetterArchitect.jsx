import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./CoverLetterArchitect.css";
import architectGraphic from "../../assets/ai_design.png";

export default function CoverLetterArchitect() {
    const location = useLocation();
    const [resume, setResume] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [tone, setTone] = useState("Professional");
    const [letter, setLetter] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        if (location.state?.resume) setResume(location.state.resume);
        if (location.state?.jobDesc) setJobDesc(location.state.jobDesc);
    }, [location.state]);

    const generateLetter = () => {
        setIsGenerating(true);
        setDisplayText("");

        setTimeout(() => {
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            const templates = {
                "Professional": `[Your Name]
[Your Address]
[Your Phone] | [Your Email]

${date}

Hiring Manager
[Company Name]

Subject: Application for [Job Title]

Dear Hiring Manager,

I am writing to formally express my interest in the [Job Title] position at [Company Name]. With a strong background as reflected in my resume, I am confident that my skills in areas such as ${extractProjectedSkills(resume)} make me a perfect fit for this role.

During my experience, I have developed a deep understanding of [Key Industry Requirement], and I am eager to apply this expertise to help [Company Name] achieve its goals. I am particularly drawn to this opportunity because of your commitment to [Specific Job Requirement mentioned in Job Description].

I look forward to the possibility of discussing how my technical proficiency and dedicated approach can contribute to your team. Thank you for your time and consideration.

Sincerely,

[Your Name]`,

                "Modern": `[Your Name]
[Your Email] | [Your Portfolio/LinkedIn]

Hey Team at [Company Name],

I've been following [Company Name]'s growth for a while, and when I saw the opening for [Job Title], I knew I had to reach out.

I don't just have the skills listed in your description—like ${extractProjectedSkills(resume)}—I have the passion to use them to solve real problems. I noticed you're looking for someone who can handle [Key Job Requirement], which is exactly where my strengths lie.

In my recent projects, I've focused on [Result-oriented Skill], and I’m ready to hit the ground running with your innovative team. I’d love to chat about the future of [Company Industry] at [Company Name] and how I can help.

Best,

[Your Name]`,

                "Creative": `✨ [Your Name] | [Your Personal Brand Tagline] ✨

To the Visionaries at [Company Name],

Great companies are built on great ideas, and I believe my background in [Primary Skill] can be the next big asset for your [Job Title] role.

I’m not a fan of generic templates. I looked at your job description for [Job Title] and saw a perfect match for my experience with ${extractProjectedSkills(resume)}. What excites me most is [Unique Job Point]—it’s exactly the kind of challenge I thrive on.

My philosophy is simple: build things that matter. I’ve done that with [Previous Project/Skill], and I want to do it again for [Company Name]. Let's create something amazing together.

Cheers,

[Your Name]`
            };

            const finalLetter = templates[tone]
                .replace(/\[Job Title\]/g, extractJobTitle(jobDesc) || "the advertised role")
                .replace(/\[Company Name\]/g, extractCompanyName(jobDesc) || "your organization")
                .replace(/\[Company Industry\]/g, "this industry");

            setLetter(finalLetter);
            setIsGenerating(false);
            animateText(finalLetter);
        }, 1500);
    };

    const animateText = (fullText) => {
        let currentText = "";
        let index = 0;
        const interval = setInterval(() => {
            if (index < fullText.length) {
                currentText += fullText[index];
                setDisplayText(currentText);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 5);
    };

    const extractProjectedSkills = (text) => {
        const commonSkills = ['React', 'JavaScript', 'Node.js', 'Python', 'Java', 'SQL', 'Docker', 'AWS', 'TypeScript'];
        const found = commonSkills.filter(s => text.toLowerCase().includes(s.toLowerCase()));
        return found.length > 0 ? found.slice(0, 3).join(', ') : "top-tier technical skills";
    }

    const extractJobTitle = (text) => {
        const match = text.match(/(Job Title|Role|Position):\s*(.*)/i);
        return match ? match[2] : "";
    }

    const extractCompanyName = (text) => {
        const match = text.match(/(Company|Organization):\s*(.*)/i);
        return match ? match[2] : "";
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(displayText);
    }

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container cover-letter-container">
                <div className="text-center mb-5">
                    <div className="position-relative d-inline-block mb-4">
                        <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'150%', height:'150%'}}></div>
                        <img src={architectGraphic} alt="AI Architect" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '280px'}} />
                    </div>
                    <h1 className="text-white fw-bold">Neural <span className="text-cyan">Scribe</span></h1>
                    <p className="text-secondary">Synthesize high-impact cover letters using weighted professional parameters.</p>
                </div>

                <div className="architect-card mb-5">
                    <div className="row g-5">
                        <div className="col-lg-5">
                            <h3 className="text-white mb-4">Parameter Config</h3>

                            <div className="mb-4">
                                <label className="architect-label">Source Resume Data</label>
                                <textarea
                                    className="glass-input w-100"
                                    rows="6"
                                    placeholder="Paste resume content..."
                                    value={resume}
                                    onChange={(e) => setResume(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="architect-label">Target Vector (Job Description)</label>
                                <textarea
                                    className="glass-input w-100"
                                    rows="6"
                                    placeholder="Paste job description..."
                                    value={jobDesc}
                                    onChange={(e) => setJobDesc(e.target.value)}
                                ></textarea>
                            </div>

                            <label className="architect-label mb-3">Tone Calibration</label>
                            <div className="tone-selector">
                                {['Professional', 'Modern', 'Creative'].map(t => (
                                    <button
                                        key={t}
                                        className={`tone-btn ${tone === t ? 'active' : ''}`}
                                        onClick={() => setTone(t)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="btn btn-cyan-glow w-100 py-3 mt-3 fw-bold"
                                onClick={generateLetter}
                                disabled={isGenerating || !resume || !jobDesc}
                            >
                                {isGenerating ? (
                                    <><i className="fa-solid fa-spinner fa-spin me-2"></i>Synthesizing...</>
                                ) : "Initialize Synthesis"}
                            </button>
                        </div>

                        <div className="col-lg-7">
                            <div className="letter-canvas">
                                {displayText ? (
                                    <div className="animate-in">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <span className="badge bg-purple-glow text-white">TONE: {tone}</span>
                                            <button className="btn btn-sm copy-btn px-3 py-2" onClick={copyToClipboard}>
                                                <i className="fa-regular fa-copy me-2"></i>Copy Stream
                                            </button>
                                        </div>
                                        <div className="letter-header">
                                            <h4 className="mb-0">Synthesized Output</h4>
                                        </div>
                                        <div className="letter-content scrollbar-custom" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                            {displayText}
                                            {isGenerating === false && displayText.length < letter.length && <span className="typing-indicator"></span>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-100 d-flex flex-column justify-content-center align-items-center text-secondary opacity-50">
                                        <i className="fa-solid fa-microchip fa-4x mb-4"></i>
                                        <p className="fs-5">Standby for data input...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

