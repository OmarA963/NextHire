import React, { useContext, useEffect, useState } from "react";
import "./EmployeePage.css";
import { TheUserContext } from "../UserContext/UserContext"; // Correct path
import { NavLink } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";

// Import AI assets for liked jobs
import aiCode from "../../assets/ai_code.png";
import aiManagement from "../../assets/ai_management.png";
import aiDesign from "../../assets/ai_design.png";
import aiTech from "../../assets/ai_tech.png";

const imageMap = {
  frontend: aiCode,
  front: aiCode,
  backend: aiCode,
  developer: aiCode,
  project: aiManagement,
  manager: aiManagement,
  civil: aiDesign,
  designer: aiDesign,
  architecture: aiTech,
  network: aiTech,
  doctor: aiTech,
  ai: aiTech,
};

const normalizeString = (str) => str.toLowerCase().replace(/[\s-]/g, "");

const getImageForJob = (title) => {
  const normalizedTitle = normalizeString(title || "");
  for (const keyword in imageMap) {
    if (normalizedTitle.includes(normalizeString(keyword))) {
      return imageMap[keyword];
    }
  }
  return aiTech;
};

export default function EmployeePage() {
  const { userData, likedJobs, toggleLikeJob } = useContext(TheUserContext);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchEmployeeImage = async () => {
      const employeeId = localStorage.getItem("employee-id");
      if (!employeeId) return;

      try {
        const response = await axios.get(
          `https://localhost:7209/api/Employee/${employeeId}/GetEmployeeImage`,
          { responseType: 'blob' }
        );
        const imgBlobUrl = URL.createObjectURL(response.data);
        setImageUrl(imgBlobUrl);
      } catch (error) {
        console.error("Error fetching employee image:", error);
      }
    };

    fetchEmployeeImage();
  }, []);

  return (
    <div className="container-fluid p-0 login-grand-wrapper">
      <Header userData={userData} />

      <div className="container employee-page pb-5">
        {/* Profile Section */}
        <div className="profile-glass-card text-center animate-in">
          <div className="employee-image-container">
            <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'130%', height:'130%'}}></div>
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="employee-image position-relative z-2" />
            ) : (
              <div className="employee-image position-relative z-2 bg-dark d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-user-astronaut fs-1 text-cyan"></i>
              </div>
            )}
          </div>
          <h2 className="employee-name">{userData?.name || "Neural Explorer"}</h2>
          <p className="employee-position">{userData?.position || "Sync Pending"}</p>
          <p className="employee-email"><i className="fa-solid fa-envelope-open-text me-2 text-cyan"></i> {userData?.email}</p>
        </div>

        {/* Liked Jobs Section */}
        <div className="liked-jobs-section animate-in" style={{animationDelay: '0.2s'}}>
            <h2 className="section-title"><i className="fa-solid fa-heart-pulse"></i> Neural Saved Sectors</h2>
            {likedJobs.length === 0 ? (
                <div className="profile-glass-card text-center py-5 opacity-50">
                    <i className="fa-solid fa-ghost mb-3 fs-1"></i>
                    <p>No job vectors currently synchronized in your favorites.</p>
                </div>
            ) : (
                <div className="trends">
                {likedJobs.map((job, index) => (
                    <div
                    key={job.jobId || index}
                    className="trend job-glass-card d-flex flex-column align-items-start justify-content-center p-4 rounded-4"
                    >
                    <div className="image-wrapper w-100 position-relative mb-3 rounded-3 overflow-hidden">
                        <div className="image-glow"></div>
                        <img
                        className="w-100 position-relative z-2"
                        src={getImageForJob(job.title)}
                        alt="Job Module"
                        />
                    </div>
                    
                    <div className="w-100 px-2">
                        <span className="badge location-badge mb-3">{job.location}</span>
                        <h2 className="fs-5 text-white fw-bold m-0">{job.title}</h2>
                        <p className="cyan-text fw-medium fs-6 mt-2">{job.salaryRange}</p>
                        
                        <div className="cyan-divider mb-3"></div>
                        
                        <div className="inf w-100 d-flex justify-content-between align-items-center mt-3">
                            <NavLink
                            to={"/jobdetails"}
                            onClick={() => localStorage.setItem("selectedJobId", job.jobId)}
                            className="flex-grow-1 me-2"
                            >
                                <button className="btn job-btn w-100 px-3 py-2">Initialize Apply</button>
                            </NavLink>

                            <button
                            className="heart-btn"
                            onClick={() => toggleLikeJob(job)}
                            >
                                <i className="fa-solid fa-heart text-danger glow-danger"></i>
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

