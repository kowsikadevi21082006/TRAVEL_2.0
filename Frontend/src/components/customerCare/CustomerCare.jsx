import React, { useState, useEffect, useRef } from "react";
import "./customerCare.css";
import { IoChatbubblesOutline, IoClose, IoSend, IoPersonCircleOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";

export default function CustomerCare() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm your Tourism Assistant. How can I help you today?",
      questions: ["How do I book a tour?", "What are the current prices?", "Show me destinations"]
    }
  ]);
  const messagesEndRef = useRef(null);

  const API_BASE = (process.env.REACT_APP_SERVER_URL && process.env.REACT_APP_SERVER_URL.length)
    ? process.env.REACT_APP_SERVER_URL
    : (typeof window !== 'undefined' && window.location && window.location.port === '3000')
      ? 'http://localhost:3030'
      : '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/customer-care`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });
      
      if (!res.ok) throw new Error("Request failed");
      
      const data = await res.json();
      const assistantMsg = {
        role: "assistant",
        content: data.reply || "I'm sorry, I couldn't process that request.",
        questions: data.questions || []
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error: " + err.message, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="chat-bubble" onClick={() => setIsOpen(true)}>
        <IoChatbubblesOutline size={30} />
        <span className="tooltip">Need help?</span>
      </div>
    );
  }

  return (
    <div className="chat-window shadow-lg">
      <div className="chat-header">
        <div className="header-info">
          <RiRobot2Line size={24} />
          <span>Customer Support</span>
        </div>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          <IoClose size={24} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className="message-icon">
              {msg.role === 'assistant' ? <RiRobot2Line /> : <IoPersonCircleOutline />}
            </div>
            <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
              {msg.content}
              {msg.questions && msg.questions.length > 0 && (
                <div className="message-suggestions">
                   {msg.questions.map((q, i) => (
                     <button key={i} className="suggestion-chip" onClick={() => send(q)}>
                       {q}
                     </button>
                   ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-wrapper assistant">
            <div className="message-icon"><RiRobot2Line /></div>
            <div className="message-bubble loading">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="send-btn" onClick={() => send()} disabled={loading || !input.trim()}>
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
}
