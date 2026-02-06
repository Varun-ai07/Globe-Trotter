import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, DollarSign, MapPin, Users, Plane, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'
import Layout from '../components/common/Layout'
import GlassCard from '../components/common/GlassCard'
import useTripStore from '../store/tripStore'
import useUIStore from '../store/uiStore'

const CreateTrip = () => {
  const navigate = useNavigate()
  const { createTrip, cities } = useTripStore()
  const { addToast } = useUIStore()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: {
      total: 5000,
      transport: 0,
      accommodation: 0,
      activities: 0,
      food: 0,
      other: 0
    },
    selectedCities: [],
    travelStyle: 'balanced'
  })

  const travelStyles = [
    { value: 'budget', label: 'Budget', icon: '💰', desc: 'Maximize experiences, minimize costs' },
    { value: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Mix of comfort and savings' },
    { value: 'comfort', label: 'Comfort', icon: '✨', desc: 'Focus on quality experiences' },
    { value: 'luxury', label: 'Luxury', icon: '👑', desc: 'Premium everything' }
  ]

  const handleSubmit = () => {
    if (!formData.name) {
      addToast({ type: 'error', message: 'Please enter a trip name' })
      return
    }
    if (!formData.startDate || !formData.endDate) {
      addToast({ type: 'error', message: 'Please select travel dates' })
      return
    }

    const newTrip = createTrip({
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      travelers: formData.travelers,
      budget: formData.budget,
      travelStyle: formData.travelStyle,
      stops: formData.selectedCities.map(cityId => {
        const city = cities.find(c => c.id === cityId)
        return {
          id: `stop-${Date.now()}-${Math.random()}`,
          city,
          duration: 2,
          activities: []
        }
      })
    })

    addToast({ type: 'success', message: 'Trip created successfully!' })
    navigate(`/trip/${newTrip.id}`)
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const toggleCity = (cityId) => {
    setFormData(prev => ({
      ...prev,
      selectedCities: prev.selectedCities.includes(cityId)
        ? prev.selectedCities.filter(id => id !== cityId)
        : [...prev.selectedCities, cityId]
    }))
  }

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-amber mb-4">
              <Plane className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Create Your Trip</h1>
            <p className="text-white/60 text-sm sm:text-base">Plan your next adventure in a few simple steps</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center mb-8 sm:mb-12 px-4">
            <div className="flex items-center max-w-md w-full">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all flex-shrink-0 ${
                    step > s 
                      ? 'bg-emerald-500 text-white' 
                      : step !== s ? 'bg-white/10 text-white/50' : 'text-white'
                  }`}
                  style={step === s ? { background: 'linear-gradient(135deg, #fbbf24, #f97316)', transform: 'scale(1.1)' } : {}}
                  >
                    {step > s ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <GlassCard variant="premium" className="mb-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                
                <div>
                  <label className="block text-white/70 text-sm mb-2">Trip Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-glass w-full text-lg"
                    placeholder="European Adventure 2025"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="input-glass w-full resize-none"
                    placeholder="A brief description of your trip..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Start Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="input-glass pl-12 w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">End Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        min={formData.startDate}
                        className="input-glass pl-12 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Number of Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.travelers}
                      onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value) || 1})}
                      className="input-glass pl-12 w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Select Destinations</h2>
                <p className="text-white/60 mb-4">Choose the cities you want to visit</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cities.map(city => {
                    const isSelected = formData.selectedCities.includes(city.id)
                    return (
                      <div
                        key={city.id}
                        onClick={() => toggleCity(city.id)}
                        className={`relative h-40 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                          isSelected ? 'ring-3 ring-amber-500 scale-105' : 'hover:scale-102'
                        }`}
                      >
                        <img
                          src={city.image}
                          alt={city.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)' }} />
                        
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                        
                        <div className="absolute bottom-3 left-3 right-3">
                          <h4 className="text-white font-bold">{city.name}</h4>
                          <p className="text-white/70 text-sm">{city.country}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {formData.selectedCities.length > 0 && (
                  <p className="text-amber-400 text-sm">
                    {formData.selectedCities.length} destination{formData.selectedCities.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Budget & Style</h2>
                
                <div>
                  <label className="block text-white/70 text-sm mb-2">Total Budget (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="number"
                      min={500}
                      step={100}
                      value={formData.budget.total}
                      onChange={(e) => setFormData({
                        ...formData, 
                        budget: { ...formData.budget, total: parseInt(e.target.value) || 0 }
                      })}
                      className="input-glass pl-12 w-full text-2xl font-bold"
                    />
                  </div>
                  <p className="text-white/50 text-sm mt-2">
                    ${Math.round(formData.budget.total / formData.travelers)} per person
                  </p>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-4">Travel Style</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {travelStyles.map(style => (
                      <div
                        key={style.value}
                        onClick={() => setFormData({...formData, travelStyle: style.value})}
                        className={`p-4 rounded-2xl cursor-pointer text-center transition-all ${
                          formData.travelStyle !== style.value
                            ? 'bg-white/5 hover:bg-white/10'
                            : 'ring-2 ring-amber-500'
                        }`}
                        style={formData.travelStyle === style.value ? { background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(249, 115, 22, 0.3))' } : {}}
                      >
                        <span className="text-3xl mb-2 block">{style.icon}</span>
                        <h4 className="text-white font-bold">{style.label}</h4>
                        <p className="text-white/50 text-xs mt-1">{style.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Allocation */}
                <div className="space-y-4 mt-8">
                  <h4 className="text-white font-medium">Budget Allocation (Optional)</h4>
                  
                  {['transport', 'accommodation', 'food', 'activities', 'other'].map(category => (
                    <div key={category} className="flex items-center space-x-4">
                      <span className="text-white/70 capitalize w-28">{category}</span>
                      <input
                        type="range"
                        min={0}
                        max={formData.budget.total}
                        value={formData.budget[category]}
                        onChange={(e) => setFormData({
                          ...formData,
                          budget: { ...formData.budget, [category]: parseInt(e.target.value) }
                        })}
                        className="flex-1 accent-amber-500"
                      />
                      <span className="text-white w-20 text-right">${formData.budget[category]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-amber-400" />
                  Review Your Trip
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-6 rounded-2xl">
                    <h4 className="text-white/60 text-sm uppercase tracking-wider mb-3">Trip Details</h4>
                    <p className="text-white text-xl font-bold mb-2">{formData.name || 'Unnamed Trip'}</p>
                    {formData.description && (
                      <p className="text-white/60 text-sm mb-4">{formData.description}</p>
                    )}
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-amber-400" />
                        {formData.startDate || 'Not set'} → {formData.endDate || 'Not set'}
                      </p>
                      <p className="text-white/70 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-amber-400" />
                        {formData.travelers} traveler{formData.travelers > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-2xl">
                    <h4 className="text-white/60 text-sm uppercase tracking-wider mb-3">Budget</h4>
                    <p className="text-3xl font-bold gradient-text mb-2">${formData.budget.total.toLocaleString()}</p>
                    <p className="text-white/60 text-sm mb-4">
                      ${Math.round(formData.budget.total / formData.travelers).toLocaleString()} per person
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{travelStyles.find(s => s.value === formData.travelStyle)?.icon}</span>
                      <span className="text-white capitalize">{formData.travelStyle} style</span>
                    </div>
                  </div>
                </div>

                {formData.selectedCities.length > 0 && (
                  <div className="glass p-6 rounded-2xl">
                    <h4 className="text-white/60 text-sm uppercase tracking-wider mb-3">Destinations</h4>
                    <div className="flex flex-wrap gap-3">
                      {formData.selectedCities.map(cityId => {
                        const city = cities.find(c => c.id === cityId)
                        return (
                          <div key={cityId} className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                            <MapPin className="w-4 h-4 text-amber-400" />
                            <span className="text-white">{city?.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </GlassCard>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <button onClick={prevStep} className="btn-glass py-3 px-6 flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            ) : (
              <button onClick={() => navigate(-1)} className="btn-glass py-3 px-6 flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            )}

            {step < 4 ? (
              <button onClick={nextStep} className="btn-primary py-3 px-8 flex items-center space-x-2">
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary py-3 px-8 flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Create Trip</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateTrip
