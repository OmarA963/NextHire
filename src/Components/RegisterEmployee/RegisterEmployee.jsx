import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import "../Login/Login.css";
import "./RegisterEmployee.css";
import loginImage from "../../assets/ai_register.png";
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

export default function RegisterEmployee() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    let [messageError, setMessageErro] = useState('');

    // Face Recognition State
    const webcamRef = useRef(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [faceDescriptor, setFaceDescriptor] = useState(null);
    const [isFaceUnique, setIsFaceUnique] = useState(false);
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
                console.log("FaceAPI Models Loaded");
            } catch (err) {
                console.error("Error loading models", err);
                setMessageErro("Error loading Face Recognition models. Please refresh.");
            }
        };
        loadModels();
    }, []);

    // Check if face is unique
    const checkFaceUniqueness = async (descriptor) => {
        const existingUsers = JSON.parse(localStorage.getItem('face_descriptors') || '[]');
        if (existingUsers.length === 0) return true;

        const faceMatcher = new faceapi.FaceMatcher(
            existingUsers.map(u => new faceapi.LabeledFaceDescriptors(u.label, [new Float32Array(u.descriptor)]))
        );

        const bestMatch = faceMatcher.findBestMatch(descriptor);
        // If match distance is below threshold (default 0.6), it's a match.
        // bestMatch.label will be 'unknown' if no match found.
        if (bestMatch.label !== 'unknown') {
            setMessageErro(`Face already registered as ${bestMatch.label}`);
            return false;
        }
        return true;
    };

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        // Create an HTMLImageElement from the base64 string
        const img = new Image();
        img.src = imageSrc;
        img.onload = async () => {
            try {
                const updatedDetections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

                if (updatedDetections) {
                    const isUnique = await checkFaceUniqueness(updatedDetections.descriptor);
                    if (isUnique) {
                        setCapturedImage(imageSrc);
                        setFaceDescriptor(Array.from(updatedDetections.descriptor)); // Convert Flash32Array to Array for storage
                        setIsFaceUnique(true);
                        setShowWebcam(false);

                        // Set Formik field
                        // Convert base64 to file
                        fetch(imageSrc)
                            .then(res => res.blob())
                            .then(blob => {
                                const file = new File([blob], "face_capture.jpg", { type: "image/jpeg" });
                                formik.setFieldValue("image", file);
                            });

                        setMessageErro(""); // Clear errors
                    } else {
                        setIsFaceUnique(false);
                    }
                } else {
                    setMessageErro("No face detected. Please try again.");
                }
            } catch (err) {
                console.error(err);
                setMessageErro("Error detecting face.");
            }
        };
    };


    async function handleRegisterEmployee(values) {
        if (!isFaceUnique) {
            setMessageErro("Please capture and verify your face first.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("FullName", values.FullName);
        formData.append("Email", values.Email);
        formData.append("Password", values.Password);
        formData.append("image", values.image); // This is now the captured face image

        // Log only readable data
        console.log("FormData being sent:", {
            FullName: values.FullName,
            Email: values.Email,
            Password: values.Password,
            imageName: values.image?.name,
        });

        try {
            // MOCK BACKEND: Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // SIMULATED REGISTRATION
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userExists = users.some(u => u.email === values.Email);

            if (userExists) {
                throw { response: { data: "Email already exists", status: 409 } };
            }

            // Create new user (Simulate Backend Logic)
            const newUser = {
                id: Date.now().toString(),
                fullName: values.FullName,
                email: values.Email,
                password: values.Password, // In real app, hash this!
                role: 'Employee'
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Save Face Descriptor (Already handled below, but ensuring consistency)
            const existingFaceData = JSON.parse(localStorage.getItem('face_descriptors') || '[]');
            existingFaceData.push({
                label: values.Email,
                descriptor: faceDescriptor
            });
            localStorage.setItem('face_descriptors', JSON.stringify(existingFaceData));

            setMessageErro("Employee registered successfully (Mocked).");
            navigate("/login");

        } catch (error) {
            console.error("Registration Error:", error);
            if (error.response) {
                setMessageErro(`Error: ${error.response.data}`);
            } else {
                setMessageErro("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const validation = Yup.object({
        FullName: Yup.string()
            .required("FullName is required")
            .min(6, "minimum length is 6")
            .max(30, "maximum length is 30, you can try your nick name instead!"),
        Email: Yup.string()
            .required("Email is required")
            .email("Email is not valid!"),
        Password: Yup.string()
            .required("Password is required")
            .matches(/^[A-Z][a-z0-9]{5,10}$/, "Password must start with uppercase..."),
    });

    const formik = useFormik({
        initialValues: {
            FullName: "",
            Email: "",
            Password: "",
            image: "",
        },
        validationSchema: validation,
        onSubmit: handleRegisterEmployee,
    });

    return (
            <div className="container-fluid p-0 login-grand-wrapper">
                <Header />
                <div className="container-fluid">
                    <div className="row justify-content-center align-items-center py-5 hero-reg">
                        <div className="col-lg-6 mb-5 mb-lg-0 text-center d-none d-lg-block">
                            <div className="login-image-container position-relative w-75 mx-auto">
                                <div className="glow-effect"></div>
                                <img className="img-fluid rounded-4 shadow-lg position-relative z-2" src={loginImage} alt="Talent Onboarding" />
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="login-glass-panel p-5 rounded-4 shadow-lg text-center">
                                <h1 className="text-white fw-bold mb-2">Talent <span className="text-cyan">Onboarding</span></h1>
                                <p className="text-secondary mb-4">Initialize your NextHire candidate profile</p>

                                {messageError && (
                                    <div className="alert alert-danger custom-alert">
                                        <i className="fa-solid fa-triangle-exclamation me-2"></i>{messageError}
                                    </div>
                                )}
                                
                                <form
                                    className='w-100 d-flex flex-column align-items-center justify-content-center'
                                    onSubmit={formik.handleSubmit}
                                >
                                    {/* FullName */}
                                    <input
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        className='glass-input w-100 mb-3'
                                        type="text"
                                        name="FullName"
                                        id="FullName"
                                        value={formik.values.FullName}
                                        placeholder='Full Name'
                                    />
                                    {formik.errors.FullName && formik.touched.FullName && (
                                        <div className="text-danger small mb-2 text-start w-100 ps-2">
                                            {String(formik.errors.FullName)}
                                        </div>
                                    )}

                                    {/* Email */}
                                    <input
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        className='glass-input w-100 mb-3'
                                        type="email"
                                        name="Email"
                                        id="Email"
                                        value={formik.values.Email}
                                        placeholder='System Email'
                                    />
                                    {formik.errors.Email && formik.touched.Email && (
                                        <div className="text-danger small mb-2 text-start w-100 ps-2">
                                            {String(formik.errors.Email)}
                                        </div>
                                    )}

                                    {/* Password */}
                                    <input
                                        autoComplete="current-password"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        className='glass-input w-100 mb-3'
                                        type="password"
                                        name="Password"
                                        id="Password"
                                        value={formik.values.Password}
                                        placeholder='Security Key'
                                    />
                                    {formik.errors.Password && formik.touched.Password && (
                                        <div className="text-danger small mb-2 text-start w-100 ps-2">
                                            {String(formik.errors.Password)}
                                        </div>
                                    )}

                                    {/* Image Upload / Face Capture */}
                                    <div className="w-100 mb-4 p-3 biometric-capture-zone rounded-3">
                                        <label className="mb-2 text-cyan fw-bold d-block text-start"><i className="fa-solid fa-expand me-2"></i>Biometric Handshake (Required)</label>
                                        {!capturedImage ? (
                                            <>
                                                {showWebcam ? (
                                                    <div className="webcam-container mb-3 position-relative overflow-hidden rounded-3 border-cyan" style={{ border: '2px solid rgba(0, 240, 255, 0.4)' }}>
                                                        {isModelsLoaded ? (
                                                            <>
                                                                <Webcam
                                                                    audio={false}
                                                                    ref={webcamRef}
                                                                    screenshotFormat="image/jpeg"
                                                                    width="100%"
                                                                    height={200}
                                                                    className="webcam-feed"
                                                                />
                                                                <button type="button" className="btn btn-cyan-glow mt-2 w-100 py-2 rounded-bottom-3" onClick={capture}>Capture & Verify Identity</button>
                                                            </>
                                                        ) : (
                                                            <div className="p-4 text-cyan">
                                                                <i className="fa-solid fa-spinner fa-spin me-2"></i>Loading AI Matrix...
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button type="button" className="btn btn-cyan-glow w-100 py-2 d-flex align-items-center justify-content-center" onClick={() => setShowWebcam(true)}>
                                                        <i className="fa-solid fa-camera-viewfinder me-2 fs-5"></i> Initialize Scanner
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <div className="mb-3 text-center d-flex align-items-center justify-content-between bg-dark p-2 rounded-3 border border-success">
                                                <div className="d-flex align-items-center">
                                                    <img src={capturedImage} alt="Captured Face" width="40" height="40" style={{ borderRadius: '50%', objectFit: 'cover' }} className="me-3" />
                                                    <span className="text-success fw-bold"><i className="fa-solid fa-circle-check me-2"></i>Verified</span>
                                                </div>
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => { setCapturedImage(null); setIsFaceUnique(false); setShowWebcam(true); }}>Reset</button>
                                            </div>
                                        )}

                                        <input
                                            className='d-none' // Hide the original file input as we use webcam
                                            onChange={(event) => {
                                                formik.setFieldValue("image", event.currentTarget.files[0]);
                                            }}
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="w-100 d-flex flex-column gap-3">
                                        {isLoading ? (
                                            <button className='btn btn-cyan-glow w-100 py-3 fw-bold' type='button'>
                                                <i className="fa-solid fa-spinner fa-spin me-2"></i>Processing...
                                            </button>
                                        ) : (
                                            <button
                                                disabled={!(formik.isValid && formik.dirty && isFaceUnique)}
                                                className='btn btn-cyan-glow w-100 py-3 fw-bold'
                                                type='submit'
                                            >
                                                Initialize Profile
                                            </button>
                                        )}
                                        <div className="mt-3">
                                            <Link className="text-secondary text-decoration-none sm-text hover-cyan" to={"/registeremployer"}>Or register as an Enterprise <i className="fa-solid fa-arrow-right ms-1"></i></Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
}
