import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './MockInterview.css';
import interviewGraphic from '../../assets/ai_code.png';

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
            correct: 1
        },
        {
            question: "Which hook is used to handle side effects in functional components?",
            options: ["useState", "useContext", "useEffect", "useReducer"],
            correct: 2
        },
        {
            question: "What does JSX stand for?",
            options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Xerox", "JSON Syntax Extension"],
            correct: 0
        },
        {
            question: "In React, how do you pass data from a parent to a child component?",
            options: ["Using State", "Using Refs", "Using Props", "Using Redux only"],
            correct: 2
        },
        {
            question: "Which command is used to create a new React app with Vite?",
            options: ["npm create vite@latest", "npx create-react-app", "npm start react", "create-vite-app"],
            correct: 0
        }
    ],
    backend: [
        {
            question: "Which of the following is a NoSQL database?",
            options: ["PostgreSQL", "MySQL", "MongoDB", "Oracle"],
            correct: 2
        },
        {
            question: "What does the 'S' in REST stand for?",
            options: ["Simple", "State", "System", "Server"],
            correct: 1
        },
        {
            question: "Which Node.js module is used to handle file paths?",
            options: ["fs", "http", "path", "url"],
            correct: 2
        },
        {
            question: "What is the purpose of 'npm'?",
            options: ["Node Program Manager", "Node Package Manager", "New Project Maker", "Network Protocol Manager"],
            correct: 1
        },
        {
            question: "Which HTTP method is typically used to update an existing resource?",
            options: ["GET", "POST", "PUT", "DELETE"],
            correct: 2
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
            correct: 1
        },
        {
            question: "What does the STAR method stand for in interviews?",
            options: [
                "Start, Task, Action, Result",
                "Situation, Task, Action, Result",
                "Situation, Time, Action, Review",
                "Strength, Talent, Ability, Role"
            ],
            correct: 1
        },
        {
            question: "When should you ask about the salary during the interview process?",
            options: [
                "In the first 5 minutes.",
                "After the employer brings it up or at the end of the final interview.",
                "Never, just wait for the offer.",
                "Before the interview starts."
            ],
            correct: 1
        },
        {
            question: "Why do employers ask 'Why do you want to work here?'",
            options: [
                "To see if you have researched the company.",
                "To check if you are desperate for any job.",
                "To see if you like the office building.",
                "To know your favorite color."
            ],
            correct: 0
        },
        {
            question: "What is the ideal length for a typical elevator pitch?",
            options: ["10 seconds", "30-60 seconds", "5 minutes", "15 minutes"],
            correct: 1
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

    const startInterview = (role) => {
        setSelectedRole(role);
        setCurrentStep(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setShowFinalScore(false);
    };

    const handleOptionSelect = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const submitAnswer = () => {
        if (selectedOption === null) return;

        const currentQuestion = QUESTIONS[selectedRole][currentStep];
        if (selectedOption === currentQuestion.correct) {
            setScore(prev => prev + 1);
        }
        setIsAnswered(true);
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
        <div className="container-fluid p-0 login-grand-wrapper">
            <Header />
            <div className="container mock-interview">
                {!selectedRole ? (
                    <div className="role-selection-view">
                        <div className="text-center mb-5">
                            <div className="position-relative d-inline-block mb-4">
                                <div className="glow-effect" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'150%', height:'150%'}}></div>
                                <img src={interviewGraphic} alt="AI Interview" className="img-fluid rounded-4 shadow-lg position-relative z-2" style={{maxWidth: '280px'}} />
                            </div>
                            <h1 className="text-white fw-bold">Neural <span className="text-cyan">Assessment</span></h1>
                            <p className="text-secondary">Simulate high-stakes technical and behavioral benchmarks.</p>
                        </div>
                        
                        <div className="row justify-content-center g-4">
                            {['frontend', 'backend', 'hr'].map(role => (
                                <div key={role} className="col-md-4">
                                    <div className="card h-100 text-center p-4" onClick={() => startInterview(role)}>
                                        <div className="card-body d-flex flex-column align-items-center">
                                            <div className="mb-3">
                                                <i className={`fa-solid ${role === 'frontend' ? 'fa-code' : role === 'backend' ? 'fa-server' : 'fa-users-gear'} fs-1 text-cyan`}></i>
                                            </div>
                                            <h3 className="text-capitalize text-white mb-3">{role} Phase</h3>
                                            <p className="text-secondary small mb-4">5 Specialized technical queries to validate your domain proficiency.</p>
                                            <button className="btn btn-cyan-glow mt-auto w-100">Initialize Quiz</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : showFinalScore ? (
                    <div className="interview-card text-center p-5">
                        <h2 className="text-white mb-4">Assessment Terminated</h2>
                        <div className="final-score-display mb-4">
                            <span className={score >= 3 ? "text-success" : "text-danger"}>{score}/5</span>
                        </div>
                        <p className="text-secondary fs-5 mb-5">
                            {score === 5 ? "Exceptional performance. You've cleared the technical threshold." :
                                score >= 3 ? "Adequate baseline. Some optimization recommended." :
                                    "Threshold not met. Extensive data review required."}
                        </p>
                        <button className="btn btn-cyan-glow btn-lg px-5" onClick={() => setSelectedRole(null)}>
                            Reset Simulation
                        </button>
                    </div>
                ) : (
                    <div className="interview-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-capitalize text-cyan m-0">{selectedRole} Vector <span className="text-secondary fs-6 ms-2">[{currentStep + 1}/5]</span></h4>
                            <div className="progress w-25" style={{height: '6px', background: 'rgba(255,255,255,0.1)'}}>
                                <div className="progress-bar bg-cyan" style={{width: `${((currentStep+1)/5)*100}%`}}></div>
                            </div>
                        </div>

                        <div className="question-box mb-4">
                            <h3>{QUESTIONS[selectedRole][currentStep].question}</h3>
                        </div>

                        <div className="options-list d-grid gap-3 mb-5">
                            {QUESTIONS[selectedRole][currentStep].options.map((option, index) => {
                                let variantClass = "";
                                if (isAnswered) {
                                    if (index === QUESTIONS[selectedRole][currentStep].correct) {
                                        variantClass = "btn-correct";
                                    } else if (index === selectedOption) {
                                        variantClass = "btn-wrong";
                                    }
                                } else if (selectedOption === index) {
                                    variantClass = "btn-option-selected";
                                }

                                return (
                                    <button
                                        key={index}
                                        className={`btn text-start p-3 rounded-3 ${variantClass}`}
                                        onClick={() => handleOptionSelect(index)}
                                        disabled={isAnswered}
                                    >
                                        <span className="me-3 opacity-50">{String.fromCharCode(65 + index)}.</span> {option}
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswered && (
                            <div className={`answer-alert p-3 mb-4 d-flex align-items-center ${selectedOption === QUESTIONS[selectedRole][currentStep].correct ? 'answer-alert-success' : 'answer-alert-danger'}`}>
                                <i className={`fa-solid ${selectedOption === QUESTIONS[selectedRole][currentStep].correct ? 'fa-circle-check' : 'fa-circle-xmark'} me-3 fs-4`}></i>
                                <div>
                                    {selectedOption === QUESTIONS[selectedRole][currentStep].correct ? (
                                        <strong>Validation Successful</strong>
                                    ) : (
                                        <>
                                            <strong>Validation Failed.</strong> Recommended Answer: {QUESTIONS[selectedRole][currentStep].options[QUESTIONS[selectedRole][currentStep].correct]}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            {!isAnswered ? (
                                <button
                                    className="btn btn-cyan-glow w-100 py-3 fw-bold"
                                    onClick={submitAnswer}
                                    disabled={selectedOption === null}
                                >
                                    Submit Answer
                                </button>
                            ) : (
                                <button
                                    className="btn btn-purple-glow w-100 py-3 fw-bold"
                                    onClick={nextQuestion}
                                >
                                    {currentStep < 4 ? "Load Next Query" : "Execute Final Score"} <i className="fa-solid fa-arrow-right ms-2"></i>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
