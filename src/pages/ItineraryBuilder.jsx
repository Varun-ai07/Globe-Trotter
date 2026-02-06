import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, MapPin, Calendar, Clock, Trash2, GripVertical, DollarSign, ChevronDown, ChevronUp, Search } from 'lucide-react'
import Layout from '../components/common/Layout'
import GlassCard from '../components/common/GlassCard'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import useTripStore from '../store/tripStore'
import useUIStore from '../store/uiStore'

const ItineraryBuilder = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { 
    trips, cities, activities, 
    setCurrentTrip, addStop, removeStop, 
    addActivity, removeActivity
  } = useTripStore()
  const { openModal, closeModal, addToast } = useUIStore()
  
  // Use useMemo for derived state
  const trip = useMemo(() => trips.find(t => t.id === tripId), [tripId, trips])
  
  const [selectedStop, setSelectedStop] = useState(null)
  const [citySearch, setCitySearch] = useState('')
  const [activitySearch, setActivitySearch] = useState('')
  
  // Track which stops have been expanded (new stops default to expanded)
  const [collapsedStops, setCollapsedStops] = useState({})
  
  // Compute expanded state: all stops expanded unless explicitly collapsed
  const expandedStops = useMemo(() => {
    const expanded = {}
    trip?.stops?.forEach(stop => {
      expanded[stop.id] = !(stop.id in collapsedStops && collapsedStops[stop.id])
    })
    return expanded
  }, [trip, collapsedStops])

  useEffect(() => {
    if (trip) {
      setCurrentTrip(tripId)
    } else if (tripId) {
      navigate('/trips')
    }
  }, [trip, tripId, navigate, setCurrentTrip])

  const toggleStopExpand = (stopId) => {
    setCollapsedStops(prev => ({ ...prev, [stopId]: !prev[stopId] }))
  }

  const handleAddStop = (city) => {
    const newStop = {
      cityId: city.id,
      arrivalDate: trip.startDate,
      departureDate: trip.endDate
    }
    addStop(tripId, newStop)
    closeModal()
    addToast({ type: 'success', message: `${city.name} added to your trip!` })
  }

  const handleRemoveStop = (stopId) => {
    if (window.confirm('Remove this stop and all its activities?')) {
      removeStop(tripId, stopId)
      addToast({ type: 'success', message: 'Stop removed' })
    }
  }

  const handleAddActivity = (activity) => {
    if (!selectedStop) return
    const activityData = {
      activityId: activity.id,
      scheduledDate: selectedStop.arrivalDate,
      scheduledTime: '10:00'
    }
    addActivity(tripId, selectedStop.id, activityData)
    closeModal()
    addToast({ type: 'success', message: `${activity.name} added!` })
  }

  const handleRemoveActivity = (stopId, activityId) => {
    removeActivity(tripId, stopId, activityId)
    addToast({ type: 'success', message: 'Activity removed' })
  }

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    city.country.toLowerCase().includes(citySearch.toLowerCase())
  )

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(activitySearch.toLowerCase()) ||
    activity.category.toLowerCase().includes(activitySearch.toLowerCase())
  )

  const calculateTotalCost = () => {
    if (!trip) return 0
    let total = 0
    trip.stops?.forEach(stop => {
      stop.activities?.forEach(activity => {
        total += activity.cost || 0
      })
    })
    return total
  }

  if (!trip) return null

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <PageHeader
            title={trip.name}
            subtitle="Build your perfect itinerary"
            backTo="/trips"
            backLabel="Back to Trips"
          >
            <button
              onClick={() => openModal('addStop')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Stop</span>
            </button>
          </PageHeader>

          {/* Trip Overview */}
          <GlassCard variant="premium" className="mb-6 sm:mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-white/60 text-sm mb-1">Duration</p>
                <p className="text-xl font-bold text-white">
                  {trip.startDate && trip.endDate 
                    ? `${Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days`
                    : 'Not set'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm mb-1">Destinations</p>
                <p className="text-xl font-bold text-white">{trip.stops?.length || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm mb-1">Activities</p>
                <p className="text-xl font-bold text-white">
                  {trip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm mb-1">Activities Cost</p>
                <p className="text-xl font-bold gradient-text">${calculateTotalCost().toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>

          {/* Stops List */}
          <div className="space-y-6">
            {trip.stops?.length === 0 ? (
              <GlassCard className="text-center py-12">
                <MapPin className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No destinations yet</h3>
                <p className="text-white/60 mb-6">Start by adding your first stop</p>
                <button
                  onClick={() => openModal('addStop')}
                  className="btn-primary"
                >
                  Add Your First Stop
                </button>
              </GlassCard>
            ) : (
              trip.stops.map((stop, index) => (
                <GlassCard key={stop.id} className="overflow-hidden" hover={false}>
                  {/* Stop Header */}
                  <div 
                    className="flex items-center justify-between gap-3 cursor-pointer"
                    onClick={() => toggleStopExpand(stop.id)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-amber flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <img
                          src={stop.city?.image}
                          alt={stop.city?.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover hidden sm:block flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-white truncate">{stop.city?.name}</h3>
                          <p className="text-white/60 text-xs sm:text-sm flex items-center">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{stop.arrivalDate} - {stop.departureDate}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="text-white/60 text-xs sm:text-sm hidden sm:block">
                        {stop.activities?.length || 0} activities
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveStop(stop.id) }}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      </button>
                      {expandedStops[stop.id] 
                        ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                        : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                      }
                    </div>
                  </div>

                  {/* Stop Content (Expandable) */}
                  {expandedStops[stop.id] && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      {/* Activities */}
                      <div className="space-y-3">
                        {stop.activities?.length === 0 ? (
                          <p className="text-white/50 text-center py-4">No activities added yet</p>
                        ) : (
                          stop.activities.map(activity => (
                            <div 
                              key={activity.id}
                              className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-white/30 cursor-grab flex-shrink-0 hidden sm:block" />
                                <img
                                  src={activity.image}
                                  alt={activity.name}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-white text-sm sm:text-base truncate">{activity.name}</h4>
                                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/60">
                                    <span className="flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {activity.duration}h
                                    </span>
                                    <span className="flex items-center">
                                      <DollarSign className="w-3 h-3" />
                                      {activity.cost}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveActivity(stop.id, activity.id)}
                                className="p-1.5 sm:p-2 rounded-lg hover:bg-red-500/20 transition-colors flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Activity Button */}
                      <button
                        onClick={() => { setSelectedStop(stop); openModal('addActivity') }}
                        className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Activity</span>
                      </button>
                    </div>
                  )}
                </GlassCard>
              ))
            )}
          </div>

          {/* Add Stop Modal */}
          <Modal name="addStop" title="Add Destination" size="lg">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="input-glass pl-12 w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredCities.map(city => (
                  <button
                    key={city.id}
                    onClick={() => handleAddStop(city)}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left"
                  >
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{city.name}</h4>
                      <p className="text-white/60 text-sm">{city.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Modal>

          {/* Add Activity Modal */}
          <Modal name="addActivity" title="Add Activity" size="lg">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="input-glass pl-12 w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredActivities.map(activity => (
                  <button
                    key={activity.id}
                    onClick={() => handleAddActivity(activity)}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left"
                  >
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{activity.name}</h4>
                      <div className="flex items-center space-x-2 text-white/60 text-sm">
                        <span>${activity.cost}</span>
                        <span>•</span>
                        <span>{activity.duration}h</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  )
}

export default ItineraryBuilder
