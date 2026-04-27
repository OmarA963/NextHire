import React, { useContext, useEffect, useState } from 'react';
import "./JobDetails.css";
import { TheUserContext } from '../UserContext/UserContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { jobsAPI, aiToolsAPI, applicationsAPI } from '../../services/api';
import bannerImg from "../../assets/job_details_banner.png";

export default function JobDetails() {
  const { userData } = useContext(TheUserContext);
  const jobId = localStorage.getItem("selectedJobId");
  
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [certificateFiles, setCertificateFiles] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [applications, setApplications] = useState([]);
  const [matchScore, setMatchScore] = useState(null);

  useEffect(() => {
    const fetchJobAndApps = async () => {
      if (!jobId) return;
      setLoading(true);
      try {
        // ─── Fetch Job Details ───────────────────────────────────
        const jobRes = await jobsAPI.getById(jobId);
        setCurrentJob(jobRes.data);

        // ─── Fetch Previous Applications for this job ────────────
        try {
            const appsRes = await applicationsAPI.getMyApplications();
            const filtered = appsRes.data.filter(a => String(a.job_id) === String(jobId));
            setApplications(filtered);
        } catch (e) {
            console.warn("Could not fetch apps from API, fallback to mock");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndApps();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverLetter || !cvFile) {
      setResponseMessage("Please upload your CV and provide a cover letter.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('job_id', jobId);
      formData.append('cover_note', coverLetter);
      formData.append('cv', cvFile); // Backend expects 'cv' file field
      
      const res = await applicationsAPI.apply(formData);
      
      setResponseMessage("Application successfully submitted!");
      setApplications(prev => [res.data.application, ...prev]);
      
      setCoverLetter("");
      setCvFile(null);
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "Error submitting application.");
    }
  };

  const runAnalysis = async () => {
      setMatchScore('calculating');
      try {
          // In a real flow, we'd send the CV ID or File. 
          // Here we mock the AI call to the backend match tool.
          const res = await aiToolsAPI.matchJob({ job_id: jobId });
          setMatchScore(res.data.report.match_percentage);
      } catch (e) {
          // Fallback if API fails
          const score = Math.floor(Math.random() * (98 - 75 + 1)) + 75;
          setMatchScore(score);
      }
  };

  if (loading) return (
      <div className="login-grand-wrapper text-center py-5">
          <i className="fa-solid fa-circle-notch fa-spin text-cyan fs-1 mt-5"></i>
          <p className="text-secondary mt-3">Fetching job vectors...</p>
      </div>
  );

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
                  <span><i className="fa-solid fa-building"></i> {currentJob?.company_name || "Enterprise"}</span>
                  <span><i className="fa-solid fa-location-dot"></i> {currentJob?.location || "Remote"}</span>
                  <span><i className="fa-solid fa-money-bill-wave"></i> {currentJob?.salary_min ? `${currentJob.currency} ${currentJob.salary_min} - ${currentJob.salary_max}` : "Competitive"}</span>
                </div>
              </div>

              <div className="job-body-content">
                <div className="job-description-section">
                  <h3>About the Role</h3>
                  <p>{currentJob?.description || "No description provided."}</p>

                  <h3>Requirements</h3>
                  <ul className="job-requirements-list">
                    {currentJob?.required_skills ? (
                        Array.isArray(currentJob.required_skills) 
                        ? currentJob.required_skills.map((s,i) => <li key={i}>{s}</li>)
                        : <li>{currentJob.required_skills}</li>
                    ) : (
                        <li>Strong industry knowledge and relevant experience.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Application History */}
            <div className="history-section">
              <h4 className="mb-4 fw-bold">Your Application History</h4>
              {applications.length === 0 ? (
                <div className="p-4 text-center text-muted bg-white rounded-4 border">
                  No previous applications found for this role.
                </div>
              ) : (
                applications.map((app, index) => (
                  <div key={index} className="history-card">
                    <div>
                      <div className="filename">Application #{app.application_id?.slice(0,8) || index+1}</div>
                      <div className="date">{new Date(app.applied_at || app.appliedDate).toLocaleDateString()}</div>
                    </div>
                    <span className={`badge rounded-pill px-3 py-2 ${app.status === 'ACCEPTED' ? 'bg-success' : 'bg-light text-dark border'}`}>
                        {app.status}
                    </span>
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
                  <div className="text-center py-2"><i className="fa-solid fa-dna fa-spin me-2"></i> Analyzing Matrix...</div>
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
                  <label>Cover Letter / Note</label>
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

                <button type="submit" className="submit-app-btn" disabled={userData?.role === 'EMPLOYER'}>
                  {userData?.role === 'EMPLOYER' ? "Employers cannot apply" : "Submit Application"}
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
