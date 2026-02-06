import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Edit, Trash2, Eye, Search, Grid, List, Plus, Filter } from 'lucide-react'
import Layout from '../components/common/Layout'
import GlassCard from '../components/common/GlassCard'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import useTripStore from '../store/tripStore'
import useUIStore from '../store/uiStore'

const MyTrips = () => {
  const navigate = useNavigate()
  const { trips, deleteTrip } = useTripStore()
  const { tripViewMode, setTripViewMode, addToast } = useUIStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Filter trips
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = (tripId, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId)
      addToast({ type: 'success', message: 'Trip deleted successfully' })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'badge-emerald'
      case 'upcoming': return 'badge-amber'
      case 'draft': return 'badge-blue'
      default: return 'badge-amber'
    }
  }

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="My Trips" 
            subtitle="Manage your travel adventures"
          >
            <button
              onClick={() => navigate('/create-trip')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Trip</span>
            </button>
          </PageHeader>

          {/* Search and Filter Bar */}
          <div className="glass-card p-4 mb-6 sm:mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass pl-12 w-full"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-white/50 hidden sm:block" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="select-glass py-3 pr-10"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div className="flex glass rounded-xl p-1 self-start sm:self-auto">
                <button
                  onClick={() => setTripViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${tripViewMode === 'grid' ? 'bg-white/10' : ''}`}
                >
                  <Grid className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setTripViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${tripViewMode === 'list' ? 'bg-white/10' : ''}`}
                >
                  <List className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Trips Grid/List */}
          {filteredTrips.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No trips found"
              description={searchQuery ? 'Try adjusting your search' : 'Start planning your first adventure!'}
              action={() => navigate('/create-trip')}
              actionLabel="Create Trip"
            />
          ) : tripViewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredTrips.map(trip => (
                <GlassCard
                  key={trip.id}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  className="overflow-hidden cursor-pointer group"
                  padding="p-0"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&fit=crop'}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)' }} />
                    <div className="absolute top-4 right-4">
                      <span className={`badge ${getStatusColor(trip.status)}`}>
                        {trip.status || 'Draft'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1 truncate">{trip.name}</h3>
                      <p className="text-white/70 text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {trip.stops?.length > 0 
                            ? `${trip.stops.length} destination${trip.stops.length > 1 ? 's' : ''}` 
                            : 'No destinations yet'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-white/70 text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {trip.startDate || 'Not set'} {trip.endDate && `- ${trip.endDate}`}
                      </div>
                      <div className="text-lg font-bold gradient-text">
                        ${(trip.budget?.total || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/trip/${trip.id}`) }}
                        className="flex-1 btn-glass py-2.5 flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/trip/${trip.id}/edit`) }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(trip.id, e)}
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map(trip => (
                <GlassCard
                  key={trip.id}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&fit=crop'}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white truncate">{trip.name}</h3>
                        <span className={`badge ${getStatusColor(trip.status)}`}>
                          {trip.status || 'Draft'}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-3 line-clamp-2">{trip.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {trip.startDate || 'Not set'} - {trip.endDate || 'Not set'}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {trip.stops?.length || 0} destinations
                        </span>
                        <span className="font-bold gradient-text">
                          ${(trip.budget?.total || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/trip/${trip.id}/edit`) }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(trip.id, e)}
                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MyTrips
