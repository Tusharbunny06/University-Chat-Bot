import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Mic, Volume2, Bot, User } from 'lucide-react';

const Chatbot = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi! I am the HSR TechRise AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  
  const messagesEndRef = useRef(null);

  // Initialize Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };
  }

  const toggleListen = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Remove markdown characters like asterisks so the bot doesn't say "asterisk"
      const cleanText = text.replace(/[*#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textStr) => {
    const text = textStr || input;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: text.trim() };
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Send to backend
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: text.trim(),
        history: currentHistory.slice(-5), // Send last 5 messages for context
        language: language
      });

      const replyText = res.data.reply;
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: replyText }]);
      speak(replyText);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: 'Sorry, I am having trouble connecting to the server right now.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      
      {isOpen && (
        <div className="chatbot-window" style={{
          width: '380px',
          height: '520px',
          backgroundColor: '#171717',
          border: '1px solid #262626',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '16px',
          animation: 'fadeIn 0.3s ease-out forwards'
        }}>
          {/* Header */}
          <div style={{
            background: '#0a0a0a',
            padding: '16px',
            borderBottom: '1px solid #262626',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#3B82F6', padding: '8px', borderRadius: '12px' }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#fafafa', fontSize: '15px', fontWeight: 600 }}>HSR TechRise Assistant</h3>
                <span style={{ color: '#10B981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', display: 'inline-block' }}></span>
                  Online
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: '#171717',
                  color: '#a3a3a3',
                  border: '1px solid #262626',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="en-US">English</option>
                <option value="es-ES">Español</option>
                <option value="hi-IN">हिन्दी</option>
                <option value="fr-FR">Français</option>
                <option value="de-DE">Deutsch</option>
              </select>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#737373', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="custom-scrollbar" style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#171717' }}>
            {messages.map((msg, idx) => (
              <div key={msg.id} className="animate-fade-in" style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '8px'
              }}>
                {msg.sender === 'bot' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} color="#fff" />
                  </div>
                )}
                
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.sender === 'user' ? '#3B82F6' : '#0a0a0a',
                  color: '#fafafa',
                  border: msg.sender === 'user' ? 'none' : '1px solid #262626',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>
                
                {msg.sender === 'user' && (
                   <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#525252', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <User size={16} color="#fff" />
                   </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={16} color="#fff" />
                </div>
                <div style={{ background: '#0a0a0a', border: '1px solid #262626', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  <div style={{ width: '6px', height: '6px', background: '#737373', borderRadius: '50%', animation: 'typingBounce 1.4s infinite ease-in-out both' }}></div>
                  <div style={{ width: '6px', height: '6px', background: '#737373', borderRadius: '50%', animation: 'typingBounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
                  <div style={{ width: '6px', height: '6px', background: '#737373', borderRadius: '50%', animation: 'typingBounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && !isTyping && (
            <div style={{ padding: '0 16px 12px', display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }} className="custom-scrollbar">
               {['Admissions', 'Courses', 'Fees', 'Placements', 'Facilities', 'Scholarships', 'Hostels', 'Clubs'].map(chip => (
                 <button
                   key={chip}
                   onClick={() => handleSend(`Tell me about ${chip.toLowerCase()}`)}
                   style={{
                     background: '#0a0a0a',
                     border: '1px solid #3B82F6',
                     color: '#60A5FA',
                     padding: '6px 12px',
                     borderRadius: '20px',
                     fontSize: '12px',
                     cursor: 'pointer',
                     whiteSpace: 'nowrap',
                     transition: 'all 0.2s ease',
                     boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                   }}
                   onMouseOver={(e) => e.currentTarget.style.background = '#171717'}
                   onMouseOut={(e) => e.currentTarget.style.background = '#0a0a0a'}
                 >
                   {chip}
                 </button>
               ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '16px', borderTop: '1px solid #262626', background: '#0a0a0a' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                type="button"
                onClick={toggleListen}
                style={{ 
                  background: isListening ? '#EF4444' : '#171717', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '36px', 
                  height: '36px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  color: isListening ? '#FFFFFF' : '#a3a3a3',
                  transition: 'background 0.2s'
                }}
                title={isListening ? "Listening..." : "Click to speak"}
              >
                <Mic size={18} />
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  background: '#171717',
                  border: '1px solid #262626',
                  color: '#fafafa',
                  padding: '10px 16px',
                  borderRadius: '24px',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                style={{ 
                  background: input.trim() && !isTyping ? '#3B82F6' : '#171717',
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  color: input.trim() && !isTyping ? '#fff' : '#525252',
                  transition: 'background 0.2s'
                }}
              >
                <Send size={18} style={{ marginLeft: '2px' }} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: 'none',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)',
            color: '#fff',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
