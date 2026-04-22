import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './MockInterview.css';
import interviewBanner from '../../assets/interview_banner.png';

const QUESTIONS = {
    frontend: [
        {
            question: "What is the primary purpose of the Virtual DOM in React?",
            options: [
                "To directly manipulate the browser's DOM for better speed.",
                "To create a lightweight copy of the DOM to minimize expensive direct DOM updates.",
                "To store global application state.",
                "To handle server-side routing."
            ],
            correct: 1,
            explanation: "The Virtual DOM is a key React concept. It's a memory representation of the real DOM. When state changes, React updates the Virtual DOM first, then calculates the most efficient way to update the real DOM (Reconciliation)."
        },
        {
            question: "Which hook is used to handle side effects in functional components?",
            options: ["useState", "useContext", "useEffect", "useReducer"],
            correct: 2,
            explanation: "useEffect allows you to perform side effects like data fetching, subscriptions, or manually changing the DOM from functional components. It serves the same purpose as lifecycle methods in class components."
        },
        {
            question: "What does JSX stand for?",
            options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Xerox", "JSON Syntax Extension"],
            correct: 0,
            explanation: "JSX is a syntax extension for JavaScript. It looks like HTML but works inside JavaScript, allowing you to write structured UI components easily."
        },
        {
            question: "In React, how do you pass data from a parent to a child component?",
            options: ["Using State", "Using Refs", "Using Props", "Using Redux only"],
            correct: 2,
            explanation: "Props (short for properties) are used to pass data from parent components down to child components. Data flow in React is uni-directional."
        },
        {
            question: "Which command is used to create a new React app with Vite?",
            options: ["npm create vite@latest", "npx create-react-app", "npm start react", "create-vite-app"],
            correct: 0,
            explanation: "Vite is a modern build tool that provides a faster and leaner development experience. The standard command to start a new project is 'npm create vite@latest'."
        }
    ],
    backend: [
        {
            question: "Which of the following is a NoSQL database?",
            options: ["PostgreSQL", "MySQL", "MongoDB", "Oracle"],
            correct: 2,
            explanation: "MongoDB is a document-oriented NoSQL database that stores data in JSON-like documents with dynamic schemas, making it very flexible for rapidly changing data structures."
        },
        {
            question: "What does the 'S' in REST stand for?",
            options: ["Simple", "State", "System", "Server"],
            correct: 1,
            explanation: "REST stands for Representational State Transfer. It is an architectural style that defines a set of constraints to be used for creating Web Services."
        },
        {
            question: "Which Node.js module is used to handle file paths?",
            options: ["fs", "http", "path", "url"],
            correct: 2,
            explanation: "The 'path' module provides utilities for working with file and directory paths. It handles cross-platform path differences automatically."
        },
        {
            question: "What is the purpose of 'npm'?",
            options: ["Node Program Manager", "Node Package Manager", "New Project Maker", "Network Protocol Manager"],
            correct: 1,
            explanation: "npm is the world's largest software registry. It's used to manage dependencies (packages) for Node.js projects."
        },
        {
            question: "Which HTTP method is typically used to update an existing resource?",
            options: ["GET", "POST", "PUT", "DELETE"],
            correct: 2,
            explanation: "PUT or PATCH are used for updates. PUT typically replaces the entire resource, while PATCH is used for partial updates."
        }
    ],
    hr: [
        {
            question: "What is considered the best way to answer 'What is your greatest weakness?'",
            options: [
                "Saying you have no weaknesses.",
                "Mentioning a real weakness and how you are working to improve it.",
                "Giving a fake weakness like 'I work too hard'.",
                "Talking about a personal weakness unrelated to work."
            ],
            correct: 1,
            explanation: "Honesty combined with a growth mindset is key. Employers value self-awareness and the proactive steps you take to improve yourself."
        },
        {
            question: "What does the STAR method stand for in interviews?",
            options: [
                "Start, Task, Action, Result",
                "Situation, Task, Action, Result",
                "Situation, Time, Action, Review",
                "Strength, Talent, Ability, Role"
            ],
            correct: 1,
            explanation: "The STAR method (Situation, Task, Action, Result) is a structured way to respond to behavioral interview questions by discussing a specific situation and its outcome."
        },
        {
            question: "When should you ask about the salary during the interview process?",
            options: [
                "In the first 5 minutes.",
                "After the employer brings it up or at the end of the final interview.",
                "Never, just wait for the offer.",
                "Before the interview starts."
            ],
            correct: 1,
            explanation: "It's best to wait until the employer has shown clear interest in hiring you or until the final stages to ensure you have maximum leverage."
        },
        {
            question: "Why do employers ask 'Why do you want to work here?'",
            options: [
                "To see if you have researched the company.",
                "To check if you are desperate for any job.",
                "To see if you like the office building.",
                "To know your favorite color."
            ],
            correct: 0,
            explanation: "Employers want to know that you are genuinely interested in their mission and that you've done your homework to see how you fit in."
        },
        {
            question: "What is the ideal length for a typical elevator pitch?",
            options: ["10 seconds", "30-60 seconds", "5 minutes", "15 minutes"],
            correct: 1,
            explanation: "An elevator pitch should be long enough to introduce yourself and your value but short enough to keep the listener engaged—typically under a minute."
        }
    ]
};

