import { Route, Routes } from 'react-router-dom'
import { useContext, useState } from 'react'
import './App.css'
import Home from './Components/Home/Home'
import Footer from './Components/Footer/Footer'
import About from "./Components/About/About"
import AllJobs from './Components/AllJobs/AllJobs'
import Login from './Components/Login/Login'
import RegisterState from './Components/RegisterState/RegisterState'
import RegisterEmployee from "./Components/RegisterEmployee/RegisterEmployee"
import RegisterCompany from "./Components/RegisterCompany/RegisterCompany"
import InternetSpeedChecker from './Components/InternetSpeed/InternetSpeed'
import TalentAIPulse from './Components/TalentAIPulse/TalentAIPulse'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import NotFound from './Components/NotFound/NotFound'
import CompanyPage from './Components/CompanyPage/CompanyPage'
import { TheUserContext } from './Components/UserContext/UserContext'
import CVBuilder from './Components/CVBuilder/CVBuilder'
import EmployeePage from './Components/EmployeePage/EmployeePage'
import JobDetails from './Components/JobDetails/JobDetails'
import MockInterview from './Components/MockInterview/MockInterview'
import CareerRoadmap from './Components/CareerRoadmap/CareerRoadmap'
import PersonalBrandingAssistant from './Components/PersonalBrandingAssistant/PersonalBrandingAssistant'
import ResumeMatcher from './Components/ResumeMatcher/ResumeMatcher'
import CoverLetterArchitect from './Components/CoverLetterArchitect/CoverLetterArchitect'
import PivotPredictor from './Components/PivotPredictor/PivotPredictor'
import OfferWeightCalculator from './Components/OfferWeightCalculator/OfferWeightCalculator'
import AIChatWidget from './Components/AIChatWidget/AIChatWidget'
import LoadingScreen from './Components/LoadingScreen/LoadingScreen'
import ParticleCanvas from './Components/ParticleCanvas/ParticleCanvas'
import SavedJobs from './Components/SavedJobs/SavedJobs'
import ApplicationTracker from './Components/ApplicationTracker/ApplicationTracker'

function App() {
  const { userData } = useContext(TheUserContext);
  const [loading, setLoading] = useState(!sessionStorage.getItem("booted"));

  const handleLoadComplete = () => {
    sessionStorage.setItem("booted", "true");
    setLoading(false);
  };

  if (loading) return <LoadingScreen onComplete={handleLoadComplete} />;

  return (
    <div className="app-container">
      {/* <ParticleCanvas /> Disabled for clean theme */}
      <AIChatWidget />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/alljobs' element={<ProtectedRoute userData={userData}><AllJobs /></ProtectedRoute>} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Login />} />
        <Route path='/registeremployee' element={<RegisterEmployee />} />
        <Route path='/registeremployer' element={< RegisterCompany />} />
        <Route path='/companypage' element={< CompanyPage />} />
        <Route path='/employeepage' element={< EmployeePage />} />
        <Route path='/internetspeed' element={<ProtectedRoute userData={userData}><InternetSpeedChecker /></ProtectedRoute>} />
        <Route path='/pulse' element={<TalentAIPulse />} />
        <Route path='/cvbuilder' element={<ProtectedRoute userData={userData}><CVBuilder /></ProtectedRoute>} />
        <Route path='/mock-interview' element={<ProtectedRoute userData={userData}><MockInterview /></ProtectedRoute>} />
        <Route path='/career-roadmap' element={<ProtectedRoute userData={userData}><CareerRoadmap /></ProtectedRoute>} />
        <Route path='/branding-assistant' element={<ProtectedRoute userData={userData}><PersonalBrandingAssistant /></ProtectedRoute>} />
        <Route path='/resume-matcher' element={<ProtectedRoute userData={userData}><ResumeMatcher /></ProtectedRoute>} />
        <Route path='/cover-letter' element={<ProtectedRoute userData={userData}><CoverLetterArchitect /></ProtectedRoute>} />
        <Route path='/pivot-predictor' element={<ProtectedRoute userData={userData}><PivotPredictor /></ProtectedRoute>} />
        <Route path='/offer-calculator' element={<ProtectedRoute userData={userData}><OfferWeightCalculator /></ProtectedRoute>} />
        <Route path='/saved-jobs' element={<ProtectedRoute userData={userData}><SavedJobs /></ProtectedRoute>} />
        <Route path='/my-applications' element={<ProtectedRoute userData={userData}><ApplicationTracker /></ProtectedRoute>} />
        <Route path='/*' element={<NotFound />} />
        <Route path='/jobdetails' element={<ProtectedRoute userData={userData}><JobDetails /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
