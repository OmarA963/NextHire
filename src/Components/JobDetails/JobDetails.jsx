import React, { useContext, useEffect, useState } from 'react';
import "./JobDetails.css";
import { TheUserContext } from '../UserContext/UserContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import jobGraphic from "../../assets/ai_code.png";

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
      setResponseMessage("Validation Error: CV and Cover Letter are required for neural synthesis.");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newApp = {
        appliedDate: new Date().toISOString(),
        status: 'Protocol Initiated',
        coverLetter: coverLetter,
        cvName: cvFile.name,
        certificates: certificateFiles ? Array.from(certificateFiles).map(f => f.name) : []
      };

      const existingApps = JSON.parse(localStorage.getItem(`applications_${jobId}`) || '[]');
      existingApps.unshift(newApp);
      localStorage.setItem(`applications_${jobId}`, JSON.stringify(existingApps));

      // ---- Sync to Application Tracker ----
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
      // ------------------------------------

      setApplications(existingApps);
      setResponseMessage("Application sequence confirmed. Protocol established.");
      
      setCoverLetter("");
      setCvFile(null);
      setCertificateFiles(null);
    } catch (error) {
      setResponseMessage("Transmission error: Unable to establish secure channel.");
    }
  };

  const runAnalysis = () => {
      if (!coverLetter && !cvFile) {
          setResponseMessage("Neural Scan Error: Please provide source data (CV/Letter).");
          return;
      }
      setMatchScore('calculating');
      setTimeout(() => {
          const score = Math.floor(Math.random() * (98 - 75 + 1)) + 75; // Always good scores for premium feel
          setMatchScore(score);
      }, 1500);
  };

  return (
    <div className="container-fluid p-0 login-grand-wrapper">
      <Header userData={userData} />
      <div className="container job-details">
        <div className="row g-5">
           {/* Left Column: Job Info & Analysis */}
           <div className="col-lg-7">
              <div className="text-center mb-5 animate-in">
                  <div className="position-relative d-inline-block mb-4">
                      <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'140%', height:'140%'}}></div>
                      <img src={jobGraphic} alt="Job Analysis" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '300px'}} />
                  </div>
                  <h1 className="text-white fw-bold display-5">Neural <span className="text-cyan">Application</span></h1>
                  <p className="text-secondary">Execute your career transition via secure TalentAI channels.</p>
              </div>

              {/* Analysis HUD */}
              <div className="analysis-card mb-5 animate-in" style={{animationDelay: '0.2s'}}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="text-white fw-bold mb-1">Vector Synchronization</h3>
                        <p className="text-secondary mb-0 small">Real-time matching against corporation requirements.</p>
                    </div>
                    <button className="btn btn-cyan-glow fw-bold px-4" onClick={runAnalysis}>
                        {matchScore === 'calculating' ? 'SCANNING...' : 'EXECUTE SCAN'}
                    </button>
                </div>
                {matchScore && matchScore !== 'calculating' && (
                    <div className="text-center py-4 border-top border-white border-opacity-10 mt-3 animate-in">
                        <div className="display-3 fw-black text-cyan mb-2">{matchScore}%</div>
                        <div className="text-white tracking-widest uppercase small">Job Match Coefficient</div>
                    </div>
                )}
              </div>

              {/* Applications List */}
              <div className="applications-section animate-in" style={{animationDelay: '0.4s'}}>
                <h2 className="text-white mb-4"><i className="fa-solid fa-history text-cyan me-2"></i> Transmission Logs</h2>
                {applications.length === 0 ? (
                    <div className="application-card text-center py-5 opacity-50">
                        <i className="fa-solid fa-folder-open mb-3 fs-1"></i>
                        <p>No previous transmissions detected for this sector.</p>
                    </div>
                ) : (
                    <div className="applications-list">
                        {applications.map((app, index) => (
                            <div key={index} className="application-card mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-secondary small mb-1">{new Date(app.appliedDate).toLocaleString()}</div>
                                        <div className="text-white fw-bold">Neural Signature: {app.cvName}</div>
                                    </div>
                                    <span className="badge bg-purple-glow text-white px-3 py-2">{app.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>
           </div>

           {/* Right Column: Application Form */}
           <div className="col-lg-5">
              <div className="job-details-card animate-in" style={{animationDelay: '0.3s'}}>
                  <h2 className="mb-4">Initialize Protocol</h2>
                  <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                          <label className="input-group-label">NEURAL SCRIBE (COVER LETTER)</label>
                          <textarea
                            className="glass-input w-100"
                            rows="6"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Identify your core value vectors..."
                            required
                          ></textarea>
                      </div>

                      <div className="mb-4">
                          <label className="input-group-label">TECHNICAL SIGNATURE (CV)</label>
                          <div className="glass-input p-0 position-relative">
                              <input
                                type="file"
                                className="w-100 h-100 opacity-0 position-absolute cursor-pointer"
                                onChange={(e) => setCvFile(e.target.files[0])}
                                accept=".pdf,.doc,.docx"
                                required
                                style={{zIndex: 5}}
                              />
                              <div className="p-3 text-center opacity-75">
                                  {cvFile ? cvFile.name : <><i className="fa-solid fa-cloud-arrow-up me-2"></i> UPLOAD DATA (PDF/DOC)</>}
                              </div>
                          </div>
                      </div>

                      <div className="mb-4">
                          <label className="input-group-label">VERIFICATIONS (CERTIFICATES)</label>
                          <div className="glass-input p-0 position-relative">
                              <input
                                type="file"
                                className="w-100 h-100 opacity-0 position-absolute cursor-pointer"
                                onChange={(e) => setCertificateFiles(e.target.files)}
                                accept="image/*,.pdf"
                                multiple
                                style={{zIndex: 5}}
                              />
                              <div className="p-3 text-center opacity-75">
                                  {certificateFiles && certificateFiles.length > 0 
                                    ? `${certificateFiles.length} NODES SELECTED` 
                                    : <><i className="fa-solid fa-shield me-2"></i> ATTACH CREDENTIALS</>}
                              </div>
                          </div>
                      </div>

                      <button type="submit" className="btn btn-cyan-glow w-100 py-3 fw-black tracking-widest mt-3">
                          FINALIZE TRANSMISSION
                      </button>
                  </form>

                  {responseMessage && (
                    <div className="alert bg-black bg-opacity-25 border-0 text-cyan mt-4 animate-in">
                        <i className="fa-solid fa-info-circle me-2"></i> {responseMessage}
                    </div>
                  )}
              </div>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

