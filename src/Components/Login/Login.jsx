import React, { useState, useEffect, useContext, useRef } from 'react'
import { TheUserContext } from '../UserContext/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from "yup"
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js'
import { authAPI } from '../../services/api'
import "./Login.css"

export default function Login() {
    const { saveUserData } = useContext(TheUserContext);
    const navigate = useNavigate();

    // UI State
    const [activeTab, setActiveTab] = useState(window.location.pathname === '/register' ? 'signup' : 'login');
    const [loginType, setLoginType] = useState('Employee'); // 'Employee' or 'Company'
    const [isLoading, setIsLoading] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [messageSuccess, setMessageSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Face Auth State
    const webcamRef = useRef(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [showWebcam, setShowWebcam] = useState(false);
    const [isFaceVerified, setIsFaceVerified] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);

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
            } catch (err) {
                console.error("Error loading faceapi models", err);
            }
        };
        loadModels();
    }, []);

    const handleLogin = async (values, faceVerified = false) => {
        setIsLoading(true);
        setMessageError('');
        setMessageSuccess('');
        try {
            // ─── Try Real API ────────────────────────────────────────
            const res = await authAPI.login(values.email, values.password);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'EMPLOYER') {
                localStorage.setItem('company-id', user.user_id);
            }

            saveUserData();
            navigate("/");
        } catch (apiError) {
            // ─── Fallback to Offline Mode ────────────────────────────
            if (apiError.code === 'ERR_NETWORK' || apiError.code === 'ECONNREFUSED' || !apiError.response) {
                const offlineUsers = JSON.parse(localStorage.getItem('users') || '[]');
                const user = offlineUsers.find(u => u.email?.toLowerCase() === values.email?.toLowerCase() && u.password === values.password);
                
                if (user) {
                    const mockToken = "mock-jwt-token-" + user.user_id;
                    localStorage.setItem('token', mockToken);
                    localStorage.setItem('user', JSON.stringify(user));
                    if (user.userType === 'Company' || user.role === 'EMPLOYER') {
                        localStorage.setItem('company-id', user.user_id);
                    }
                    saveUserData();
                    setMessageSuccess("Logged in (Offline Mode)");
                    setTimeout(() => navigate("/"), 1500);
                    return;
                }
            }

            const msg = apiError.response?.data?.message || 'Unable to connect to the server. Please ensure the backend is running on port 5000.';
            setMessageError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // Verify Face
    const verifyFace = async () => {
        if (!loginFormik.values.email) {
            setMessageError("Please enter your email first to verify your identity.");
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
                    const userFaceData = existingUsers.find(u => u.label === loginFormik.values.email);

                    if (userFaceData) {
                        const distance = faceapi.euclideanDistance(detection.descriptor, userFaceData.descriptor);
                        if (distance < 0.6) {
                            setIsFaceVerified(true);
                            setVerificationStatus('success');
                            setMessageSuccess("Face matched successfully!");
                            setTimeout(() => setShowWebcam(false), 1000);
                            setMessageError("");

                            // Auto trigger login
                            handleLogin(loginFormik.values, true);
                        } else {
                            setVerificationStatus('failed');
                            setMessageError("Face not recognized. Please try again or use password.");
                        }
                    } else {
                        setMessageError("No face data found for this email. Please sign up or use password.");
                    }
                } else {
                    setMessageError("No face detected. Please look clearly at the camera.");
                }
            } catch (err) {
                console.error(err);
                setMessageError("Verification error.");
            }
        };
    };

    // Forms
    const loginValidation = Yup.object({
        email: Yup.string().required("Email is required").email("Invalid email"),
        password: Yup.string().required("Password is required")
    });

    const signupValidation = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().required("Email is required").email("Invalid email"),
        password: Yup.string().required("Password is required").min(6, "Min 6 characters"),
        userType: Yup.string().required("Please select account type")
    });

    const handleSignup = async (values) => {
        // Redirect to selection
        setActiveTab('signup');
    };

    const loginFormik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: loginValidation,
        onSubmit: handleLogin,
    });

    const signupFormik = useFormik({
        initialValues: { name: "", email: "", password: "", userType: "Employee" },
        validationSchema: signupValidation,
        onSubmit: handleSignup,
    });

    return (
        <div className="auth-page-wrapper">
            <div className="auth-glass-card position-relative">
                {/* Header */}
                <div className="auth-logo">
                    <i className="fa-solid fa-chart-line me-2" style={{ color: '#4A90E2' }}></i>
                    NextHire
                </div>
                <h2 className="auth-title">Welcome to NextHire</h2>

                {/* Tabs */}
                <div className="auth-tabs">
                    <div
                        className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('login'); setMessageError(''); setMessageSuccess(''); }}
                    >
                        LOGIN
                    </div>
                    <div
                        className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('signup'); setMessageError(''); setMessageSuccess(''); }}
                    >
                        SIGN UP
                    </div>
                </div>

                {/* Messages */}
                {messageError && <div className="alert alert-danger py-2 small border-0 bg-transparent text-danger text-center">{messageError}</div>}
                {messageSuccess && <div className="alert alert-success py-2 small border-0 bg-transparent text-success text-center">{messageSuccess}</div>}

                {/* Content */}
                {activeTab === 'login' ? (
                    <div className="animate-in">
                        {/* Login Type Toggle */}
                        <div className="login-type-toggle mb-4">
                            <div
                                className={`type-option ${loginType === 'Employee' ? 'active employee' : ''}`}
                                onClick={() => setLoginType('Employee')}
                            >
                                <i className="fa-solid fa-user-tie me-2"></i>Candidate
                            </div>
                            <div
                                className={`type-option ${loginType === 'Company' ? 'active company' : ''}`}
                                onClick={() => setLoginType('Company')}
                            >
                                <i className="fa-solid fa-building me-2"></i>Company
                            </div>
                        </div>

                        <p className="auth-subtitle text-center">
                            {loginType === 'Employee' ? 'Enter your candidate credentials to access jobs.' : 'Enter your corporate keys to manage talent.'}
                        </p>
                        <form onSubmit={loginFormik.handleSubmit}>
                            <div className="auth-form-group">
                                <label className="auth-label">Email Address</label>
                                <div className="auth-input-container">
                                    <input
                                        type="email"
                                        name="email"
                                        className="auth-input"
                                        placeholder="example@email.com"
                                        onChange={loginFormik.handleChange}
                                        onBlur={loginFormik.handleBlur}
                                        value={loginFormik.values.email}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-group">
                                <label className="auth-label">Password</label>
                                <div className="auth-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="auth-input"
                                        placeholder="••••••••"
                                        onChange={loginFormik.handleChange}
                                        onBlur={loginFormik.handleBlur}
                                        value={loginFormik.values.password}
                                    />
                                    <i
                                        className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} auth-icon-right`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                                <a href="#" className="auth-forgot">Forgot Password?</a>
                            </div>

                            <button
                                type="submit"
                                className="auth-btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : (isFaceVerified ? 'Face Verified - Logging In...' : 'Sign In')}
                            </button>
                        </form>

                        <div className="auth-divider">or sign in with</div>

                        <div className="auth-social-container">
                            <button type="button" className="auth-social-btn text-danger">
                                <i className="fa-brands fa-google"></i>
                            </button>
                            <button type="button" className="auth-social-btn text-primary">
                                <i className="fa-brands fa-linkedin-in"></i>
                            </button>
                            <button type="button" className="auth-social-btn face-id" title="Login with Face ID" onClick={() => setShowWebcam(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="face-id-logo">
                                    <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                                    <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                                    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                                    <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
                                    <path d="M9 10h.01" />
                                    <path d="M15 10h.01" />
                                    <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in">
                        <p className="auth-subtitle text-center mb-4">Choose your journey on NextHire.</p>

                        <div className="d-flex flex-column gap-3">
                            {/* Candidate Choice */}
                            <Link to="/registeremployee" className="signup-choice-card">
                                <div className="choice-icon candidate">
                                    <i className="fa-solid fa-user-tie"></i>
                                </div>
                                <div className="choice-text">
                                    <h4>I'm a Candidate</h4>
                                    <p>Find your dream job and build your career with AI tools.</p>
                                </div>
                                <i className="fa-solid fa-chevron-right arrow-icon"></i>
                            </Link>

                            {/* Company Choice */}
                            <Link to="/registeremployer" className="signup-choice-card">
                                <div className="choice-icon company">
                                    <i className="fa-solid fa-building"></i>
                                </div>
                                <div className="choice-text">
                                    <h4>I'm an Employer</h4>
                                    <p>Hire top talent and manage your recruitment pipeline.</p>
                                </div>
                                <i className="fa-solid fa-chevron-right arrow-icon"></i>
                            </Link>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="small text-muted">Join a community of 50,000+ professionals.</p>
                        </div>
                    </div>
                )}

                {/* Footer Link */}
                <div className="auth-footer-text mt-4">
                    {activeTab === 'login' ? (
                        <>Don't have an account? <span className="auth-footer-link" onClick={() => setActiveTab('signup')}>Sign Up</span></>
                    ) : (
                        <>Already have an account? <span className="auth-footer-link" onClick={() => setActiveTab('login')}>Sign In</span></>
                    )}
                </div>

                {/* Face ID Modal Overlay */}
                {showWebcam && (
                    <div className="face-id-modal">
                        <button className="close-modal-btn" onClick={() => setShowWebcam(false)}>
                            <i className="fa-solid fa-times"></i>
                        </button>
                        <h4 className="mb-3" style={{ color: '#1A1A1A' }}><i className="fa-solid fa-face-viewfinder text-primary me-2"></i>Face Verification</h4>
                        <p className="text-secondary small mb-4">Position your face in the center of the frame</p>

                        {isModelsLoaded ? (
                            <>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width={300}
                                    height={225}
                                />
                                <button className="auth-btn-primary mt-4" onClick={verifyFace}>
                                    <i className="fa-solid fa-camera me-2"></i> Scan Face
                                </button>
                            </>
                        ) : (
                            <div className="py-5 text-secondary">
                                <i className="fa-solid fa-spinner fa-spin fs-2 mb-3"></i>
                                <p>Loading biometric models...</p>
                            </div>
                        )}

                        {verificationStatus === 'failed' && (
                            <p className="text-danger small mt-3">Match failed. Please try again.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
