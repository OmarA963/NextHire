import React, { useContext, useEffect, useState } from 'react';
import "./JobDetails.css";
import { TheUserContext } from '../UserContext/UserContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import bannerImg from "../../assets/job_details_banner.png";

export default function JobDetails() {
  const { userData, jobs } = useContext(TheUserContext);
  const jobId = localStorage.getItem("selectedJobId");
  const currentJob = jobs.find(j => j.jobId === jobId || String(j.id) === String(jobId));

  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [certificateFiles, setCertificateFiles] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [applications, setApplications] = useState([]);
  const [matchScore, setMatchScore] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!jobId) return;
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockApps = JSON.parse(localStorage.getItem(`applications_${jobId}`) || '[]');
        setApplications(mockApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverLetter || !cvFile) {
      setResponseMessage("Please upload your CV and provide a cover letter.");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newApp = {
        appliedDate: new Date().toISOString(),
        status: 'Submitted',
        coverLetter: coverLetter,
        cvName: cvFile.name,
        certificates: certificateFiles ? Array.from(certificateFiles).map(f => f.name) : []
      };

      const existingApps = JSON.parse(localStorage.getItem(`applications_${jobId}`) || '[]');
      existingApps.unshift(newApp);
      localStorage.setItem(`applications_${jobId}`, JSON.stringify(existingApps));

      const trackerEntry = {
        title: currentJob?.title || currentJob?.jobTitle || "Applied Position",
        location: currentJob?.location || currentJob?.jobLocation || "Remote",
        status: "Pending",
        appliedDate: new Date().toISOString(),
        jobId,
      };
      const trackerList = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
      const alreadyApplied = trackerList.some(a => a.jobId === jobId);
      if (!alreadyApplied) {
        trackerList.unshift(trackerEntry);
        localStorage.setItem("appliedJobs", JSON.stringify(trackerList));
      }

      setApplications(existingApps);
      setResponseMessage("Application successfully submitted! We will contact you soon.");
      
      setCoverLetter("");
      setCvFile(null);
      setCertificateFiles(null);
    } catch (error) {
      setResponseMessage("Error submitting application. Please try again.");
    }
  };

  const runAnalysis = () => {
      if (!coverLetter && !cvFile) {
          setResponseMessage("Please provide a CV or cover letter to run analysis.");
          return;
      }
      setMatchScore('calculating');
      setTimeout(() => {
          const score = Math.floor(Math.random() * (98 - 75 + 1)) + 75;
          setMatchScore(score);
      }, 1500);
  };

  return (
    <>
      <Header userData={userData} />
      
      <div className="job-details-wrapper">
        <div className="row g-4">
          
          {/* Left Column: Job Content */}
          <div className="col-lg-8">
            <div className="job-main-card">
              <img src={bannerImg} alt="Job Banner" className="job-banner-img" />
              
              <div className="job-header-content">
                <h1>{currentJob?.title || "Position Details"}</h1>
                <div className="job-sub-header">
                  <span><i className="fa-solid fa-building"></i> {currentJob?.company || "Innova Solutions"}</span>
                  <span><i className="fa-solid fa-location-dot"></i> {currentJob?.location || "Remote"}</span>
                  <span><i className="fa-solid fa-money-bill-wave"></i> {currentJob?.salaryRange || "$130k - $150k / year"}</span>
                </div>
              </div>

              <div className="job-body-content">
                <div className="job-description-section">
                  <h3>About the Role</h3>
                  <p>
                    We are looking for a dedicated professional to join our growing team. In this role, you will be responsible for 
                    driving innovation and contributing to high-impact projects. You'll work alongside industry experts in a 
                    collaborative environment that values creativity and technical excellence.
                  </p>

                  <h3>Key Requirements</h3>
                  <ul className="job-requirements-list">
                    <li>3+ years of experience in the relevant field.</li>
                    <li>Strong understanding of modern industry standards and best practices.</li>
                    <li>Excellent problem-solving skills and attention to detail.</li>
                    <li>Ability to work effectively in a team and communicate ideas clearly.</li>
                    <li>Proven track record of delivering high-quality results.</li>
                  </ul>

                  <h3>Benefits</h3>
                  <ul className="job-requirements-list">
                    <li>Competitive salary and performance bonuses.</li>
                    <li>Flexible working hours and remote options.</li>
                    <li>Comprehensive health and wellness programs.</li>
                    <li>Professional development and continuous learning opportunities.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Application History */}
            <div className="history-section">
              <h4 className="mb-4 fw-bold">Recent Applications</h4>
              {applications.length === 0 ? (
                <div className="p-4 text-center text-muted bg-white rounded-4 border">
                  No previous applications found for this role.
                </div>
              ) : (
                applications.map((app, index) => (
                  <div key={index} className="history-card">
                    <div>
                      <div className="filename">{app.cvName}</div>
                      <div className="date">{new Date(app.appliedDate).toLocaleDateString()}</div>
                    </div>
                    <span className="badge rounded-pill bg-light text-dark border px-3 py-2">{app.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Sticky Sidebar Form */}
          <div className="col-lg-4">
            <div className="application-panel">
              <h2>Apply Now</h2>
              
              <div className="analysis-mini-card">
                <h4>AI Match Score</h4>
                {matchScore === 'calculating' ? (
                  <div className="text-center py-2">Scanning Profile...</div>
                ) : matchScore ? (
                  <div className="score-display">{matchScore}%</div>
                ) : (
                  <button className="btn btn-outline-primary btn-sm w-100" onClick={runAnalysis}>
                    Check Match Score
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group-custom">
                  <label>Cover Letter</label>
                  <textarea 
                    className="modern-textarea" 
                    rows="5" 
                    placeholder="Tell us why you are a great fit..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="form-group-custom">
                  <label>Your Resume (CV)</label>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      className="position-absolute w-100 h-100 opacity-0 cursor-pointer" 
                      onChange={(e) => setCvFile(e.target.files[0])}
                      required
                    />
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <p>{cvFile ? cvFile.name : "Click to upload PDF/DOC"}</p>
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Certifications (Optional)</label>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      className="position-absolute w-100 h-100 opacity-0 cursor-pointer" 
                      multiple
                      onChange={(e) => setCertificateFiles(e.target.files)}
                    />
                    <i className="fa-solid fa-shield-check"></i>
                    <p>{certificateFiles ? `${certificateFiles.length} files selected` : "Upload additional proof"}</p>
                  </div>
                </div>

                <button type="submit" className="submit-app-btn">
                  Submit Application
                </button>
              </form>

              {responseMessage && (
                <div className="mt-4 p-3 bg-white rounded-3 border small text-center text-primary fw-bold">
                  {responseMessage}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
