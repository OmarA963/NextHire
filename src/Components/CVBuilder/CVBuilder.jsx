import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./CVBuilder.css"
import cvBanner from "../../assets/cv_banner.png";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  section: { marginBottom: 10 },
  heading: { fontSize: 18, marginBottom: 5, fontWeight: "bold" },
  subHeading: { fontSize: 14, marginTop: 10, marginBottom: 3, fontWeight: "bold" },
  image: { width: 60, height: 60, borderRadius: 30, marginBottom: 10 },
  certificateImage: { width: "48%", height: 200, marginBottom: 10, objectFit: "contain" },
  certificateContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});

const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {data.photo && <Image src={data.photo} style={styles.image} />}
        <Text style={styles.heading}>{data.name}</Text>
        <Text>{data.email} | {data.phone}</Text>
        <Text>{data.linkedin} {data.github ? `| ${data.github}` : ""}</Text>
      </View>
      <View style={styles.section}><Text style={styles.subHeading}>Summary</Text><Text>{data.summary}</Text></View>
      <View style={styles.section}><Text style={styles.subHeading}>Experience</Text><Text>{data.experience}</Text></View>
      <View style={styles.section}><Text style={styles.subHeading}>Projects</Text><Text>{data.projects}</Text></View>
      <View style={styles.section}><Text style={styles.subHeading}>Education</Text><Text>{data.education}</Text></View>
      <View style={styles.section}><Text style={styles.subHeading}>Skills</Text><Text>{data.skills}</Text></View>
    </Page>
  </Document>
);

const CVBuilder = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", linkedin: "", github: "",
    summary: "", experience: "", projects: "", education: "",
    skills: "", certifications: "", languages: "", achievements: "",
    portfolio: "", photo: "", category: "IT", certificateImages: [], 
  });

  const [submitted, setSubmitted] = useState(false);
  const [apiKeywords, setApiKeywords] = useState([]);

  useEffect(() => {
    axios.get("https://gist.githubusercontent.com/mohamedshal/fb06b06a9d30c2c75ca1729f1002db0f/raw")
      .then((res) => { if (res.data.keywords) setApiKeywords(res.data.keywords.map(kw => kw.toLowerCase())); })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setFormData((prev) => ({ ...prev, photo: reader.result }));
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 800, behavior: 'smooth' });
  };

  const calculateScore = () => {
    let score = 0;
    const required = ['name', 'email', 'phone', 'summary', 'experience', 'skills'];
    required.forEach(f => { if (formData[f]?.trim()) score += 15; });
    if (formData.photo) score += 10;
    return Math.min(score, 100);
  };

  const inputFields = [
    { id: "name", label: "Full Name", type: "text" },
    { id: "email", label: "Email Address", type: "email" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "linkedin", label: "LinkedIn URL", type: "text" },
    { id: "github", label: "GitHub Portfolio", type: "text" },
    { id: "summary", label: "Professional Summary", type: "textarea" },
    { id: "experience", label: "Work Experience", type: "textarea" },
    { id: "projects", label: "Key Projects", type: "textarea" },
    { id: "education", label: "Education History", type: "textarea" },
    { id: "skills", label: "Technical Skills", type: "textarea" }
  ];

  return (
    <div className="cv-builder-page">
      <Header />
      
      <div className="cv-builder-wrapper">
        {/* Header Section */}
        <div className="cv-header-card">
          <img src={cvBanner} alt="CV Builder" className="cv-banner-img" />
          <div className="cv-intro-text">
            <h1>Professional Resume Builder</h1>
            <p>Craft a high-impact resume that stands out to recruiters and highlights your unique professional journey.</p>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="cv-side-card">
              <h3>Resume Strength</h3>
              <div className="cv-strength-meter">
                <div className="strength-fill" style={{width: `${calculateScore()}%`}}></div>
              </div>
              <div className="fw-bold text-center mb-3">{calculateScore()}% Complete</div>
              
              <div className="suggestions-list mt-4">
                <div className="suggestion-item">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>Ensure your summary highlights your key achievements.</span>
                </div>
                <div className="suggestion-item">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>Add your LinkedIn profile for professional credibility.</span>
                </div>
              </div>
            </div>

            <div className="cv-side-card">
              <h4>Profile Photo</h4>
              <div className="portrait-upload-zone" onClick={() => document.getElementById('photo-input').click()}>
                {formData.photo ? (
                  <img src={formData.photo} alt="Portrait" className="portrait-preview-img" />
                ) : (
                  <div className="text-muted text-center">
                    <i className="fa-solid fa-camera fs-2 mb-2"></i><br/>Upload
                  </div>
                )}
                <input id="photo-input" type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </div>
              <p className="small text-muted text-center">A professional photo increases your chances of being noticed.</p>
            </div>
          </div>

          {/* Main Form */}
          <div className="col-lg-8">
            <div className="cv-main-form-card">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="field-label-modern">Industry Focus</label>
                  <div className="discipline-selector">
                    <div className={`discipline-option ${formData.category === "IT" ? "active" : ""}`} onClick={() => setFormData({...formData, category: "IT"})}>Software & IT</div>
                    <div className={`discipline-option ${formData.category === "Non-IT" ? "active" : ""}`} onClick={() => setFormData({...formData, category: "Non-IT"})}>Other Industries</div>
                  </div>
                </div>

                <div className="row">
                  {inputFields.map((f) => (
                    <div key={f.id} className={f.type === "textarea" ? "col-12 mb-4" : "col-md-6 mb-4"}>
                      <label className="field-label-modern">{f.label}</label>
                      {f.type === "textarea" ? (
                        <textarea 
                          className="modern-cv-input" 
                          rows="4" 
                          name={f.id} 
                          value={formData[f.id]} 
                          onChange={handleChange} 
                          placeholder={`Enter your ${f.label.toLowerCase()}...`}
                          required
                        />
                      ) : (
                        <input 
                          type={f.type} 
                          className="modern-cv-input" 
                          name={f.id} 
                          value={formData[f.id]} 
                          onChange={handleChange} 
                          placeholder={f.label}
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button type="submit" className="generate-cv-btn">
                  Generate Resume <i className="fa-solid fa-wand-magic-sparkles ms-2"></i>
                </button>
              </form>
            </div>

            {/* Preview Section */}
            {submitted && (
              <div className="cv-preview-section animate-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="m-0">Resume Preview</h3>
                  <PDFDownloadLink
                    document={<MyDocument data={formData} />}
                    fileName={`${formData.name}-Resume.pdf`}
                    className="btn btn-dark rounded-pill px-4"
                  >
                    {({ loading }) => (loading ? "Preparing PDF..." : <><i className="fa-solid fa-file-pdf me-2"></i>Download PDF</>)}
                  </PDFDownloadLink>
                </div>

                <div className="row">
                  {inputFields.map(f => (
                    <div key={f.id} className={f.type === "textarea" ? "col-12" : "col-md-6"}>
                      <div className="preview-field-box">
                        <strong>{f.label}</strong>
                        <p>{formData[f.id] || "Not provided"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CVBuilder;
