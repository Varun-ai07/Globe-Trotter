import { useState } from 'react'
import { User, Mail, MapPin, Camera, Heart, Globe, Settings, Shield, Save, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/common/Layout'
import GlassCard from '../components/common/GlassCard'
import PageHeader from '../components/common/PageHeader'
import useAuthStore from '../store/authStore'
import useTripStore from '../store/tripStore'
import useUIStore from '../store/uiStore'

const UserProfile = () => {
  const navigate = useNavigate()
  const { user, updateProfile, logout } = useAuthStore()
  const { savedDestinations, cities, trips } = useTripStore()
  const { addToast } = useUIStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    currency: user?.currency || 'USD',
    language: user?.language || 'en'
  })

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
    addToast({ type: 'success', message: 'Profile updated successfully!' })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    addToast({ type: 'info', message: 'Logged out successfully' })
  }

  const savedCities = cities.filter(city => savedDestinations.includes(city.id))
  const completedTrips = trips.filter(t => t.status === 'completed')

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="My Profile"
            subtitle="Manage your account and preferences"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <GlassCard variant="premium" className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full gradient-amber flex items-center justify-center text-3xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-white mb-1">{user?.name || 'Traveler'}</h2>
                <p className="text-white/60 text-sm mb-4">
                  {user?.location || 'Location not set'}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{trips.length}</p>
                    <p className="text-white/60 text-xs">Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{savedDestinations.length}</p>
                    <p className="text-white/60 text-xs">Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{completedTrips.length}</p>
                    <p className="text-white/60 text-xs">Completed</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full btn-glass py-3 mt-4 flex items-center justify-center space-x-2 text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </GlassCard>
            </div>

            {/* Edit Profile */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard variant="premium">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-amber-400" />
                    Profile Information
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-glass py-2 px-4 text-sm"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="btn-primary py-2 px-4 text-sm flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                        className="input-glass pl-12 w-full"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className="input-glass pl-12 w-full"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={3}
                      className="input-glass w-full resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        disabled={!isEditing}
                        className="input-glass pl-12 w-full"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Preferences */}
              <GlassCard variant="premium">
                <h3 className="text-xl font-bold text-white flex items-center mb-6">
                  <Settings className="w-5 h-5 mr-2 text-amber-400" />
                  Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      disabled={!isEditing}
                      className="select-glass w-full"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      disabled={!isEditing}
                      className="select-glass w-full"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              {/* Saved Destinations */}
              <GlassCard variant="premium">
                <h3 className="text-xl font-bold text-white flex items-center mb-6">
                  <Heart className="w-5 h-5 mr-2 text-rose-400" />
                  Saved Destinations
                </h3>

                {savedCities.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {savedCities.slice(0, 6).map(city => (
                      <div
                        key={city.id}
                        className="relative h-32 rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => navigate(`/cities/${city.id}`)}
                      >
                        <img
                          src={city.image}
                          alt={city.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                        <div className="absolute bottom-3 left-3">
                          <p className="text-white font-medium text-sm">{city.name}</p>
                          <p className="text-white/60 text-xs">{city.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-white/50 py-8">
                    No saved destinations yet. Start exploring!
                  </p>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UserProfile
