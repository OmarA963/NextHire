import React, { useState, createContext, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { jobsAPI } from '../../services/api'

export const TheUserContext = createContext();

// ─── Mock Jobs Fallback (when backend is offline) ─────────────
const MOCK_JOBS = [
  { jobId: '1', job_id: '1', title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote', type: 'Full-time', salaryRange: '$80k - $120k', description: 'Experienced React developer needed for a high-growth startup.' },
  { jobId: '2', job_id: '2', title: 'Backend Engineer', company: 'Data Systems', location: 'New York', type: 'Full-time', salaryRange: '$90k - $140k', description: 'Node.js and PostgreSQL expert for scalable backend architecture.' },
  { jobId: '3', job_id: '3', title: 'UI/UX Designer', company: 'Creative Agency', location: 'London', type: 'Contract', salaryRange: '$60/hr', description: 'Figma pro needed for luxury brand redesign.' },
  { jobId: '4', job_id: '4', title: 'AI Research Scientist', company: 'Future Mind', location: 'San Francisco', type: 'Full-time', salaryRange: '$160k - $220k', description: 'PhD in ML required for cutting-edge LLM research.' },
  { jobId: '5', job_id: '5', title: 'Fullstack Developer', company: 'WebWorks', location: 'Remote', type: 'Full-time', salaryRange: '$100k - $150k', description: 'MERN stack expert to build end-to-end applications.' },
  { jobId: '6', job_id: '6', title: 'DevOps Engineer', company: 'CloudScale', location: 'Austin', type: 'Full-time', salaryRange: '$120k - $170k', description: 'AWS, Docker, and Kubernetes specialist for infrastructure automation.' },
  { jobId: '7', job_id: '7', title: 'Cyber Security Analyst', company: 'SafeGuard', location: 'Chicago', type: 'Full-time', salaryRange: '$110k - $160k', description: 'Protecting enterprise assets from emerging threats.' },
  { jobId: '8', job_id: '8', title: 'Project Manager', company: 'BuildIt', location: 'Toronto', type: 'Full-time', salaryRange: '$90k - $130k', description: 'Agile leader for complex construction projects.' },
  { jobId: '9', job_id: '9', title: 'Civil Engineer', company: 'Urban Design', location: 'Dubai', type: 'Full-time', salaryRange: '$85k - $140k', description: 'Designing the next generation of smart cities.' },
  { jobId: '10', job_id: '10', title: 'Data Scientist', company: 'InsightAI', location: 'Austin', type: 'Full-time', salaryRange: '$130k - $180k', description: 'Analyzing complex datasets for business intelligence.' },
  { jobId: '11', job_id: '11', title: 'Mobile App Developer', company: 'Appify', location: 'Remote', type: 'Full-time', salaryRange: '$95k - $145k', description: 'Flutter or React Native expert for cross-platform apps.' },
  { jobId: '12', job_id: '12', title: 'Blockchain Developer', company: 'CryptoCore', location: 'Remote', type: 'Full-time', salaryRange: '$140k - $200k', description: 'Smart contracts and decentralized finance.' },
];

export function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
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
      const id = job.jobId || job.job_id;
      const alreadyLiked = prev.find((j) => (j.jobId || j.job_id) === id);
      if (alreadyLiked) {
        return prev.filter((j) => (j.jobId || j.job_id) !== id);
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
    const encodedToken = localStorage.getItem("token");
    const company_Id = localStorage.getItem("companyId");
    setCompanyId(company_Id);
    setToken(encodedToken);

    if (!encodedToken) return;

    try {
      const decodedToken = jwtDecode(encodedToken);
      // Ensure we have a name, even if it's not in the token yet (for older tokens)
      setUserData({
        ...decodedToken,
        name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User'
      });
    } catch (error) {
      console.warn("Invalid Token:", error);
      // Fallback for Mock Mode
      if (encodedToken?.startsWith("mock-jwt-token")) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUserData(storedUser || { name: 'Mock User', role: 'CANDIDATE' });
      }
    }
  }

  // ─── Fetch Jobs from REAL API (with mock fallback) ────────────
  useEffect(() => {
    async function fetchJobs() {
      setIsJobsLoading(true);
      try {
        const response = await jobsAPI.getAll();
        const apiJobs = response.data.map(j => ({
          ...j,
          jobId: j.job_id,          
          title: j.title,
          company: j.company_name || 'Enterprise', 
          location: j.location,
          salaryRange: j.salary_min && j.salary_max
            ? `${j.currency || ''} ${j.salary_min}–${j.salary_max}`.trim()
            : 'Competitive',
          type: j.job_type?.replace('_', ' ') || 'Full-time',
        }));
        // Merge with local posted jobs too
        const localJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        setJobs([...apiJobs, ...localJobs]);
      } catch (error) {
        console.warn('⚠️ Backend unavailable, using mock job data. Start the backend to load live jobs.');
        // Graceful fallback to mock + local stored jobs
        const localJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        setJobs([...MOCK_JOBS, ...localJobs]);
        setJobsError('');
      } finally {
        setIsJobsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // ─── Restore session on mount ─────────────────────────────────
  useEffect(() => {
    saveUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("company-id");
    setUserData(null);
    setToken(null);
    setCompanyId(null);
    navigate('/login');
  };

  return (
    <TheUserContext.Provider
      value={{
        saveUserData,
        setUserData,
        userData,
        token,
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
