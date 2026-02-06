import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Globe, Plane } from 'lucide-react'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'

const Login = () => {
  const navigate = useNavigate()
  const { login, signup, isAuthenticated } = useAuthStore()
  const { addToast } = useUIStore()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          addToast({ type: 'error', message: 'Passwords do not match' })
          setLoading(false)
          return
        }
        if (formData.password.length < 6) {
          addToast({ type: 'error', message: 'Password must be at least 6 characters' })
          setLoading(false)
          return
        }
        await signup(formData.name, formData.email, formData.password)
        addToast({ type: 'success', message: 'Account created successfully!' })
      } else {
        await login(formData.email, formData.password)
        addToast({ type: 'success', message: 'Welcome back!' })
      }
      navigate('/')
    } catch (error) {
      addToast({ type: 'error', message: error.message || 'Authentication failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ 
          backgroundImage: 'url(/we.jpeg)',
          transform: 'scale(1.1)',
          animation: 'slowZoom 30s infinite alternate'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/60 backdrop-blur-sm" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`,
              boxShadow: '0 0 10px 2px rgba(245, 158, 11, 0.3)'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fadeInDown">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-amber mb-4 shadow-2xl hover:scale-105 transition-transform duration-300 floating">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
            GlobeTrotter
          </h1>
          <p className="text-amber-100/80 text-lg font-light tracking-wide">Your journey begins here</p>
        </div>

        {/* Main Card - Perfect Rectangle */}
        <div className="w-full max-w-md">
          <div className="glass-premium rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Toggle Tab */}
            <div className="flex bg-gradient-to-r from-white/5 to-white/10 p-1">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  !isSignUp 
                    ? 'gradient-amber text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isSignUp 
                    ? 'gradient-amber text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <div className="px-8 py-12 sm:py-14">
              <form onSubmit={handleSubmit} className="space-y-8">
                {isSignUp && (
                  <div className="space-y-4">
                    <label className="text-white/90 text-sm font-medium tracking-wide">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-white/60 group-focus-within:text-amber-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="input-glass pl-12 w-full transition-all duration-300 focus:ring-2 focus:ring-amber-400/50"
                        placeholder="Enter your full name"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-white/90 text-sm font-medium tracking-wide">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-white/60 group-focus-within:text-amber-400 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-glass pl-12 w-full transition-all duration-300 focus:ring-2 focus:ring-amber-400/50"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-white/90 text-sm font-medium tracking-wide">Password</label>
                    {!isSignUp && (
                      <Link 
                        to="/forgot-password" 
                        className="text-amber-400 hover:text-amber-300 text-sm transition-colors duration-300 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-white/60 group-focus-within:text-amber-400 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="input-glass pl-12 pr-12 w-full transition-all duration-300 focus:ring-2 focus:ring-amber-400/50"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-4">
                    <label className="text-white/90 text-sm font-medium tracking-wide">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-white/60 group-focus-within:text-amber-400 transition-colors" />
                      </div>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="input-glass pl-12 w-full transition-all duration-300 focus:ring-2 focus:ring-amber-400/50"
                        placeholder="Confirm your password"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                {!isSignUp && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-3 text-white/80 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-5 h-5 rounded border-2 border-white/30 peer-checked:border-amber-400 peer-checked:bg-amber-400 flex items-center justify-center transition-all duration-300 group-hover:border-amber-300">
                          <svg 
                            className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm select-none">Remember me</span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-amber text-white font-semibold py-4 rounded-xl text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plane className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        <span>{isSignUp ? 'Create Account' : 'Sign In to Continue'}</span>
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 py-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white/60 tracking-wide text-xs font-medium rounded-lg transition-all duration-300">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="btn-glass py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group">
                  <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  </svg>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Google</span>
                </button>
                <button className="btn-glass py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group">
                  <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">GitHub</span>
                </button>
              </div>
            </div>

            {/* Footer of Card */}
            <div className="px-8 pb-8 pt-6 border-t border-white/10">
              <p className="text-center text-white/60 text-sm leading-relaxed">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-amber-400 hover:text-amber-300 transition-colors duration-300 hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-amber-400 hover:text-amber-300 transition-colors duration-300 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Toggle Link */}
          <div className="text-center mt-6">
            <p className="text-white/60 text-sm">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-300 hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login