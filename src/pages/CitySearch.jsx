import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, MapPin, Star, Heart, DollarSign, Plus, Globe } from 'lucide-react'
import Layout from '../components/common/Layout'
import GlassCard from '../components/common/GlassCard'
import PageHeader from '../components/common/PageHeader'
import useTripStore from '../store/tripStore'
import useUIStore from '../store/uiStore'

const CitySearch = () => {
  const navigate = useNavigate()
  const { cities, savedDestinations, toggleSavedDestination } = useTripStore()
  const { addToast } = useUIStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [maxCost, setMaxCost] = useState(500)
  const [sortBy, setSortBy] = useState('popularity')

  const regions = ['all', 'Europe', 'Asia', 'Africa', 'Americas', 'Oceania']

  // Filter and sort cities
  let filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          city.country.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === 'all' || city.region === selectedRegion
    const matchesCost = city.costIndex <= maxCost
    return matchesSearch && matchesRegion && matchesCost
  })

  // Sort
  if (sortBy === 'popularity') {
    filteredCities.sort((a, b) => b.popularity - a.popularity)
  } else if (sortBy === 'cost-low') {
    filteredCities.sort((a, b) => a.costIndex - b.costIndex)
  } else if (sortBy === 'cost-high') {
    filteredCities.sort((a, b) => b.costIndex - a.costIndex)
  } else if (sortBy === 'name') {
    filteredCities.sort((a, b) => a.name.localeCompare(b.name))
  }

  const handleSave = (cityId, e) => {
    e.stopPropagation()
    toggleSavedDestination(cityId)
    const city = cities.find(c => c.id === cityId)
    const isSaved = savedDestinations.includes(cityId)
    addToast({ 
      type: 'success', 
      message: isSaved ? `${city.name} removed from saved` : `${city.name} saved!` 
    })
  }

  const getCostLabel = (costIndex) => {
    if (costIndex <= 100) return { label: 'Budget', color: 'text-emerald-400' }
    if (costIndex <= 200) return { label: 'Moderate', color: 'text-amber-400' }
    return { label: 'Luxury', color: 'text-rose-400' }
  }

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Explore Cities"
            subtitle="Discover your next destination"
          />

          {/* Search and Filters */}
          <GlassCard variant="premium" className="mb-8">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search cities or countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass pl-12 w-full text-lg"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-white/50" />
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="select-glass py-2"
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>
                        {region === 'all' ? 'All Regions' : region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-white/50" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="select-glass py-2"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="cost-low">Cost: Low to High</option>
                    <option value="cost-high">Cost: High to Low</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                  <DollarSign className="w-5 h-5 text-white/50 flex-shrink-0" />
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={maxCost}
                    onChange={(e) => setMaxCost(parseInt(e.target.value))}
                    className="flex-1 accent-amber-500 h-2"
                  />
                  <span className="text-white/70 text-sm whitespace-nowrap">
                    Max ${maxCost}/day
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Results Count */}
          <p className="text-white/60 mb-6">
            Showing {filteredCities.length} destinations
          </p>

          {/* Cities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCities.map(city => {
              const costInfo = getCostLabel(city.costIndex)
              const isSaved = savedDestinations.includes(city.id)
              
              return (
                <GlassCard
                  key={city.id}
                  className="overflow-hidden cursor-pointer group"
                  padding="p-0"
                  onClick={() => navigate(`/cities/${city.id}`)}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)' }} />
                    
                    {/* Save Button */}
                    <button
                      onClick={(e) => handleSave(city.id, e)}
                      className={`absolute top-4 right-4 p-2.5 rounded-full transition-all ${
                        isSaved 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-black/40 backdrop-blur-sm text-white hover:bg-black/60'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    {/* City Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                      <p className="text-white/80 text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {city.country}
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white font-medium">{city.popularity}</span>
                      </div>
                      <span className={`text-sm font-medium ${costInfo.color}`}>
                        {costInfo.label}
                      </span>
                    </div>

                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {city.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">
                        ~${city.costIndex}/day
                      </span>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation()
                          // Could open modal to select trip
                          addToast({ type: 'info', message: 'Create a trip to add destinations' })
                        }}
                        className="btn-glass py-2 px-4 text-sm flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to Trip</span>
                      </button>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>

          {filteredCities.length === 0 && (
            <div className="text-center py-16">
              <Globe className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No destinations found</h3>
              <p className="text-white/60">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default CitySearch
