import { useState } from 'react'
import { Search, Filter, Clock, DollarSign, Plus, Tag } from 'lucide-react'
import Layout from '../components/common/Layout'
import GlassCard from '../components/common/GlassCard'
import PageHeader from '../components/common/PageHeader'
import useTripStore from '../store/tripStore'
import useUIStore from '../store/uiStore'

const ActivitySearch = () => {
  const { activities } = useTripStore()
  const { addToast } = useUIStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [maxCost, setMaxCost] = useState(500)
  const [maxDuration, setMaxDuration] = useState(8)

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🌟' },
    { value: 'adventure', label: 'Adventure', icon: '🎯' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' },
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'relaxation', label: 'Relaxation', icon: '🧘' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  ]

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory
    const matchesCost = activity.cost <= maxCost
    const matchesDuration = activity.duration <= maxDuration
    return matchesSearch && matchesCategory && matchesCost && matchesDuration
  })

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category)
    return cat?.icon || '🌟'
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'adventure': return 'gradient-amber'
      case 'cultural': return 'gradient-blue'
      case 'food': return 'gradient-amber'
      case 'relaxation': return 'gradient-emerald'
      case 'shopping': return 'gradient-pink'
      default: return 'gradient-blue'
    }
  }

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Discover Activities"
            subtitle="Find amazing things to do on your trip"
          />

          {/* Search and Filters */}
          <GlassCard variant="premium" className="mb-8">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass pl-12 w-full text-lg"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.value
                        ? 'gradient-amber text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Max Price
                    </span>
                    <span className="text-white font-medium">${maxCost}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={maxCost}
                    onChange={(e) => setMaxCost(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Max Duration
                    </span>
                    <span className="text-white font-medium">{maxDuration} hours</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Results Count */}
          <p className="text-white/60 mb-6">
            Showing {filteredActivities.length} activities
          </p>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredActivities.map(activity => (
              <GlassCard
                key={activity.id}
                className="overflow-hidden cursor-pointer group"
                padding="p-0"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)' }} />
                  
                  {/* Category Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full ${getCategoryColor(activity.category)} text-white text-xs font-bold`}>
                    {getCategoryIcon(activity.category)} {activity.category}
                  </div>

                  {/* Activity Name */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white">{activity.name}</h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {activity.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-white/70 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {activity.duration}h
                      </span>
                      <span className="flex items-center text-emerald-400 font-bold">
                        <DollarSign className="w-4 h-4" />
                        {activity.cost}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToast({ type: 'info', message: 'Go to a trip to add activities' })}
                    className="w-full btn-glass py-2 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Itinerary</span>
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-16">
              <Tag className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No activities found</h3>
              <p className="text-white/60">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ActivitySearch
