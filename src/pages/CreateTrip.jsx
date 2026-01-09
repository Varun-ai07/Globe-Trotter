import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateTrip = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    coverPhoto: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'coverPhoto') {
      const file = files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(file)
        setFormData({ ...formData, coverPhoto: file })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      console.log('Trip created:', formData)
      alert('✅ Trip created successfully!')
      navigate('/dashboard')
      setIsSubmitting(false)
    }, 1500)
  }

  const isFormValid = formData.name && formData.startDate && formData.endDate && formData.description

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-50" 
           style={{backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=2400&q=95&fm=webp')"}} />
      
      <div className="relative z-20 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-16">
            <button 
              onClick={() => navigate('/dashboard')}
              className="glass-premium inline-flex items-center space-x-2 px-6 py-3 rounded-3xl mb-8 hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-5xl font-black gradient-text mb-6">Create New Trip</h1>
            <p className="text-xl text-slate-300 max-w-md mx-auto">
              Plan your next adventure by creating a personalized travel itinerary
            </p>
          </div>

          <div className="glass-premium rounded-4xl p-12 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div>
                <label className="block text-lg font-semibold mb-4 text-white">Trip Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Santorini Summer Escape"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-3xl text-white placeholder-slate-400 focus:outline-none focus:border-white/50 transition-all duration-300 text-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold mb-4 text-white">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-3xl text-white focus:outline-none focus:border-white/50 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-4 text-white">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate}
                    className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-3xl text-white focus:outline-none focus:border-white/50 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-4 text-white">Cover Photo (Optional)</label>
                <div className="relative">
                  <input
                    type="file"
                    name="coverPhoto"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/5 border-2 border-dashed border-white/30 rounded-3xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all duration-300"
                  />
                  {preview && (
                    <div className="mt-4 glass-premium rounded-3xl p-4">
                      <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-4 text-white">Trip Description</label>
                <textarea
                  name="description"
                  placeholder="Tell us about your dream trip... destinations, activities, travel style, budget, etc."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-3xl text-white placeholder-slate-400 focus:outline-none focus:border-white/50 transition-all duration-300 resize-vertical text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-8 px-12 rounded-4xl font-bold text-2xl flex items-center justify-center space-x-4 transition-all duration-500 ${
                  isFormValid && !isSubmitting
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-3xl hover:scale-[1.02] shadow-2xl border-2 border-emerald-400/50'
                    : 'bg-slate-700/50 border-2 border-slate-600/50 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating Trip...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Create My Trip</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTrip
