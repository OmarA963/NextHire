import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./CoverLetterArchitect.css";
import coverLetterBanner from "../../assets/cover_letter_banner.png";

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

During my experience, I have developed a deep understanding of the industry requirements, and I am eager to apply this expertise to help [Company Name] achieve its goals. I am particularly drawn to this opportunity because of your commitment to excellence and innovation.

I look forward to the possibility of discussing how my technical proficiency and dedicated approach can contribute to your team. Thank you for your time and consideration.

Sincerely,

[Your Name]`,

                "Modern": `[Your Name]
[Your Email] | [Your Portfolio/LinkedIn]

Hey Team at [Company Name],

I've been following [Company Name]'s growth for a while, and when I saw the opening for [Job Title], I knew I had to reach out.

I don't just have the skills listed in your description—like ${extractProjectedSkills(resume)}—I have the passion to use them to solve real problems. I noticed you're looking for someone who can handle complex challenges, which is exactly where my strengths lie.

In my recent projects, I've focused on delivering high-quality results, and I’m ready to hit the ground running with your innovative team. I’d love to chat about the future of the industry at [Company Name] and how I can help.

Best,

[Your Name]`,

                "Creative": `✨ [Your Name] | Professional Visionary ✨

To the Visionaries at [Company Name],

Great companies are built on great ideas, and I believe my background in ${extractProjectedSkills(resume).split(',')[0]} can be the next big asset for your [Job Title] role.

I’m not a fan of generic templates. I looked at your job description for [Job Title] and saw a perfect match for my experience. What excites me most is your unique approach to the market—it’s exactly the kind of environment I thrive in.

My philosophy is simple: build things that matter. I’ve done that throughout my career, and I want to do it again for [Company Name]. Let's create something amazing together.

Cheers,

[Your Name]`
            };

            const finalLetter = templates[tone]
                .replace(/\[Job Title\]/g, extractJobTitle(jobDesc) || "the advertised role")
                .replace(/\[Company Name\]/g, extractCompanyName(jobDesc) || "your organization");

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
        }, 3);
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

    return (
        <div className="cover-letter-page">
            <Header />
            
            <div className="cover-letter-wrapper">
                {/* Header Section */}
                <div className="letter-header-card">
                    <img src={coverLetterBanner} alt="Cover Letter Builder" className="letter-banner-img" />
                    <div className="letter-intro-text">
                        <h1>Cover Letter Builder</h1>
                        <p>Generate a compelling, personalized cover letter that highlights your strengths and matches the job requirements perfectly.</p>
                    </div>
                </div>

                <div className="architect-main-card">
                  <div className="row g-5">
                      <div className="col-lg-5">
                          <h3 className="mb-4 fw-bold">Letter Details</h3>

                          <div className="mb-4">
                              <label className="architect-label-modern">Your Experience (Resume)</label>
                              <textarea
                                  className="modern-letter-textarea"
                                  rows="8"
                                  placeholder="Paste your resume content..."
                                  value={resume}
                                  onChange={(e) => setResume(e.target.value)}
                              ></textarea>
                          </div>

                          <div className="mb-4">
                              <label className="architect-label-modern">Target Role (Job Description)</label>
                              <textarea
                                  className="modern-letter-textarea"
                                  rows="8"
                                  placeholder="Paste the job description..."
                                  value={jobDesc}
                                  onChange={(e) => setJobDesc(e.target.value)}
                              ></textarea>
                          </div>

                          <label className="architect-label-modern mb-3">Tone Calibration</label>
                          <div className="tone-selector-modern">
                              {['Professional', 'Modern', 'Creative'].map(t => (
                                  <button
                                      key={t}
                                      className={`tone-btn-modern ${tone === t ? 'active' : ''}`}
                                      onClick={() => setTone(t)}
                                  >
                                      {t}
                                  </button>
                              ))}
                          </div>

                          <button
                              className="generate-letter-btn"
                              onClick={generateLetter}
                              disabled={isGenerating || !resume || !jobDesc}
                          >
                              {isGenerating ? (
                                  <><i className="fa-solid fa-circle-notch fa-spin me-2"></i> Generating...</>
                              ) : "Generate Letter"}
                          </button>
                      </div>

                      <div className="col-lg-7">
                          <div className="letter-paper-canvas">
                              {displayText ? (
                                  <div className="animate-in">
                                      <button className="copy-stream-btn" onClick={() => navigator.clipboard.writeText(displayText)}>
                                          <i className="fa-regular fa-copy me-2"></i> Copy Text
                                      </button>
                                      <div className="letter-body-content">
                                          {displayText}
                                          {isGenerating === false && displayText.length < letter.length && <span className="typing-indicator-modern"></span>}
                                      </div>
                                  </div>
                              ) : (
                                  <div className="canvas-placeholder">
                                      <i className="fa-solid fa-pen-nib fs-1 mb-3"></i>
                                      <p className="fs-5 fw-bold">Ready to Write</p>
                                      <p className="small">Fill in your details and click generate to see your custom cover letter here.</p>
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
