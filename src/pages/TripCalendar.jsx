import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { format, addDays, startOfDay, differenceInDays } from 'date-fns'
import { ChevronLeft, ChevronRight, MapPin, Clock, DollarSign, Sun, Moon, Calendar as CalendarIcon } from 'lucide-react'
import Layout from '../components/common/Layout'
import GlassCard from '../components/common/GlassCard'
import PageHeader from '../components/common/PageHeader'
import useTripStore from '../store/tripStore'

const TripCalendar = () => {
  const { tripId } = useParams()
  const { trips } = useTripStore()
  const trip = useMemo(() => trips.find(t => t.id === tripId), [tripId, trips])
  
  // Initialize selectedDate based on trip
  const initialDate = useMemo(() => trip?.startDate ? new Date(trip.startDate) : null, [trip?.startDate])
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' or 'timeline'

  if (!trip) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white/60">Trip not found</p>
        </div>
      </Layout>
    )
  }

  const startDate = trip.startDate ? new Date(trip.startDate) : new Date()
  const endDate = trip.endDate ? new Date(trip.endDate) : addDays(startDate, 7)
  const tripDays = differenceInDays(endDate, startDate) + 1

  // Generate calendar days
  const calendarDays = Array.from({ length: tripDays }, (_, i) => addDays(startDate, i))

  // Get activities for a specific day
  const getActivitiesForDay = (date) => {
    const dayIndex = differenceInDays(date, startDate)
    const activities = []
    
    trip.stops?.forEach((stop, stopIndex) => {
      // Simple distribution: assign activities across days
      stop.activities?.forEach((activity, actIndex) => {
        const activityDay = (stopIndex + actIndex) % tripDays
        if (activityDay === dayIndex) {
          activities.push({
            ...activity,
            city: stop.city?.name || 'Unknown',
            time: `${9 + actIndex * 2}:00`
          })
        }
      })
    })
    
    return activities
  }

  // Get stop for a specific day
  const getStopForDay = (date) => {
    const dayIndex = differenceInDays(date, startDate)
    if (!trip.stops || trip.stops.length === 0) return null
    
    const daysPerStop = Math.ceil(tripDays / trip.stops.length)
    const stopIndex = Math.floor(dayIndex / daysPerStop)
    return trip.stops[Math.min(stopIndex, trip.stops.length - 1)]
  }

  const isSelected = (date) => selectedDate && startOfDay(date).getTime() === startOfDay(selectedDate).getTime()
  const isToday = (date) => startOfDay(date).getTime() === startOfDay(new Date()).getTime()

  const selectedActivities = selectedDate ? getActivitiesForDay(selectedDate) : []
  const selectedStop = selectedDate ? getStopForDay(selectedDate) : null

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            title="Trip Calendar"
            subtitle={trip.name}
            backTo={`/trip/${tripId}`}
            backLabel="Back to Trip"
          />

          {/* View Toggle */}
          <div className="flex justify-center sm:justify-end mb-6">
            <div className="glass rounded-xl p-1 flex space-x-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode !== 'calendar' ? 'text-white/70 hover:text-white' : 'text-white'}`}
                style={viewMode === 'calendar' ? { background: 'linear-gradient(90deg, #fbbf24, #f97316)' } : {}}
              >
                <CalendarIcon className="w-4 h-4 inline mr-2" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode !== 'timeline' ? 'text-white/70 hover:text-white' : 'text-white'}`}
                style={viewMode === 'timeline' ? { background: 'linear-gradient(90deg, #fbbf24, #f97316)' } : {}}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Timeline
              </button>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar Grid */}
              <GlassCard variant="premium" className="lg:col-span-2">
                <h3 className="text-xl font-bold text-white mb-6">
                  {format(startDate, 'MMMM yyyy')} Trip
                </h3>
                
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-white/50 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before trip starts */}
                  {Array.from({ length: startDate.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  
                  {calendarDays.map((date, index) => {
                    const activities = getActivitiesForDay(date)
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square rounded-xl p-2 transition-all relative ${
                          isToday(date)
                            ? 'text-white ring-2 ring-blue-400'
                            : 'text-white'
                        } ${!isSelected(date) && !isToday(date) ? 'bg-white/5 hover:bg-white/10' : ''}`}
                        style={isSelected(date) ? { background: 'linear-gradient(135deg, #fbbf24, #f97316)', transform: 'scale(1.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' } : isToday(date) ? { background: 'rgba(59, 130, 246, 0.3)' } : {}}
                      >
                        <span className="text-sm font-medium">{format(date, 'd')}</span>
                        {activities.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
                            {activities.slice(0, 3).map((_, i) => (
                              <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected(date) ? 'bg-white' : 'bg-amber-400'}`} />
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </GlassCard>

              {/* Day Details */}
              <GlassCard variant="premium">
                {selectedDate ? (
                  <>
                    <div className="text-center mb-6">
                      <p className="text-white/60 text-sm">Day {differenceInDays(selectedDate, startDate) + 1}</p>
                      <h3 className="text-2xl font-bold text-white">
                        {format(selectedDate, 'EEEE')}
                      </h3>
                      <p className="text-white/70">
                        {format(selectedDate, 'MMMM d, yyyy')}
                      </p>
                    </div>

                    {selectedStop && (
                      <div className="glass p-4 rounded-xl mb-6">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-amber-400" />
                          <div>
                            <p className="text-white font-medium">{selectedStop.city?.name}</p>
                            <p className="text-white/60 text-sm">{selectedStop.city?.country}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h4 className="text-white/60 text-sm uppercase tracking-wider">Activities</h4>
                      {selectedActivities.length > 0 ? (
                        selectedActivities.map((activity, index) => (
                          <div key={index} className="glass p-3 rounded-xl">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-white font-medium">{activity.name}</p>
                                <p className="text-white/60 text-sm">{activity.city}</p>
                              </div>
                              <span className="text-amber-400 text-sm">{activity.time}</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span className="text-white/60 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {activity.duration}h
                              </span>
                              <span className="text-emerald-400 flex items-center">
                                <DollarSign className="w-4 h-4" />
                                {activity.cost}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/50 text-center py-4">No activities planned</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">Select a day to view details</p>
                  </div>
                )}
              </GlassCard>
            </div>
          ) : (
            /* Timeline View */
            <GlassCard variant="premium">
              <div className="space-y-8">
                {calendarDays.map((date, dayIndex) => {
                  const activities = getActivitiesForDay(date)
                  const stop = getStopForDay(date)
                  
                  return (
                    <div key={dayIndex} className="relative">
                      {/* Day Header */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${!isToday(date) ? 'bg-white/10' : ''}`}
                          style={isToday(date) ? { background: 'linear-gradient(135deg, #fbbf24, #f97316)' } : {}}
                        >
                          <span className="text-white font-bold">{format(date, 'd')}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-bold">Day {dayIndex + 1} - {format(date, 'EEEE')}</h4>
                          {stop && (
                            <p className="text-amber-400 text-sm flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {stop.city?.name}, {stop.city?.country}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Timeline Line */}
                      {dayIndex < calendarDays.length - 1 && (
                        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-white/10" />
                      )}

                      {/* Activities */}
                      <div className="ml-16 space-y-3">
                        {activities.length > 0 ? (
                          activities.map((activity, index) => (
                            <div key={index} className="glass p-4 rounded-xl flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex flex-col items-center">
                                  <Sun className="w-5 h-5 text-amber-400" />
                                  <span className="text-white/60 text-xs mt-1">{activity.time}</span>
                                </div>
                                <div>
                                  <p className="text-white font-medium">{activity.name}</p>
                                  <div className="flex items-center space-x-3 text-sm text-white/60">
                                    <span className="flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {activity.duration}h
                                    </span>
                                    <span className="badge-category text-xs">{activity.category}</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-emerald-400 font-bold">${activity.cost}</span>
                            </div>
                          ))
                        ) : (
                          <div className="glass p-4 rounded-xl text-center text-white/50">
                            Free day - No activities planned
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default TripCalendar
