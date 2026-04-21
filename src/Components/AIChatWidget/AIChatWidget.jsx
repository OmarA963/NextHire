import React, { useState, useEffect, useRef, useContext } from "react";
import { TheUserContext } from "../UserContext/UserContext";
import "./AIChatWidget.css";

const INITIAL_MESSAGES = [
    { id: 1, type: "ai", text: "Greetings! I am TalentAI Pulse. How can I assist your career evolution today?" }
];

const PRESET_ANSWERS = {
    "cv": "Our Neural CV Builder uses ATS-optimization algorithms. You can find it under AI Services > CV Builder.",
    "interview": "I recommend checking our Mock Interview module. It uses real-time behavioral analysis to prepare you for high-stakes meetings.",
    "jobs": "The Global Job Matrix is updated every 15 minutes. Use the search bar to filter by your specific skill vectors.",
    "hello": "Greetings! I'm TalentAI Pulse, your gateway to the professional future. How can I help you today?",
    "speed": "The Speed Test (Neural Diagnostics) ensures your connection is stable enough for high-speed recruitment protocols.",
    "react": "React is a high-performance UI library. Tip: Master 'hooks' and 'context' to build scalable job-tech platforms like this one!",
    "coding": "The key to elite engineering is consistent practice and understanding underlying data structures. Which stack are you focusing on?",
    "career": "In the AI era, the best career move is to become 'AI-Augmented'. Don't just learn a skill; learn how to use AI to 10x that skill.",
    "salary": "Negotiation is a protocol of value exchange. Always research the market vector for your role before the final meeting.",
    "future": "The future of work is decentralized and AI-driven. TalentAI is designed to keep you ahead of that curve."
};

export default function AIChatWidget() {
    const { userData } = useContext(TheUserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Auto-open greeting
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen && !localStorage.getItem("chat_opened")) {
                setIsOpen(true);
                localStorage.setItem("chat_opened", "true");
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // Scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), type: "user", text: inputText };
        setMessages(prev => [...prev, userMsg]);
        const query = inputText.toLowerCase();
        setInputText("");
        setIsTyping(true);

        // Simulate AI Thinking
        setTimeout(() => {
            let aiText = "";
            
            // 1. Check Keywords
            for (const key in PRESET_ANSWERS) {
                if (query.includes(key)) {
                    aiText = PRESET_ANSWERS[key];
                    break;
                }
            }

            // 2. Personalization
            if (!aiText && query.includes("name") && userData) {
                aiText = `Identity confirmed. You are ${userData.name || userData.fullName}. Your professional profile is under continuous optimization.`;
            }

            // 3. Dynamic General Response HUD Logic
            if (!aiText) {
                if (query.startsWith("how") || query.includes("how to")) {
                    aiText = "Executing 'How-To' instructional protocol... To master this, I suggest breaking the task into 3 sub-nodes and applying iterative testing.";
                } else if (query.startsWith("what") || query.includes("what is")) {
                    aiText = "Scanning Global Knowledge Matrix... My current synthesis suggests this is a critical component of the modern professional landscape.";
                } else if (query.startsWith("why")) {
                    aiText = "Analyzing causal vectors... The 'Why' usually stems from a shift in industry standard protocols toward higher efficiency.";
                } else {
                    aiText = "Scanning Global Database... That is a fascinating inquiry. While I refine my specific data on that topic, I recommend focusing on how it impacts your career roadmap.";
                }
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", text: aiText }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className={`chat-wrapper ${isOpen ? "open" : ""}`}>
            {/* FAB Toggle */}
            <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-comment-dots"></i>}
                {!isOpen && <span className="notification-pulse"></span>}
            </button>

            {/* Chat Window */}
            <div className="chat-window">
                <div className="chat-header">
                    <div className="d-flex align-items-center">
                        <div className="ai-status-dot"></div>
                        <div>
                            <h6 className="m-0 text-white fw-bold">TalentAI Pulse</h6>
                            <small className="text-cyan">Neural Assistant Online</small>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)}><i className="fa-solid fa-minus"></i></button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-bubble ${msg.type}`}>
                            {msg.type === "ai" && <div className="ai-icon"><i className="fa-solid fa-robot"></i></div>}
                            <div className="message-content">{msg.text}</div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message-bubble ai typing">
                            <div className="ai-icon"><i className="fa-solid fa-robot"></i></div>
                            <div className="message-content">
                                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef}></div>
                </div>

                <form className="chat-input-area" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Inquire about your career..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button type="submit" disabled={!inputText.trim()}><i className="fa-solid fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
    );
}
