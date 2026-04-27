import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ─── Request Interceptor ─────────────────────────────────────
// Attach JWT token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────
// Handle 401 (expired token) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role, face_descriptor) => api.post('/auth/register', { name, email, password, role, face_descriptor }),
};

// ─── Jobs ────────────────────────────────────────────────────
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  save: (id) => api.post(`/jobs/${id}/save`),
  unsave: (id) => api.delete(`/jobs/${id}/save`),
  getSaved: () => api.get('/jobs/candidate/saved'),
  getMyJobs: () => api.get('/jobs/employer/my-jobs'),
};

// ─── Applications ────────────────────────────────────────────
export const applicationsAPI = {
  apply: (formData) => api.post('/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyApplications: () => api.get('/applications/my-applications'),
  getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  delete: (id) => api.delete(`/applications/${id}`),
};

// ─── CV ──────────────────────────────────────────────────────
export const cvAPI = {
  upload: (formData) => api.post('/cvs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  saveBuilder: (data) => api.post('/cvs/builder', data),
  update: (id, data) => api.put(`/cvs/${id}`, data),
  getMyCVs: () => api.get('/cvs/my-cvs'),
  delete: (id) => api.delete(`/cvs/${id}`),
};

// ─── AI Tools ────────────────────────────────────────────────
export const aiToolsAPI = {
  scoreCV: (data) => api.post('/ai-tools/score-cv', data),
  matchJob: (data) => api.post('/ai-tools/match-job', data),
  generateCoverLetter: (data) => api.post('/ai-tools/cover-letter', data),
  generateBranding: (input_text) => api.post('/ai-tools/branding', { input_text }),
  getScoreReports: () => api.get('/ai-tools/score-reports'),
  getMatchReports: () => api.get('/ai-tools/match-reports'),
  getCoverLetters: () => api.get('/ai-tools/cover-letters'),
  deleteScoreReport: (id) => api.delete(`/ai-tools/score-reports/${id}`),
  deleteMatchReport: (id) => api.delete(`/ai-tools/match-reports/${id}`),
  deleteCoverLetter: (id) => api.delete(`/ai-tools/cover-letters/${id}`),
};

// ─── Career ──────────────────────────────────────────────────
export const careerAPI = {
  generateRoadmap: (target_role) => api.post('/career/roadmap', { target_role }),
  getMyRoadmaps: () => api.get('/career/roadmaps'),
  updateRoadmap: (id, data) => api.put(`/career/roadmaps/${id}`, data),
  deleteRoadmap: (id) => api.delete(`/career/roadmaps/${id}`),
  generatePivot: (from_role, to_role) => api.post('/career/pivot', { from_role, to_role }),
  getMyPivots: () => api.get('/career/pivots'),
  deletePivot: (id) => api.delete(`/career/pivots/${id}`),
  getMarketPulse: () => api.get('/career/pulse'),
};

// ─── Interviews ──────────────────────────────────────────────
export const interviewsAPI = {
  start: (target_role, difficulty) => api.post('/interviews/start', { target_role, difficulty }),
  getMyInterviews: () => api.get('/interviews/my-interviews'),
  update: (id, data) => api.put(`/interviews/${id}`, data),
  delete: (id) => api.delete(`/interviews/${id}`),
};

// ─── Chat ────────────────────────────────────────────────────
export const chatAPI = {
  start: (page_context) => api.post('/chats/start', { page_context }),
  getMyChats: () => api.get('/chats/my-chats'),
  appendMessage: (id, role, content) => api.put(`/chats/${id}`, { role, content }),
  delete: (id) => api.delete(`/chats/${id}`),
};

// ─── Offers ──────────────────────────────────────────────────
export const offersAPI = {
  compare: (offers) => api.post('/offers/compare', { offers }),
  getMyOffers: () => api.get('/offers/my-offers'),
  delete: (id) => api.delete(`/offers/${id}`),
};

// ─── Skills ──────────────────────────────────────────────────
export const skillsAPI = {
  getAll: (skill_name) => api.get('/skills', { params: { skill_name } }),
};

// ─── Notifications ───────────────────────────────────────────
export const notificationsAPI = {
  getMyNotifications: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
};

// ─── Candidate & Employer Profiles ───────────────────────────
export const candidateAPI = {
  getProfile: () => api.get('/candidates/profile'),
  updateProfile: (data) => api.post('/candidates/profile', data),
  deleteProfile: () => api.delete('/candidates/profile'),
};

export const employerAPI = {
  getProfile: () => api.get('/employers/profile'),
  updateProfile: (data) => api.post('/employers/profile', data),
  deleteProfile: () => api.delete('/employers/profile'),
};

export default api;
