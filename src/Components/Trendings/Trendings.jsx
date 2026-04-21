import React, { useContext } from "react";
import "./Trendings.css";

import aiCode from "../../assets/ai_code.png";
import aiManagement from "../../assets/ai_management.png";
import aiDesign from "../../assets/ai_design.png";
import aiTech from "../../assets/ai_tech.png";

import { TheUserContext } from "../UserContext/UserContext";
import { NavLink } from "react-router-dom";

const imageMap = {
  frontend: aiCode,
  front: aiCode,
  backend: aiCode,
  developer: aiCode,
  react: aiCode,
  node: aiCode,
  project: aiManagement,
  manager: aiManagement,
  product: aiManagement,
  civil: aiDesign,
  designer: aiDesign,
  architecture: aiDesign,
  architect: aiDesign,
  figma: aiDesign,
  ui: aiDesign,
  ux: aiDesign,
  network: aiTech,
  doctor: aiTech,
  nurse: aiTech,
  mechanical: aiTech,
  server: aiCode,
  ml: aiCode,
  ai: aiTech,
  research: aiTech,
};
const normalizeString = (str) => str.toLowerCase().replace(/[\s-]/g, "");

export default function Trendings({ number = 12, search = "" }) {

  const {
    jobs,
    isJobsLoading,
    jobsError,
    filterByCategory,
    selectedCategory,
    likedJobs,
    toggleLikeJob, 
  } = useContext(TheUserContext);

  const filteredBySearch = jobs.filter((job) => {
    const searchText = search.toLowerCase();
    return (
      (job.title?.toLowerCase() || "").includes(searchText) ||
      (job.description?.toLowerCase() || "").includes(searchText)
    );
  });

  const finalFilteredJobs = filterByCategory(filteredBySearch, selectedCategory);

  const getImageForJob = (title, description) => {
    const normalizedText = normalizeString((title || "") + " " + (description || ""));
    for (const keyword in imageMap) {
      if (normalizedText.includes(normalizeString(keyword))) {
        return imageMap[keyword];
      }
    }
    return aiTech; // Fallback to generic tech image
  };

  localStorage.setItem("numberJobs", jobs.length);

  return (
    <div className="trends w-100" style={{ margin: "20px 0" }}>
      {isJobsLoading && <p className="text-cyan">Booting Job Data Matrix...</p>}
      {jobsError && <p className="text-danger">{jobsError}</p>}
      {finalFilteredJobs.slice(0, number).map((job, index) => (
        <div
          key={job.jobId || index}
          className="trend job-glass-card d-flex flex-column align-items-start justify-content-center p-4 rounded-4"
        >
          <div className="image-wrapper w-100 position-relative mb-3 rounded-3 overflow-hidden">
             <div className="image-glow"></div>
            <img className="w-100 position-relative z-2" src={getImageForJob(job.title, job.description)} alt="Job Sector" />
          </div>
          
          <div className="w-100 px-2">
              <span className="badge location-badge mb-3">{job.location}</span>
              <h2 className="fs-4 text-white fw-bold m-0">{job.title}</h2>
              <p className="cyan-text fw-medium fs-5 mt-2">{job.salaryRange}</p>
              
              <div className="cyan-divider mb-3"></div>
              
              <p className="fs-6 card-desc" title={job.description}>
                {job.description}
              </p>
              
              <div className="inf w-100 d-flex justify-content-between align-items-center mt-4">
                <NavLink
                  to={"/jobdetails"}
                  onClick={() => localStorage.setItem("selectedJobId", job.jobId)}
                  className="text-decoration-none"
                >
                  <button className="btn job-btn px-4 py-2">Initialize Apply</button>
                </NavLink>

                <button
                  className="heart-btn"
                  onClick={() => toggleLikeJob(job)}
                  title="Save Job"
                >
                  <i className={`fa-solid fa-heart ${likedJobs.find(j => j.jobId === job.jobId) ? "text-danger glow-danger" : "text-secondary"}`}></i>
                </button>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
}
