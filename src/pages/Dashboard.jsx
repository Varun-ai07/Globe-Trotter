import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Calendar, Heart, MapPin, Star, TrendingUp, Wallet, ChevronRight } from 'lucide-react'
import Layout from '../components/common/Layout'
import LoadingSpinner from '../components/common/LoadingSpinner'
import useAuthStore from '../store/authStore'
import useTripStore from '../store/tripStore'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { trips, cities, savedDestinations } = useTripStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Calculate stats
  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.status === 'confirmed')
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget?.total || 0), 0)
  const totalSpent = trips.reduce((sum, trip) => {
    const b = trip.budget || {}
    return sum + (b.transport || 0) + (b.accommodation || 0) + (b.activities || 0) + (b.food || 0)
  }, 0)

  const quickActions = [
    { title: 'Plan New Trip', desc: 'Create a bespoke itinerary', icon: PlusCircle, path: '/create-trip', color: 'from-amber-500 to-orange-600' },
    { title: 'View All Trips', desc: 'Manage your reservations', icon: Calendar, path: '/trips', color: 'from-blue-500 to-indigo-600' },
    { title: 'Saved Places', desc: 'Your collection', icon: Heart, path: '/saved', color: 'from-pink-500 to-rose-600' },
  ]

  const popularDestinations = cities.slice(0, 5)

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 mb-2">Preparing Your Journey</h2>
            <p className="text-white/60 text-sm sm:text-base">Curating exceptional destinations...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          
          {/* Hero Section */}
          <div className="text-center mb-10 w-full">
            <p className="text-white/60 text-sm sm:text-base mb-2">Welcome back</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3">
              {user?.name || 'Adventurer'}
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
              Exceptional journeys curated for discerning travelers
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 w-full">
            <div className="stat-card">
              <div className="stat-icon stat-icon-amber">
                <MapPin className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{trips.length}</h3>
              <p className="text-white/60">Total Trips</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-emerald">
                <TrendingUp className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{upcomingTrips.length}</h3>
              <p className="text-white/60">Upcoming Adventures</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-blue">
                <Wallet className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">${totalBudget.toLocaleString()}</h3>
              <p className="text-white/60">Total Budget</p>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="w-full max-w-2xl mx-auto mb-10">
            <div className="glass-premium p-6 sm:p-8 rounded-3xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">Budget Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Budget</span>
                  <span className="font-bold text-white text-lg">${totalBudget.toLocaleString()}</span>
                </div>
                
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%`,
                      background: 'linear-gradient(90deg, #10b981, #14b8a6)'
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: '#10b981' }}>${totalSpent.toLocaleString()}</p>
                    <p className="text-white/60 text-sm">Allocated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: '#fbbf24' }}>${(totalBudget - totalSpent).toLocaleString()}</p>
                    <p className="text-white/60 text-sm">Remaining</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-10 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-left">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                const iconClasses = ['action-icon-amber', 'action-icon-blue', 'action-icon-pink']
                return (
                  <div 
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className="action-card group"
                  >
                    <div className={`action-icon ${iconClasses[index]} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                    <p className="text-white/60">{action.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Trips */}
          {upcomingTrips.length > 0 && (
            <div className="mb-10 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Upcoming Trips</h2>
                <button 
                  onClick={() => navigate('/trips')}
                  className="btn-glass py-2 px-4 flex items-center gap-2"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingTrips.slice(0, 2).map((trip) => (
                  <div 
                    key={trip.id}
                    onClick={() => navigate(`/trip/${trip.id}`)}
                    className="trip-card group"
                  >
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <img 
                        src={trip.coverPhoto} 
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)' }} />
                      <div className="absolute top-4 right-4">
                        <span className={`badge ${trip.status === 'confirmed' ? 'badge-emerald' : 'badge-amber'}`}>
                          {trip.status === 'confirmed' ? 'Confirmed' : 'Upcoming'}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{trip.name}</h3>
                        <p className="text-white/70 text-sm flex items-center">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>{trip.stops?.[0]?.city?.name || 'Multiple destinations'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-white/70 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{trip.startDate} - {trip.endDate}</span>
                      </div>
                      <div className="text-xl font-bold gradient-text">
                        ${trip.budget?.total?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Destinations */}
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Recommended Destinations</h2>
                <p className="text-white/60 text-sm sm:text-base">Exceptional properties worldwide</p>
              </div>
              <button 
                onClick={() => navigate('/cities')}
                className="btn-glass py-2 px-4 flex items-center gap-2"
              >
                <span>Explore All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {popularDestinations.map((city) => (
                <div 
                  key={city.id}
                  onClick={() => navigate('/cities')}
                  className="destination-card group"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img 
                      src={city.image} 
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)' }} />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-base sm:text-lg font-bold text-white mb-1">{city.name}</h4>
                      <div className="flex items-center text-white/80 text-sm">
                        <Star className="w-4 h-4 mr-1 flex-shrink-0" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                        <span>{city.popularity}</span>
                      </div>
                    </div>
                    {savedDestinations.includes(city.id) && (
                      <div className="absolute top-3 right-3">
                        <Heart className="w-5 h-5" style={{ color: '#f43f5e', fill: '#f43f5e' }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
