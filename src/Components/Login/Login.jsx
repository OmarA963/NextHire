import React, { useState, useEffect, useContext, useRef } from 'react'
import { TheUserContext } from '../UserContext/UserContext'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import "./Login.css"
import loginImage from "../../assets/ai_login.png"
import { Link, useNavigate } from 'react-router-dom'
import "../RegisterEmployee/RegisterEmployee.css";
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

export default function Login() {
    const { saveUserData, compImage, setCompImage } = useContext(TheUserContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    let [messageError, setMessageErro] = useState('');
    let [userType, setUserType] = useState("");
    let [userImage, setuserImage] = useState("");

    // Face Auth State
    const webcamRef = useRef(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [showWebcam, setShowWebcam] = useState(false);
    const [isFaceVerified, setIsFaceVerified] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'failed'

    useEffect(() => {
        console.log("Loading state changed:", isLoading);
    }, [isLoading]);

    useEffect(() => {
        if (compImage) {
            console.log("Updated company image:", compImage);
        }
    }, [compImage]);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setIsModelsLoaded(true);
                console.log("FaceAPI Models Loaded");
            } catch (err) {
                console.error("Error loading models", err);
            }
        };
        loadModels();
    }, []);


    function getUserType(event) {
        const value = event.target.value;
        setUserType(value);
        if (value === "Employee") {
            setuserImage("GetEmployeeImage");
        } else if (value === "Companies") {
            setuserImage("GetCompanyImage");
        }
    }

    const verifyFace = async () => {
        if (!formik.values.email) {
            setMessageErro("Please enter your email first.");
            return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        const img = new Image();
        img.src = imageSrc;
        img.onload = async () => {
            try {
                const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

                if (detection) {
                    const existingUsers = JSON.parse(localStorage.getItem('face_descriptors') || '[]');
                    const userFaceData = existingUsers.find(u => u.label === formik.values.email);

                    if (userFaceData) {
                        const distance = faceapi.euclideanDistance(detection.descriptor, userFaceData.descriptor);
                        if (distance < 0.6) {
                            setIsFaceVerified(true);
                            setVerificationStatus('success');
                            setShowWebcam(false);
                            setMessageErro("");
                        } else {
                            setVerificationStatus('failed');
                            setMessageErro("Face not recognized. Please try again.");
                        }
                    } else {
                        setMessageErro("No face data found for this user. Please contact support.");
                        setShowWebcam(false);
                    }

                } else {
                    setMessageErro("No face detected.");
                }

            } catch (err) {
                console.error(err);
                setMessageErro("Verification error.");
            }
        };
    };


    async function handleLogin(values) {
        if (userType === "Employee") {
            const existingUsers = JSON.parse(localStorage.getItem('face_descriptors') || '[]');
            const userFaceData = existingUsers.find(u => u.label === values.email);

            if (userFaceData && !isFaceVerified) {
                setMessageErro("Please verify your face before logging in.");
                return;
            }
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const usersJson = localStorage.getItem('users');
            const users = JSON.parse(usersJson || '[]');

            const user = users.find(u => {
                const emailMatch = u.email?.toLowerCase() === values.email?.toLowerCase();
                const passMatch = u.password === values.password;
                return emailMatch && passMatch;
            });

            if (user) {
                const data = {
                    token: "mock-jwt-token-" + Date.now(),
                    user: {
                        email: user.email,
                        employeeId: user.id,
                        name: user.fullName || user.name || 'Mock User'
                    },
                };

                setMessageErro("Login Successful (Mocked)");
                
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    if (data.user?.employeeId) {
                        localStorage.setItem("employee-id", data.user.employeeId);
                    }
                    saveUserData();
                    navigate("/");
                }
            } else {
                throw { response: { data: "Invalid email or password", status: 401 } };
            }

        } catch (error) {
            console.error("Login Implementation Error:", error);
            if (error.response) {
                setMessageErro(error.response.data);
            } else if (error instanceof SyntaxError) {
                setMessageErro("Local storage data is corrupted. Please clear your browser cache.");
            } else {
                setMessageErro(`Login failed: ${error.message || "Unknown error"}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function getImage(compId) {
        try {
            const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://localhost:7209';
            const response = await axios.get(
                `${API_BASE_URL}/api/${userType}/${compId}/${userImage}`,
                {
                    responseType: 'blob',
                }
            );
            const imageUrl = URL.createObjectURL(response.data);
            setCompImage(imageUrl);
            return imageUrl;
        } catch (error) {
            console.log("Server returned:", error.response?.data || error.message);
            alert("Something went wrong. Please try again.");
            return null;
        }
    }

    const validation = Yup.object({
        email: Yup.string()
            .required("Email is required")
            .email("Email is not valid!"),
        password: Yup.string()
            .required("Password is required")
            .matches(/^[A-Z][a-z0-9]{5,10}$/, "Password must start with uppercase..."),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validation,
        onSubmit: handleLogin,
    });

    return (
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container main-content-wrapper py-5 mt-5">
                <div className="row align-items-center justify-content-center">
                    {/* Left Graphic */}
                    <div className="col-lg-6 mb-5 mb-lg-0 text-center">
                        <div className="login-image-container position-relative">
                            <div className="glow-effect"></div>
                            <img className='img-fluid rounded-4 shadow-lg position-relative z-2' src={loginImage} alt="AI Secure Login" />
                        </div>
                    </div>
                    
                    {/* Right Form */}
                    <div className="col-lg-5">
                        <div className="login-glass-panel p-5 rounded-4 shadow-lg">
                            <div className="login-header mb-4 text-center">
                                <h3 className='fs-2 fw-bold text-white'>Access <span className="text-cyan">Portal</span></h3>
                                <p className='text-secondary fs-6'>Secure AI-Driven Authentication</p>
                            </div>
                            
                            {messageError && (
                                <div className="alert alert-danger bg-transparent border-danger text-danger">
                                    {messageError}
                                </div>
                            )}

                            <form className='d-flex flex-column gap-3' onSubmit={formik.handleSubmit}>
                                {/* Email */}
                                <div className="form-group position-relative">
                                    <i className="fa-regular fa-envelope position-absolute text-secondary" style={{top: '15px', left: '15px'}}></i>
                                    <input
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        className='form-control login-input ps-5 py-3'
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formik.values.email}
                                        placeholder='Secure Email Address'
                                    />
                                </div>
                                {formik.errors.email && formik.touched.email && (
                                    <div className="text-danger small ms-2">{String(formik.errors.email)}</div>
                                )}

                                {/* Password */}
                                <div className="form-group position-relative">
                                    <i className="fa-solid fa-lock position-absolute text-secondary" style={{top: '15px', left: '15px'}}></i>
                                    <input
                                        autoComplete="current-password"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        className='form-control login-input ps-5 py-3'
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formik.values.password}
                                        placeholder='Decryption Key'
                                    />
                                </div>
                                {formik.errors.password && formik.touched.password && (
                                    <div className="text-danger small ms-2">{String(formik.errors.password)}</div>
                                )}
                                
                                {/* User Type Selector */}
                                <div className="type-selector-glass p-3 rounded mt-2 d-flex justify-content-around align-items-center">
                                    <span className="text-white-50"><i className="fa-solid fa-user-shield me-2"></i>Entity Type:</span>
                                    <div className="form-check form-check-inline m-0">
                                        <input
                                            className="form-check-input custom-radio"
                                            type="radio"
                                            name="user"
                                            value="Employee"
                                            id="employee"
                                            checked={userType === "Employee"}
                                            onChange={getUserType}
                                        />
                                        <label className="form-check-label text-light" htmlFor="employee">Seeker</label>
                                    </div>
                                    <div className="form-check form-check-inline m-0">
                                        <input
                                            className="form-check-input custom-radio"
                                            type="radio"
                                            name="user"
                                            value="Companies"
                                            id="company"
                                            checked={userType === "Companies"}
                                            onChange={getUserType}
                                        />
                                        <label className="form-check-label text-light" htmlFor="company">Company</label>
                                    </div>
                                </div>

                                {/* Face Verification Component */}
                                {userType === "Employee" && (
                                    <div className="w-100 d-flex flex-column align-items-center mt-3">
                                        {!isFaceVerified ? (
                                            <>
                                                {showWebcam ? (
                                                    <div className="webcam-container mb-3 text-center w-100 rounded overflow-hidden shadow-sm" style={{border: '1px solid var(--neon-cyan)'}}>
                                                        {isModelsLoaded ? (
                                                            <>
                                                                <Webcam
                                                                    audio={false}
                                                                    ref={webcamRef}
                                                                    screenshotFormat="image/jpeg"
                                                                    className="w-100 h-auto"
                                                                />
                                                                <button type="button" className="btn btn-warning w-100 rounded-0" onClick={verifyFace}>Initialize Scan</button>
                                                            </>
                                                        ) : (
                                                            <p className="text-white my-4"><i className="fa-solid fa-spinner fa-spin me-2"></i>Loading Biometrics...</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button type="button" className="btn btn-outline-cyan w-100 py-2" onClick={() => setShowWebcam(true)}>
                                                        <i className="fa-solid fa-face-viewfinder me-2"></i>Activate Biometric Scan
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <div className="alert alert-success bg-transparent border-success text-success w-100 text-center">
                                                <i className="fa-solid fa-check-circle me-2"></i>Biometric Match Verified
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Submit Actions */}
                                <div className="d-flex flex-column gap-3 mt-4">
                                    {isLoading ? (
                                        <button className='btn btn-cyan-glow py-3 fw-bold' type='button' disabled>
                                            <i className="fa-solid fa-circle-notch fa-spin me-2"></i>Authenticating...
                                        </button>
                                    ) : (
                                        <button
                                            disabled={!(formik.isValid && formik.dirty)}
                                            className='btn btn-cyan-glow py-3 fw-bold'
                                            type='submit'
                                        >
                                            Initialize Protocol
                                        </button>
                                    )}
                                    <div className="text-center">
                                        <span className="text-secondary">Unregistered? </span>
                                        <Link className="text-decoration-none text-cyan fw-bold border-bottom-hover" to={"/register"}>Request Access</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