export default function MockInterview() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [currentStep, setCurrentStep] = useState(0); 
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showFinalScore, setShowFinalScore] = useState(false);
    
    // New Features States
    const [timeLeft, setTimeLeft] = useState(30);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef(null);
    const timerRef = useRef(null);


    // Camera Logic - Fixed for reliable activation
    const toggleCamera = async () => {
        if (!isCameraActive) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setIsCameraActive(true);
                // We use a small timeout to ensure the video element is rendered before attaching the stream
                setTimeout(() => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                }, 100);
            } catch (err) {
                console.error("Camera error:", err);
                alert("Please grant camera access to use this feature.");
            }
        } else {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            setIsCameraActive(false);
        }
    };

    // Timer Logic
    useEffect(() => {
        if (selectedRole && !showFinalScore && !isAnswered && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isAnswered) {
            submitAnswer();
        }

        return () => clearInterval(timerRef.current);
    }, [selectedRole, showFinalScore, isAnswered, timeLeft]);

    // Reset Timer on Question Change
    useEffect(() => {
        if (selectedRole && !showFinalScore) {
            setTimeLeft(30);
        }
    }, [currentStep, selectedRole]);

    const startInterview = (role) => {
        setSelectedRole(role);
        setCurrentStep(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setShowFinalScore(false);
        setTimeLeft(30);
        
        // Auto-activate camera
        setTimeout(() => {
            if (!isCameraActive) toggleCamera();
        }, 500);
    };

    const handleOptionSelect = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const submitAnswer = () => {
        if (isAnswered) return;
        const currentQuestion = QUESTIONS[selectedRole][currentStep];
        if (selectedOption === currentQuestion.correct) setScore(prev => prev + 1);
        setIsAnswered(true);
        clearInterval(timerRef.current);
    };

    const nextQuestion = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowFinalScore(true);
        }
    };

    return (
        <div className="mock-interview-page">
            <Header />
            
            <div className="mock-interview-wrapper">
                {!selectedRole ? (
                    <div className="role-selection-view animate-in">
                        <div className="interview-header-card">
                            <img src={interviewBanner} alt="Interview" className="interview-banner-img" />
                            <div className="interview-intro-text">
                                <h1>AI Interview Simulator</h1>
                                <p>Sharpen your skills and boost your confidence with our realistic, industry-specific mock interviews.</p>
                            </div>
                        </div>
                        
                        <div className="row g-4 justify-content-center">
                            {[
                                { id: 'frontend', icon: 'fa-code', title: 'Frontend Developer' },
                                { id: 'backend', icon: 'fa-server', title: 'Backend Engineer' },
                                { id: 'hr', icon: 'fa-users-gear', title: 'HR & Behavioral' }
                            ].map(role => (
                                <div key={role.id} className="col-md-4">
                                    <div className="interview-category-card" onClick={() => startInterview(role.id)}>
                                        <div className="category-icon-box">
                                            <i className={`fa-solid ${role.icon}`}></i>
                                        </div>
                                        <h3>{role.title}</h3>
                                        <p className="text-muted small mb-4">Validate your domain knowledge with 5 expert-curated questions.</p>
                                        <button className="btn btn-dark rounded-pill w-100 py-2 mt-auto">Start Session</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : showFinalScore ? (
                    <div className="quiz-main-card text-center animate-in">
                        <h2 className="mb-5">Session Complete</h2>
                        <div className={`final-score-circle ${score >= 3 ? 'score-high' : 'score-low'}`}>
                            {score}/5
                        </div>
                        <h3 className="mb-3">{score >= 3 ? "Great Job!" : "Keep Practicing!"}</h3>
                        <p className="text-muted fs-5 mb-5">Threshold matched. Your technical baseline is stable.</p>
                        <button className="btn btn-dark btn-lg px-5 rounded-pill" onClick={() => setSelectedRole(null)}>
                            Try Another Role
                        </button>
                    </div>
                ) : (
                    <div className="row">
                        {/* Camera Sidebar */}
                        <div className="col-lg-3">
                            <div className="camera-sim-card">
                                <div className="video-viewport">
                                    {isCameraActive ? (
                                        <video ref={videoRef} autoPlay playsInline muted className="live-video"></video>
                                    ) : (
                                        <div className="video-placeholder">
                                            <i className="fa-solid fa-video-slash"></i>
                                            <p>Camera Off</p>
                                        </div>
                                    )}
                                </div>
                                <button className={`camera-toggle-btn ${isCameraActive ? 'active' : ''}`} onClick={toggleCamera}>
                                    <i className={`fa-solid ${isCameraActive ? 'fa-video' : 'fa-video-slash'} me-2`}></i>
                                    {isCameraActive ? 'Disable Camera' : 'Enable Camera'}
                                </button>
                                <div className="mt-3 small text-muted text-center">
                                    Practice your eye contact and body language.
                                </div>
                            </div>
                        </div>

                        {/* Quiz Section */}
                        <div className="col-lg-9">
                            <div className="quiz-main-card animate-in">
                                <div className="question-header">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`timer-badge ${timeLeft < 10 ? 'timer-danger' : ''}`}>
                                            <i className="fa-regular fa-clock me-2"></i>
                                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                                        </div>
                                        <h4 className="m-0 text-capitalize">{selectedRole} Session</h4>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className="small text-muted">Q {currentStep + 1}/5</span>
                                        <div className="modern-quiz-progress">
                                            <div className="quiz-progress-fill" style={{width: `${((currentStep+1)/5)*100}%`}}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="question-text-box">
                                    <h2>{QUESTIONS[selectedRole][currentStep].question}</h2>
                                </div>

                                <div className="options-list-modern">
                                    {QUESTIONS[selectedRole][currentStep].options.map((option, index) => {
                                        let variantClass = "";
                                        if (isAnswered) {
                                            if (index === QUESTIONS[selectedRole][currentStep].correct) variantClass = "correct";
                                            else if (index === selectedOption) variantClass = "wrong";
                                        } else if (selectedOption === index) {
                                            variantClass = "selected";
                                        }

                                        return (
                                            <button
                                                key={index}
                                                className={`option-button-modern ${variantClass}`}
                                                onClick={() => handleOptionSelect(index)}
                                                disabled={isAnswered}
                                            >
                                                <span className="opacity-50 fw-bold">{String.fromCharCode(65 + index)}</span>
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>

                                {isAnswered && (
                                    <div className="explanation-section animate-in">
                                        <div className={`feedback-alert-modern ${selectedOption === QUESTIONS[selectedRole][currentStep].correct ? 'alert-success-modern' : 'alert-danger-modern'}`}>
                                            <i className={`fa-solid ${selectedOption === QUESTIONS[selectedRole][currentStep].correct ? 'fa-circle-check' : 'fa-circle-xmark'} fs-4`}></i>
                                            <div>
                                                {selectedOption === QUESTIONS[selectedRole][currentStep].correct ? 
                                                    "Correct Answer!" : 
                                                    `Incorrect. Correct: ${QUESTIONS[selectedRole][currentStep].options[QUESTIONS[selectedRole][currentStep].correct]}`}
                                            </div>
                                        </div>
                                        <div className="explanation-box">
                                            <h5><i className="fa-solid fa-lightbulb me-2 text-warning"></i> Analysis:</h5>
                                            <p>{QUESTIONS[selectedRole][currentStep].explanation}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4">
                                    {!isAnswered ? (
                                        <button className="btn btn-dark w-100 py-3 rounded-pill fw-bold" onClick={submitAnswer} disabled={selectedOption === null && timeLeft > 0}>
                                            Confirm Answer
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold" onClick={nextQuestion}>
                                            {currentStep < 4 ? "Next Question" : "View Final Result"} <i className="fa-solid fa-arrow-right ms-2"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}
