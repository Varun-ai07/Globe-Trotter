import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const GlobeTrotterAuth = () => {
  const [view, setView] = useState('login')
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', adventureType: '',
    budgetRange: '', travelStyle: '', preferredDestinations: '', tripDuration: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  // 🎬 SMOOTH PAGE LOAD ANIMATION
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (message) setMessage('')
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setMessage('Please enter email and password')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('Please fill all required fields')
      return
    }
    if (!validateEmail(formData.email)) {
      setMessage('Please enter a valid email')
      return
    }
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setMessage('Welcome aboard! Your preferences saved for personalized recommendations.')
      setView('success')
    }, 2000)
  }

  const resetForm = () => {
    setFormData({
      name: '', email: '', password: '', adventureType: '',
      budgetRange: '', travelStyle: '', preferredDestinations: '', tripDuration: ''
    })
    setMessage('')
    setView('login')
  }

  return (
    <>
      <div className="fixed inset-0 z-0"
           style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=90')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundAttachment: 'fixed',
             filter: 'brightness(1.2) contrast(1.1) blur(0.5px)'
           }} />
      
      <div className="min-h-screen relative flex items-center justify-center px-6 py-12 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/35" />
        
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          * { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            font-weight: 500; 
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            letter-spacing: -0.01em;
          }

          /* 🎬 SMOOTH PAGE TRANSITION */
          .page-enter {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          .page-enter-active {
            opacity: 1;
            transform: translateY(0) scale(1);
            transition: all 0.8s cubic-bezier(0.34,1.56,0.64,1);
          }

          .view-transition {
            transition: all 0.6s cubic-bezier(0.34,1.56,0.64,1);
          }
          
          .universal-text { 
            color: #ffffff !important; 
            text-shadow: 0 4px 20px rgba(0,0,0,0.9);
          }
          
          .h1-hero { 
            font-size: clamp(2.6rem, 8vw, 3.8rem); 
            font-weight: 900; 
            line-height: 0.92;
            letter-spacing: -0.03em;
            margin-bottom: 1.2rem;
            max-width: 500px;
          }
          
          .h2-subtitle { 
            font-size: clamp(1.25rem, 4vw, 1.65rem); 
            font-weight: 400; 
            margin-bottom: 3.5rem;
            max-width: 450px;
            opacity: 0.95;
          }
          
          .floating-field {
            position: relative;
            margin-bottom: 2rem;
            transition: all 0.4s ease;
          }

          /* 🎨 GLOWING INPUTS (GLASS) */
          .floating-input {
            width: 100%; height: 52px; padding: 0 24px;
            font-size: 16px; font-weight: 500;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(50px) saturate(200%);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 24px;
            color: #ffffff !important;
            transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
            box-shadow: 
              0 25px 80px rgba(0,0,0,0.5),
              inset 0 1px 0 rgba(255,255,255,0.4);
          }
          
          .floating-input:focus, .floating-input:hover {
            outline: none;
            background: rgba(255,255,255,0.25);
            border-color: rgba(251,191,36,0.9);
            box-shadow: 
              0 0 0 4px rgba(251,191,36,0.2),
              0 40px 120px rgba(0,0,0,0.7),
              inset 0 1px 0 rgba(255,255,255,0.8),
              0 0 40px rgba(251,191,36,0.15);
            transform: translateY(-4px) scale(1.02);
          }
          
          .floating-input::placeholder { 
            color: rgba(255,255,255,0.6); 
            font-weight: 400; 
          }

          /* ✅ FIXED: GLASS DROPDOWN + BLACK OPTIONS */
          .refined-select {
            background: rgba(255,255,255,0.18) !important;
            backdrop-filter: blur(60px) saturate(200%);
            border: 2px solid rgba(255,255,255,0.4) !important;
            border-radius: 24px;
            color: #ffffff !important;
            font-size: 16px;
            font-weight: 600;
            padding: 16px 28px;
            height: 56px;
            width: 100%;
            cursor: pointer;
            transition: all 0.6s cubic-bezier(0.34,1.56,0.64,1);
            box-shadow: 
              0 30px 100px rgba(0,0,0,0.6),
              inset 0 1px 0 rgba(255,255,255,0.4),
              0 0 30px rgba(251,191,36,0.1);
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 24px center;
            background-size: 20px;
          }

          .refined-select:hover {
            background: rgba(255,255,255,0.28) !important;
            border-color: rgba(251,191,36,1) !important;
            transform: translateY(-6px) scale(1.03);
            box-shadow: 
              0 45px 140px rgba(0,0,0,0.8),
              inset 0 1px 0 rgba(255,255,255,0.6),
              0 0 60px rgba(251,191,36,0.3);
          }

          .refined-select:focus {
            background: rgba(255,255,255,0.35) !important;
            border-color: rgba(251,191,36,1) !important;
            box-shadow: 
              0 0 0 6px rgba(251,191,36,0.25),
              0 50px 160px rgba(0,0,0,0.9),
              0 0 80px rgba(251,191,36,0.4);
            transform: translateY(-8px) scale(1.04);
          }

          /* 🔥 BLACK DROPDOWN OPTIONS */
          .refined-select option {
            background: #1a1a1a !important;
            color: #ffffff !important;
            padding: 12px 16px !important;
            font-weight: 500 !important;
          }

          .primary-button {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
            border: none;
            color: #1f2937 !important;
            font-weight: 800;
            font-size: 16px;
            padding: 20px 44px;
            border-radius: 24px;
            width: 100%;
            box-shadow: 
              0 40px 120px rgba(251,191,36,0.5),
              inset 0 1px 0 rgba(255,255,255,1);
            transition: all 0.7s cubic-bezier(0.34,1.56,0.64,1);
            position: relative;
            overflow: hidden;
          }
          
          .primary-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
            transition: left 1s ease;
          }
          
          .primary-button:hover:not(:disabled)::before {
            left: 100%;
          }
          
          .primary-button:hover:not(:disabled) {
            transform: translateY(-8px) scale(1.05);
            box-shadow: 
              0 60px 160px rgba(251,191,36,0.7),
              inset 0 1px 0 rgba(255,255,255,1);
          }

          .message-card {
            background: linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15));
            backdrop-filter: blur(40px);
            border: 2px solid rgba(251,191,36,0.5);
            color: #1f2937 !important;
            padding: 20px 32px;
            border-radius: 24px;
            font-size: 16px;
            font-weight: 600;
            max-width: 480px;
            margin: 0 auto 2rem;
            text-align: center;
            box-shadow: 0 35px 120px rgba(251,191,36,0.35);
            animation: glowPulse 2s ease-in-out infinite alternate;
          }

          @keyframes glowPulse {
            0% { box-shadow: 0 35px 120px rgba(251,191,36,0.35); }
            100% { box-shadow: 0 35px 140px rgba(251,191,36,0.55); }
          }

          .secondary-button {
            color: #ffffff !important;
            font-weight: 600;
            font-size: 15px;
            padding: 16px 28px;
            border: 2px solid rgba(255,255,255,0.4);
            backdrop-filter: blur(30px);
            border-radius: 20px;
            background: transparent;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
            text-shadow: 0 4px 20px rgba(0,0,0,0.9);
            text-decoration: none;
            width: 100%;
            justify-content: center;
          }
          
          .secondary-button:hover {
            border-color: rgba(251,191,36,0.7);
            background: rgba(251,191,36,0.08);
            transform: translateX(6px);
          }

          @media (max-width: 768px) {
            .floating-input, .refined-select, .primary-button { margin-left: auto; margin-right: auto; }
          }
        `}</style>

        <div className={`relative z-20 w-full max-w-2xl mx-auto space-y-14 ${isVisible ? 'page-enter-active' : 'page-enter'}`}>
          <div className="text-center view-transition">
            <h1 className="h1-hero universal-text mx-auto">
              {view === 'signup' ? 'New Adventure Awaits' : 'Welcome Back Adventurer'}
            </h1>
            <h2 className="h2-subtitle universal-text mx-auto">
              {view === 'login' && 'Hello there! Ready to explore?'}
              {view === 'signup' && 'Share your travel preferences for perfect recommendations'}
              {view === 'success' && 'Your journey begins now'}
            </h2>
          </div>

          {view === 'success' && (
            <div className="max-w-md mx-auto text-center space-y-10 view-transition">
              <div className="success-icon" style={{
                width: '80px', height: '80px', background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: '300', color: 'white', boxShadow: '0 35px 100px rgba(16,185,129,0.4)',
                border: '3px solid rgba(255,255,255,0.3)', margin: '0 auto 2rem'
              }}>✓</div>
              <div className="message-card text-lg">{message}</div>
              <div className="space-y-4">
                <button onClick={() => navigate('/dashboard')} className="primary-button w-full font-semibold">
                  Begin Journey
                </button>
                <button onClick={resetForm} className="secondary-button">Return to Login</button>
              </div>
            </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-8 view-transition">
              {message && !loading && <div className="message-card">{message}</div>}
              
              <div className="floating-field">
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="floating-input" 
                  placeholder="Email address"
                  required 
                  autoComplete="email" 
                />
              </div>
              
              <div className="floating-field">
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  className="floating-input" 
                  placeholder="Password"
                  required 
                  autoComplete="current-password" 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="primary-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-gray-400/30 border-t-amber-600 rounded-full animate-spin mr-3 inline-block" />
                    Signing In
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              
              <div className="text-center pt-6">
                <button type="button" onClick={() => setView('signup')} className="secondary-button">
                  Create New Account
                </button>
              </div>
            </form>
          )}

          {view === 'signup' && (
            <form onSubmit={handleSignup} className="max-w-lg mx-auto space-y-8 view-transition">
              {message && !loading && <div className="message-card">{message}</div>}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="floating-field">
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="floating-input" 
                    placeholder="Full name"
                    required 
                  />
                </div>
                <div className="floating-field">
                  <input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className="floating-input" 
                    placeholder="Email address"
                    required 
                    autoComplete="email" 
                  />
                </div>
              </div>

              <div className="floating-field">
                <input 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  className="floating-input" 
                  placeholder="Create password"
                  required 
                />
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="floating-field">
                    <select 
                      name="adventureType" 
                      value={formData.adventureType} 
                      onChange={handleInputChange} 
                      className="refined-select" 
                      required
                    >
                      <option value="">✨ Adventure preference</option>
                      <option value="beach">🏖️ Beach Getaway</option>
                      <option value="mountain">⛰️ Mountain Trek</option>
                      <option value="city">🏙️ City Exploration</option>
                      <option value="roadtrip">🚗 Road Trip</option>
                      <option value="cultural">🌍 Cultural Immersion</option>
                    </select>
                  </div>
                  <div className="floating-field">
                    <select 
                      name="budgetRange" 
                      value={formData.budgetRange} 
                      onChange={handleInputChange} 
                      className="refined-select" 
                      required
                    >
                      <option value="">💰 Budget range</option>
                      <option value="budget">$500 - $1500</option>
                      <option value="comfort">$1500 - $5000</option>
                      <option value="luxury">$5000+</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="floating-field">
                    <select 
                      name="travelStyle" 
                      value={formData.travelStyle} 
                      onChange={handleInputChange} 
                      className="refined-select" 
                      required
                    >
                      <option value="">👥 Travel style</option>
                      <option value="solo">🌟 Solo Travel</option>
                      <option value="couple">💕 With Partner</option>
                      <option value="family">👨‍👩‍👧‍👦 Family</option>
                      <option value="friends">👯 Friends</option>
                    </select>
                  </div>
                  <div className="floating-field">
                    <select 
                      name="tripDuration" 
                      value={formData.tripDuration} 
                      onChange={handleInputChange} 
                      className="refined-select" 
                      required
                    >
                      <option value="">⏱️ Duration</option>
                      <option value="weekend">🌙 Weekend (2-4 days)</option>
                      <option value="week">📅 1 Week</option>
                      <option value="twoweeks">🌞 2 Weeks</option>
                      <option value="month">🌍 1 Month+</option>
                    </select>
                  </div>
                </div>

                <div className="floating-field">
                  <input 
                    name="preferredDestinations" 
                    value={formData.preferredDestinations} 
                    onChange={handleInputChange} 
                    className="floating-input" 
                    placeholder="🌍 Favorite destinations (optional)"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-gray-400/30 border-t-amber-600 rounded-full animate-spin mr-3 inline-block" />
                    Creating Account
                  </>
                ) : (
                  '🚀 Create Account'
                )}
              </button>

              <div className="text-center pt-8">
                <button type="button" onClick={() => setView('login')} className="secondary-button">
                  ← Return to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default GlobeTrotterAuth
