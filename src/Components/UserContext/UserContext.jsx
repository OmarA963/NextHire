import React, { useState, createContext, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const TheUserContext = createContext();

export function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [compImage, setCompImage] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [likedJobs, setLikedJobs] = useState([]);

  const toggleLikeJob = (job) => {
    setLikedJobs((prev) => {
      const alreadyLiked = prev.find((j) => j.jobId === job.jobId);
      if (alreadyLiked) {
        return prev.filter((j) => j.jobId !== job.jobId);
      } else {
        return [...prev, job];
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search?.value.trim() || "";
    setSearchQuery(searchInput);
    navigate("/alljobs");
  };

  const handlePillClick = (term) => {
    setSearchQuery(term);
    navigate("/alljobs");
  };

  const filterByCategory = (jobs, category) => {
    if (!category) return jobs;

    const lowerCategory = category.toLowerCase();

    const keywordsMap = {
      it: ["frontend", "front-end", "backend", "back-end", "network", "server", "fullstack", "devops", "software", "web", "it"],
      medicine: ["nurse", "doctor", "medical", "clinic", "surgeon", "dentist"],
      engineering: ["mechanical", "civil", "architecture", "engineer", "electrical", "construction"],
    };

    const keywords = keywordsMap[lowerCategory];
    if (!keywords) return jobs;

    return jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      return keywords.some(keyword => title.includes(keyword));
    });
  };

  function saveUserData() {
    let encodedToken = localStorage.getItem("token");
    let company_Id = localStorage.getItem("companyId");
    setCompanyId(company_Id);

    if (!encodedToken) return;

    try {
      let decodedToken = jwtDecode(encodedToken);
      setUserData(decodedToken);
      console.log(userData);
      console.log(companyId);
    } catch (error) {
      console.warn("Invalid Token (Mock Mode?):", error);
      // Fallback for Mock Mode
      if (encodedToken.startsWith("mock-jwt-token")) {
        const mockUser = JSON.parse(localStorage.getItem('user'));
        setUserData(mockUser || { name: 'Mock User', role: 'Employee' });
      }
    }
  }

  useEffect(() => {
    async function fetchJobs() {
      try {
        // MOCK BACKEND
        await new Promise(resolve => setTimeout(resolve, 500));

        // Default Mock Jobs
        const defaultJobs = [
          { jobId: '1', title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote', type: 'Full-time', salaryRange: '$80k - $120k', description: 'Experienced React developer needed for a high-growth startup.' },
          { jobId: '2', title: 'Backend Engineer', company: 'Data Systems', location: 'New York', type: 'Full-time', salaryRange: '$90k - $140k', description: 'Node.js and PostgreSQL expert for scalable backend architecture.' },
          { jobId: '3', title: 'UI/UX Designer', company: 'Creative Agency', location: 'London', type: 'Contract', salaryRange: '$60/hr', description: 'Figma pro needed for luxury brand redesign.' },
          { jobId: '4', title: 'AI Research Scientist', company: 'Future Mind', location: 'San Francisco', type: 'Full-time', salaryRange: '$160k - $220k', description: 'PhD in ML required for cutting-edge LLM research.' },
          { jobId: '5', title: 'Fullstack Developer', company: 'WebWorks', location: 'Remote', type: 'Full-time', salaryRange: '$100k - $150k', description: 'MERN stack expert to build end-to-end applications.' },
          { jobId: '6', title: 'DevOps Engineer', company: 'CloudScale', location: 'Austin', type: 'Full-time', salaryRange: '$120k - $170k', description: 'AWS, Docker, and Kubernetes specialist for infrastructure automation.' },
          { jobId: '7', title: 'Cyber Security Analyst', company: 'SafeGuard', location: 'Chicago', type: 'Full-time', salaryRange: '$110k - $160k', description: 'Protecting enterprise assets from emerging threats.' },
          { jobId: '8', title: 'Project Manager', company: 'BuildIt', location: 'Toronto', type: 'Full-time', salaryRange: '$90k - $130k', description: 'Agile leader for complex construction projects.' },
          { jobId: '9', title: 'Civil Engineer', company: 'Urban Design', location: 'Dubai', type: 'Full-time', salaryRange: '$85k - $140k', description: 'Designing the next generation of smart cities.' },
          { jobId: '10', title: 'Mechanical Engineer', company: 'AutoTech', location: 'Berlin', type: 'Full-time', salaryRange: '€70k - €100k', description: 'EV battery systems engineering.' },
          { jobId: '11', title: 'Pediatric Doctor', company: 'HealthLink', location: 'Boston', type: 'Full-time', salaryRange: '$200k - $250k', description: 'Caring for the next generation.' },
          { jobId: '12', title: 'Registered Nurse', company: 'City Hospital', location: 'Seattle', type: 'Full-time', salaryRange: '$80k - $110k', description: 'Dedicated healthcare professional for ICU.' },
          { jobId: '13', title: 'Data Scientist', company: 'InsightAI', location: 'Austin', type: 'Full-time', salaryRange: '$130k - $180k', description: 'Analyzing complex datasets for business intelligence.' },
          { jobId: '14', title: 'Mobile App Developer', company: 'Appify', location: 'Remote', type: 'Full-time', salaryRange: '$95k - $145k', description: 'Flutter or React Native expert for cross-platform apps.' },
          { jobId: '15', title: 'Digital Marketing Specialist', company: 'GrowthHub', location: 'Los Angeles', type: 'Full-time', salaryRange: '$70k - $110k', description: 'SEO/SEM and Social Media strategy lead.' },
          { jobId: '16', title: 'Blockchain Developer', company: 'CryptoCore', location: 'Remote', type: 'Full-time', salaryRange: '$140k - $200k', description: 'Smart contracts and decentralized finance.' },
          { jobId: '17', title: 'Architect', company: 'Skyline Partners', location: 'Miami', type: 'Full-time', salaryRange: '$90k - $150k', description: 'Designing sustainable high-rise projects.' },
          { jobId: '18', title: 'Network Engineer', company: 'GlobalNet', location: 'Paris', type: 'Full-time', salaryRange: '€65k - €95k', description: 'Managing high-performance network infrastructures.' }
        ];

        // Load posted jobs from localStorage
        const postedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');

        // Combine them
        const allJobs = [...defaultJobs, ...postedJobs];

        setJobs(allJobs);
      } catch (error) {
        setJobsError("Failed to fetch jobs");
        console.error(error);
      } finally {
        setIsJobsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("company-id");
    setUserData(null);
    setCompanyId(null);
  };

  return (
    <TheUserContext.Provider
      value={{
        saveUserData,
        setUserData,
        userData,
        companyId,
        setCompanyId,
        compImage,
        setCompImage,
        jobs,
        setJobs,
        isJobsLoading,
        jobsError,
        searchQuery,
        setSearchQuery,
        handleSearch,
        filterByCategory,
        selectedCategory,
        setSelectedCategory,
        likedJobs,
        toggleLikeJob,
        logout,
        handlePillClick
      }}
    >
      {children}
    </TheUserContext.Provider>
  );
}
