import React, { useState, useEffect, useRef, useContext } from "react";
import { TheUserContext } from "../UserContext/UserContext";
import { chatAPI } from "../../services/api";
import "./AIChatWidget.css";

const INITIAL_MESSAGES = [
    { id: 'start', type: "ai", text: "Greetings! I am TalentAI Pulse. How can I assist your career evolution today?" }
];

const PRESET_ANSWERS = {
    "cv": "Our Neural CV Builder uses ATS-optimization algorithms. You can find it under AI Services > CV Builder.",
    "interview": "I recommend checking our Mock Interview module. It uses real-time behavioral analysis to prepare you for high-stakes meetings.",
    "jobs": "The Global Job Matrix is updated every 15 minutes. Use the search bar to filter by your specific skill vectors.",
    "hello": "Greetings! I'm TalentAI Pulse, your gateway to the professional future. How can I help you today?",
    "speed": "The Speed Test (Neural Diagnostics) ensures your connection is stable enough for high-speed recruitment protocols.",
};

export default function AIChatWidget() {
    const { userData } = useContext(TheUserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const scrollRef = useRef(null);

    // Auto-open greeting and load history
    useEffect(() => {
        if (userData && isOpen && !sessionId) {
            initChat();
        }
    }, [userData, isOpen]);

    const initChat = async () => {
        try {
            const res = await chatAPI.start(window.location.pathname);
            setSessionId(res.data.chat_id);
        } catch (e) {
            console.warn("Could not start real chat session, using mock mode.");
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const text = inputText;
        const userMsg = { id: Date.now(), type: "user", text: text };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        // Persistent Backend Call
        if (sessionId) {
            try {
                await chatAPI.appendMessage(sessionId, 'user', text);
            } catch (err) { console.error("History sync failed"); }
        }

        // AI Thinking Simulation
        setTimeout(async () => {
            let aiText = "";
            const query = text.toLowerCase();
            
            for (const key in PRESET_ANSWERS) {
                if (query.includes(key)) { aiText = PRESET_ANSWERS[key]; break; }
            }

            if (!aiText && query.includes("name") && userData) {
                aiText = `Identity confirmed. You are ${userData.name}. Your profile is active.`;
            }

            if (!aiText) {
                aiText = "That's an interesting inquiry. I recommend exploring our AI tools to optimize your career roadmap.";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", text: aiText }]);
            setIsTyping(false);

            if (sessionId) {
                try {
                    await chatAPI.appendMessage(sessionId, 'ai', aiText);
                } catch (err) { console.error("History sync failed"); }
            }
        }, 1200);
    };

    return (
        <div className={`chat-wrapper ${isOpen ? "open" : ""}`}>
            <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-comment-dots"></i>}
                {!isOpen && <span className="notification-pulse"></span>}
            </button>

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
