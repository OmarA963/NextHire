import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import './RegisterEmployee.css';
import registerBanner from '../../assets/ai_register.png';

export default function RegisterEmployee() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    
    // Face Recognition State
    const webcamRef = useRef(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [faceDescriptor, setFaceDescriptor] = useState(null);
    const [showWebcam, setShowWebcam] = useState(false);

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
                console.error("Error loading models", err);
            }
        };
        loadModels();
    }, []);

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        const img = new Image();
        img.src = imageSrc;
        img.onload = async () => {
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (detection) {
                setCapturedImage(imageSrc);
                setFaceDescriptor(Array.from(detection.descriptor));
                setShowWebcam(false);
                setError('');
            } else {
                setError("Face not detected. Please try again.");
            }
        };
    };

    const validation = Yup.object({
        name: Yup.string().required("Full name is required").min(3),
        email: Yup.string().required("Email is required").email("Invalid email"),
        password: Yup.string().required("Password is required").min(8)
    });

    const formik = useFormik({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: validation,
        onSubmit: async (values) => {
            if (!capturedImage) {
                setError("Face verification is required.");
                return;
            }
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                if (users.find(u => u.email === values.email)) throw new Error("Email already exists.");

                const newUser = { id: Date.now(), ...values, role: 'Employee' };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // Save Face
                const faceData = JSON.parse(localStorage.getItem('face_descriptors') || '[]');
                faceData.push({ label: values.email, descriptor: faceDescriptor });
                localStorage.setItem('face_descriptors', JSON.stringify(faceData));

                navigate('/login');
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    });

    return (
        <div className="reg-candidate-page">
            <Header />
            <div className="reg-candidate-container">
                <div className="reg-candidate-card animate-in">
                    {/* Banner Side */}
                    <div className="reg-candidate-banner-side">
                        <img src={registerBanner} alt="Candidate" className="reg-candidate-img" />
                        <h2 className="fw-bold text-dark">Build Your Future</h2>
                        <p className="text-muted">Join the most advanced AI-powered career network.</p>
                    </div>

                    {/* Form Side */}
                    <div className="reg-candidate-form-side">
                        <h1>Candidate Registration</h1>
                        <p>Join NextHire to unlock exclusive AI career tools.</p>

                        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                        <form onSubmit={formik.handleSubmit}>
                            <input 
                                type="text" 
                                className="modern-reg-input" 
                                placeholder="Full Name" 
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name && <div className="text-danger small mb-2">{formik.errors.name}</div>}

                            <input 
                                type="email" 
                                className="modern-reg-input" 
                                placeholder="Email Address" 
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && <div className="text-danger small mb-2">{formik.errors.email}</div>}

                            <input 
                                type="password" 
                                className="modern-reg-input" 
                                placeholder="Password" 
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password && <div className="text-danger small mb-2">{formik.errors.password}</div>}

                            {/* Biometric Zone */}
                            <div className="biometric-box">
                                <label className="fw-bold mb-3 d-block text-primary">
                                    <i className="fa-solid fa-face-smile me-2"></i>Face ID Identity (Required)
                                </label>
                                
                                {!capturedImage ? (
                                    <>
                                        {showWebcam ? (
                                            <div className="webcam-preview">
                                                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%" />
                                                <button type="button" className="btn-scan" onClick={capture}>Verify My Face</button>
                                            </div>
                                        ) : (
                                            <button type="button" className="btn-scan" onClick={() => setShowWebcam(true)}>
                                                {isModelsLoaded ? "Initialize Face Scanner" : "Loading AI Models..."}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="verified-badge">
                                        <i className="fa-solid fa-circle-check fs-4"></i> Identity Verified
                                        <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => setCapturedImage(null)}>Reset</button>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="reg-btn-submit" disabled={isLoading}>
                                {isLoading ? "Initializing..." : "Create Candidate Profile"}
                            </button>

                            <Link to="/registeremployer" className="switch-reg-link">
                                Hire Talent Instead? Register as Company <i className="fa-solid fa-arrow-right ms-1"></i>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
