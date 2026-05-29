import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import { GraduationCap } from 'lucide-react';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '4rem 5%',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* Header Area */}
      <header style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <GraduationCap size={22} color="#ffffff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px' }}>
                HSR
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#60A5FA', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                TechRise
              </span>
            </div>
         </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        
        <div className="animate-fade-in">
          <h1 className="hero-title" style={{ fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Your Academic Journey,<br/> <span className="text-accent">Simplified.</span>
          </h1>
          <p className="hero-subtitle" style={{ color: '#94A3B8', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            Have questions about admissions, courses, or campus life? Our intelligent AI Assistant is available 24/7 to give you instant, accurate answers.
          </p>
          
          <button 
            onClick={() => setIsChatOpen(true)}
            style={{
               background: '#3B82F6',
               color: 'white',
               border: 'none',
               padding: '16px 32px',
               fontSize: '1.1rem',
               fontWeight: 600,
               borderRadius: '12px',
               cursor: 'pointer',
               boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
               transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
               e.currentTarget.style.transform = 'translateY(-2px)';
               e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
               e.currentTarget.style.transform = 'translateY(0)';
               e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.39)';
            }}
          >
            Start Chatting
          </button>
        </div>

        {/* Feature Grid */}
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', width: '100%', marginTop: '5rem', animationDelay: '0.2s' }}>
           <div className="clean-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', margin: '0 0 0.5rem 0' }}>Admissions</h3>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem' }}>Instant information on eligibility and deadlines.</p>
           </div>
           <div className="clean-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', margin: '0 0 0.5rem 0' }}>Courses & Fees</h3>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem' }}>Detailed breakdowns of B.Tech and M.Tech programs.</p>
           </div>
           <div className="clean-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏢</div>
              <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', margin: '0 0 0.5rem 0' }}>Campus Life</h3>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem' }}>Explore hostels, sports facilities, and clubs.</p>
           </div>
        </div>
      </main>

      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}

export default App;
