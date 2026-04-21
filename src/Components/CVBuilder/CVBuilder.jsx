import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./CVBuilder.css"
import cvGraphic from "../../assets/ai_design.png";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import "bootstrap/dist/css/bootstrap.min.css";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  subHeading: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 3,
    fontWeight: "bold",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  certificateImage: {
    width: "48%",
    height: 200,
    marginBottom: 10,
    objectFit: "contain",
  },
  certificateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});

// PDF Component
const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {data.photo && <Image src={data.photo} style={styles.image} />}
        <Text style={styles.heading}>{data.name}</Text>
        <Text>
          {data.email} | {data.phone}
        </Text>
        <Text>
          {data.linkedin} {data.github ? `| ${data.github}` : ""}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Summary</Text>
        <Text>{data.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Experience</Text>
        <Text>{data.experience}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Projects</Text>
        <Text>{data.projects}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Education</Text>
        <Text>{data.education}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Skills</Text>
        <Text>{data.skills}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Certifications</Text>
        <Text>{data.certifications}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Languages</Text>
        <Text>{data.languages}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Achievements</Text>
        <Text>{data.achievements}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Portfolio</Text>
        <Text>{data.portfolio}</Text>
      </View>
    </Page>

    {data.certificateImages && data.certificateImages.length > 0 && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Certificates</Text>
        <View style={styles.certificateContainer}>
          {data.certificateImages.map((img, index) => (
            <Image key={index} src={img} style={styles.certificateImage} />
          ))}
        </View>
      </Page>
    )}
  </Document>
);

