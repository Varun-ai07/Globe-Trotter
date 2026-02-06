import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { MapPin, Calendar, DollarSign, Clock, Share2, Copy, Facebook, Twitter, Mail, Check, Globe, Users, Plane } from 'lucide-react'
import Layout from '../components/common/Layout'
import GlassCard from '../components/common/GlassCard'
import useTripStore from '../store/tripStore'
import useUIStore from '../store/uiStore'

const PublicItinerary = () => {
  const { publicUrl } = useParams()
  const navigate = useNavigate()
  const { trips } = useTripStore()
  const { addToast } = useUIStore()
  const trip = useMemo(() => trips.find(t => t.publicUrl === publicUrl || t.id === publicUrl), [publicUrl, trips])
  const [copied, setCopied] = useState(false)
  const [expandedDay, setExpandedDay] = useState(0)

  if (!trip) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <GlassCard className="text-center max-w-md">
            <Globe className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Itinerary Not Found</h2>
            <p className="text-white/60 mb-6">This itinerary may have been removed or the link is incorrect.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Go to Homepage
            </button>
          </GlassCard>
        </div>
      </Layout>
    )
  }

  const shareUrl = `${window.location.origin}/share/${trip.publicUrl || trip.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      addToast({ type: 'success', message: 'Link copied to clipboard!' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast({ type: 'error', message: 'Failed to copy link' })
    }
  }

  const handleShare = (platform) => {
    const text = `Check out my trip to ${trip.name}!`
    let url = ''
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(`Trip: ${trip.name}`)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`
        break
    }
    
    if (url) window.open(url, '_blank')
  }

  const totalCost = trip.stops?.reduce((sum, stop) => 
    sum + (stop.activities?.reduce((aSum, a) => aSum + (a.cost || 0), 0) || 0), 0
  ) || 0

  const totalDays = trip.startDate && trip.endDate 
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : trip.stops?.length || 0

  const totalActivities = trip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden mb-8">
            <div className="h-64 md:h-80 relative">
              <img
                src={trip.coverImage || trip.stops?.[0]?.city?.image || '/we.jpeg'}
                alt={trip.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), transparent)' }} />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="w-5 h-5 text-amber-400" />
                <span className="text-white/70 text-sm">Public Itinerary</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{trip.name}</h1>
              {trip.startDate && (
                <p className="text-white/70 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <GlassCard className="text-center py-3 sm:py-4 px-2">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-white">{trip.stops?.length || 0}</p>
              <p className="text-white/60 text-xs sm:text-sm">Cities</p>
            </GlassCard>
            <GlassCard className="text-center py-3 sm:py-4 px-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-white">{totalDays}</p>
              <p className="text-white/60 text-xs sm:text-sm">Days</p>
            </GlassCard>
            <GlassCard className="text-center py-3 sm:py-4 px-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-white">{totalActivities}</p>
              <p className="text-white/60 text-xs sm:text-sm">Activities</p>
            </GlassCard>
            <GlassCard className="text-center py-3 sm:py-4 px-2">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 mx-auto mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-white">${totalCost}</p>
              <p className="text-white/60 text-xs sm:text-sm">Est. Cost</p>
            </GlassCard>
          </div>

          {/* Share Options */}
          <GlassCard variant="premium" className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-bold mb-1">Share This Trip</h3>
                <p className="text-white/60 text-sm">Let others be inspired by your itinerary</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={handleCopyLink}
                  className="btn-glass py-2 px-4 flex items-center space-x-2"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 rounded-full bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40 flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 rounded-full bg-[#4267B2]/20 hover:bg-[#4267B2]/40 flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5 text-[#4267B2]" />
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Mail className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Itinerary */}
          <GlassCard variant="premium">
            <h2 className="text-2xl font-bold text-white mb-6">Itinerary</h2>
            
            <div className="space-y-6">
              {trip.stops?.map((stop, index) => (
                <div key={stop.id || index} className="relative">
                  {/* Connection Line */}
                  {index < trip.stops.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.5), transparent)' }} />
                  )}
                  
                  {/* Stop Header */}
                  <div 
                    className="flex items-start space-x-4 cursor-pointer"
                    onClick={() => setExpandedDay(expandedDay === index ? -1 : index)}
                  >
                    <div 
                      className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${expandedDay !== index ? 'bg-white/10' : ''}`}
                      style={expandedDay === index ? { background: 'linear-gradient(135deg, #fbbf24, #f97316)' } : {}}
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">{stop.city?.name || 'Unknown City'}</h3>
                          <p className="text-white/60 text-sm flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {stop.city?.country}
                          </p>
                        </div>
                        <span className="text-amber-400 font-medium">
                          {stop.duration || 1} day{(stop.duration || 1) > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Activities (Expandable) */}
                  {expandedDay === index && stop.activities && stop.activities.length > 0 && (
                    <div className="ml-16 mt-4 space-y-3 animate-fadeIn">
                      {stop.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="glass p-4 rounded-xl">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{activity.name}</h4>
                              <p className="text-white/60 text-sm mt-1">{activity.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm">
                                <span className="text-white/60 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {activity.duration}h
                                </span>
                                <span className="badge-category text-xs">{activity.category}</span>
                              </div>
                            </div>
                            <span className="text-emerald-400 font-bold">${activity.cost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {expandedDay === index && (!stop.activities || stop.activities.length === 0) && (
                    <div className="ml-16 mt-4 glass p-4 rounded-xl text-center text-white/50">
                      No activities planned for this stop
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  )
}

export default PublicItinerary