const CVBuilder = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
    experience: "",
    projects: "",
    education: "",
    skills: "",
    certifications: "",
    languages: "",
    achievements: "",
    portfolio: "",
    photo: "",
    category: "IT",
    certificateImages: [], 
  });

  const [submitted, setSubmitted] = useState(false);
  const [apiKeywords, setApiKeywords] = useState([]);

  useEffect(() => {
    axios
      .get("https://gist.githubusercontent.com/mohamedshal/fb06b06a9d30c2c75ca1729f1002db0f/raw")
      .then((response) => {
        if (Array.isArray(response.data.keywords)) {
          setApiKeywords(response.data.keywords.map(kw => kw.toLowerCase()));
        }
      })
      .catch((error) => console.error("Failed to fetch API data:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }))
      .then(images => {
        setFormData(prev => ({ ...prev, certificateImages: [...prev.certificateImages, ...images] }));
      })
      .catch(err => console.error("Error loading images", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const isITCategory = () => {
    const summary = formData.summary.toLowerCase();
    return (
      formData.category === "IT" ||
      apiKeywords.some((kw) => summary.includes(kw))
    );
  };

  const inputFields = [
    "name",
    "email",
    "phone",
    "linkedin",
    ...(isITCategory() ? ["github"] : []),
    "summary",
    "experience",
    "projects",
    "education",
    "skills",
    "certifications",
    "languages",
    "achievements",
    "portfolio",
  ];

  const calculateScore = () => {
    let score = 0;
    const fields = [
      { name: 'name', weight: 10 },
      { name: 'email', weight: 10 },
      { name: 'phone', weight: 10 },
      { name: 'summary', weight: 15 },
      { name: 'experience', weight: 15 },
      { name: 'skills', weight: 15 },
      { name: 'education', weight: 10 },
      { name: 'projects', weight: 10 },
      { name: 'certifications', weight: 5 }
    ];
    fields.forEach(field => {
      if (formData[field.name] && formData[field.name].trim().length > 0) score += field.weight;
    });
    return score;
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (!formData.summary) suggestions.push("Add a professional summary.");
    if (!formData.experience) suggestions.push("List your work experience.");
    if (!formData.skills) suggestions.push("Add relevant skills.");
    if (!formData.projects) suggestions.push("Showcase projects.");
    return suggestions;
  };

  const cvScore = calculateScore();
  const cvSuggestions = getSuggestions();

  return (
    <div className="container-fluid p-0 login-grand-wrapper">
      <Header />
      <div className="container cv-builder-wrapper">
        <div className="row g-4 justify-content-center">
            {/* Header section with graphic */}
            <div className="col-12 text-center mb-5">
                <div className="position-relative d-inline-block">
                    <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'150%', height:'150%'}}></div>
                    <img src={cvGraphic} alt="AI CV" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '300px'}} />
                </div>
                <h1 className="text-white fw-bold mt-4">AI Resume <span className="text-cyan">Architect</span></h1>
                <p className="text-secondary">Synthesize your professional history into a high-converting profile.</p>
            </div>

            {/* Score & Suggestions */}
            <div className="col-lg-4">
                <div className="cv-glass-card">
                    <div className="cv-strength-header">
                        <h3>Profile Strength</h3>
                        <span className={`badge ${cvScore > 70 ? 'bg-success' : 'bg-warning'}`}>{cvScore}%</span>
                    </div>
                    <div className="cv-progress progress">
                        <div className="cv-progress-bar progress-bar" style={{ width: `${cvScore}%` }}></div>
                    </div>
                    
                    {cvSuggestions.length > 0 && (
                        <div className="suggestion-box">
                            <strong><i className="fa-solid fa-lightbulb me-2"></i>AI Suggestions:</strong>
                            <ul className="list-unstyled mb-0">
                                {cvSuggestions.map((s, i) => (
                                    <li key={i}><i className="fa-solid fa-chevron-right me-2 small"></i>{s}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Upload Section */}
                <div className="cv-glass-card">
                    <h4 className="text-white mb-4 fs-5">Assets & Proof</h4>
                    <div className="mb-4">
                        <label className="field-label">Portrait Photo</label>
                        <div className="custom-image-upload" onClick={() => document.getElementById('photo-input').click()}>
                            {formData.photo ? (
                                <img src={formData.photo} alt="Preview" className="rounded-circle shadow" style={{width:80, height:80, objectFit:'cover'}} />
                            ) : (
                                <div className="text-secondary"><i className="fa-solid fa-camera mb-2 fs-3"></i><br/>Upload Portrait</div>
                            )}
                            <input id="photo-input" type="file" hidden accept="image/*" onChange={handleImageUpload} />
                        </div>
                    </div>
                    <div>
                        <label className="field-label">Certifications Export</label>
                        <div className="custom-image-upload" onClick={() => document.getElementById('cert-input').click()}>
                            <i className="fa-solid fa-file-shield mb-2 fs-3 text-secondary"></i><br/>
                            <span className="text-secondary">Select Files</span>
                            <input id="cert-input" type="file" hidden multiple accept="image/*" onChange={handleCertificateUpload} />
                        </div>
                        {formData.certificateImages.length > 0 && (
                            <div className="mt-3 d-flex gap-2 flex-wrap justify-content-center">
                                {formData.certificateImages.map((img, idx) => (
                                    <div key={idx} className="position-relative">
                                        <img src={img} alt="Cert" style={{ width: 40, height: 40, objectFit: 'cover' }} className="rounded border border-secondary" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="col-lg-7">
                <div className="cv-glass-card cv-form-section">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="field-label">Primary Discipline</label>
                            <div className="radio-group p-3 rounded-3 bg-dark bg-opacity-25 border border-white border-opacity-10">
                                <div className="form-check radio-item">
                                    <input className="form-check-input" type="radio" name="category" id="it" value="IT" checked={formData.category === "IT"} onChange={handleChange}/>
                                    <label className="form-check-label" htmlFor="it">Software Engineering</label>
                                </div>
                                <div className="form-check radio-item">
                                    <input className="form-check-input" type="radio" name="category" id="non-it" value="Non-IT" checked={formData.category === "Non-IT"} onChange={handleChange}/>
                                    <label className="form-check-label" htmlFor="non-it">Other Industry</label>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {inputFields.map((field) => (
                                <div className={["summary", "experience", "projects", "education", "skills", "certifications", "achievements"].includes(field) ? "col-12 mb-4" : "col-md-6 mb-4"} key={field}>
                                    <label className="field-label">{field.replace(/([A-Z])/g, " $1")}</label>
                                    {["summary", "experience", "projects", "education", "skills", "certifications", "achievements"].includes(field) ? (
                                        <textarea className="glass-input w-100" rows="4" placeholder={`Describe your ${field}...`} name={field} value={formData[field]} onChange={handleChange} required />
                                    ) : (
                                        <input type={field === 'email' ? 'email' : 'text'} className="glass-input w-100" placeholder={`Enter ${field}`} name={field} value={formData[field]} onChange={handleChange} required />
                                    )}
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="btn btn-cyan-glow w-100 py-3 fw-bold mt-2">
                            <i className="fa-solid fa-wand-sparkles me-2"></i>Synthesize Resume
                        </button>
                    </form>
                </div>

                {/* Preview & Download */}
                {submitted && (
                    <div className="cv-glass-card mt-4 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="text-white m-0 fs-4">Review Matrix</h2>
                            <PDFDownloadLink
                                document={<MyDocument data={formData} />}
                                fileName={`${formData.name}-CV.pdf`}
                                className="btn btn-purple-glow btn-sm"
                            >
                                {({ loading }) => (loading ? "Encrypting..." : <><i className="fa-solid fa-download me-2"></i>Download PDF</>)}
                            </PDFDownloadLink>
                        </div>
                        
                        <div className="cv-preview-card">
                            <div className="row">
                                {inputFields.map((field) => (
                                    <div key={field} className={["summary", "experience", "projects", "education", "skills", "certifications", "achievements"].includes(field) ? "col-12 mb-3" : "col-md-6 mb-3"}>
                                        <strong>{field}:</strong>
                                        <p className="mb-1">{formData[field] || <span className="text-muted italic">NULL</span>}</p>
                                        <button className="edit-btn" onClick={() => {
                                            const el = document.querySelector(`[name="${field}"]`);
                                            el?.scrollIntoView({ behavior: "smooth", block: "center" });
                                            el?.focus();
                                        }}><i className="fa-solid fa-pen-to-square me-1"></i>Edit Data</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <Footer />
      </div>
    </div>
  )
};

export default CVBuilder;
