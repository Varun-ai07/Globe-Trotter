import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({ loading: true })

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setData({
        loading: false,
        user: { name: 'Alexander James' },
        recentTrips: [
          { id: 1, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2b?w=500&fit=crop', title: 'Santorini Retreat', location: 'Santorini, Greece', dates: 'March 15-22', status: 'confirmed', price: 3250 },
          { id: 2, image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&fit=crop', title: 'Alpine Escape', location: 'Zermatt, Switzerland', dates: 'April 2-12', status: 'upcoming', price: 5800 }
        ],
        popularDestinations: [
          { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&fit=crop', name: 'Bali', rating: 4.9 },
          { image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&fit=crop', name: 'Amalfi Coast', rating: 4.8 },
          { image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&fit=crop', name: 'Kyoto', rating: 4.9 },
          { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&fit=crop', name: 'Reykjavik', rating: 4.7 },
          { image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&fit=crop', name: 'Marrakech', rating: 4.8 }
        ],
        budget: { total: 5000, spent: 3250, remaining: 1750 }
      })
    }
    loadData()
  }, [])

  const { loading, user, recentTrips, popularDestinations, budget } = data

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-12"
        style={{
          backgroundImage: "url('/we.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center text-slate-900/95 drop-shadow-4xl animate-pulse">
          <div className="w-16 h-16 border-4 border-slate-300/50 border-t-amber-500 rounded-full mx-auto mb-6 animate-spin"></div>
          <h2 className="text-xl font-serif font-bold mb-2">Preparing Your Journey</h2>
          <p className="text-base font-light">Curating exceptional destinations</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* YOUR CRYSTAL CLEAR "we.jpeg" Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0 brightness-200 contrast-140 saturate-120"
        style={{
          backgroundImage: "url('/we.jpeg')"
        }}
      />
      {/* Ultra-light overlay for max clarity */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/70 via-white/50 to-amber-50/70 z-10 backdrop-blur-none" />
      
      <div className="relative z-20 py-20 px-4 lg:px-8 xl:px-16">
        <div className="max-w-5xl mx-auto space-y-24">
          
          {/* 1. HERO */}
          <section className="text-center drop-shadow-6xl">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-slate-950 mb-4 leading-tight">
              Welcome back
            </h1>
            <h2 className="text-4xl lg:text-5xl font-serif font-black bg-gradient-to-r from-amber-700/95 via-orange-600/95 to-amber-700/95 bg-clip-text text-transparent mb-6 drop-shadow-5xl">
              {user.name}
            </h2>
            <p className="text-lg lg:text-xl text-slate-900/95 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-4xl">
              Exceptional journeys curated for discerning travelers
            </p>
          </section>

          {/* 2. BUDGET */}
          <section className="text-center max-w-xl mx-auto drop-shadow-5xl">
            <h3 className="text-2xl lg:text-3xl font-serif font-bold text-slate-950 mb-8 leading-tight">
              Budget Overview
            </h3>
            <div className="space-y-6">
              <div className="text-3xl lg:text-4xl font-black text-slate-950 mb-6 drop-shadow-4xl">
                ${budget.total.toLocaleString()}
                <span className="text-lg lg:text-xl font-light text-slate-800 ml-3">Total</span>
              </div>
              <div className="w-full max-w-sm mx-auto bg-white/60 rounded-xl h-3 lg:h-4 p-1 shadow-lg backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600/95 to-teal-600/95 rounded-lg shadow-lg transition-all duration-1500"
                  style={{width: `${(budget.spent/budget.total)*100}%`}}
                />
              </div>
              <div className="grid grid-cols-2 gap-8 text-xl lg:text-2xl font-bold text-slate-950 drop-shadow-4xl">
                <div className="text-center">
                  <div className="text-emerald-700 font-black mb-1">${budget.spent.toLocaleString()}</div>
                  <div className="text-base text-slate-800 font-semibold">Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-700 font-black mb-1">${budget.remaining.toLocaleString()}</div>
                  <div className="text-base text-slate-800 font-semibold">Remaining</div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. QUICK ACTIONS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { title: 'Plan New Trip', desc: 'Create bespoke itinerary', icon: 'plus', path: '/create-trip' },
              { title: 'View All Trips', desc: 'Manage reservations', icon: 'calendar', path: '/trips' },
              { title: 'Saved Places', desc: 'Your collection', icon: 'heart' }
            ].map((action, i) => (
              <QuickAction key={action.title} action={action} index={i} navigate={navigate} />
            ))}
          </section>

          {/* 4. TRIPS HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-4 lg:gap-0 drop-shadow-5xl">
            <h2 className="text-2xl lg:text-3xl font-serif font-black text-slate-950">
              Upcoming Trips
            </h2>
            <button 
              onClick={() => navigate('/trips')}
              className="group self-start lg:self-center px-8 py-3 bg-gradient-to-r from-slate-950/95 to-slate-900/95 hover:from-slate-950 hover:to-slate-900 text-white font-bold text-base rounded-xl shadow-3xl hover:shadow-4xl hover:-translate-y-1 transition-all duration-400 backdrop-blur-xl border border-slate-200/30"
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {recentTrips.map((trip, i) => (
              <TripPreview key={trip.id} trip={trip} index={i} navigate={navigate} />
            ))}
          </div>

          {/* 5. DESTINATIONS HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-4 lg:gap-0 drop-shadow-5xl">
            <div>
              <h2 className="text-2xl lg:text-3xl font-serif font-black text-slate-950 mb-1">
                Recommended Destinations
              </h2>
              <p className="text-lg lg:text-xl text-slate-900/95 font-semibold">
                Exceptional properties worldwide
              </p>
            </div>
            <button className="group self-start lg:self-center px-8 py-3 bg-gradient-to-r from-slate-950/95 to-slate-900/95 hover:from-slate-950 hover:to-slate-900 text-white font-bold text-base rounded-xl shadow-3xl hover:shadow-4xl hover:-translate-y-1 transition-all duration-400 backdrop-blur-xl border border-slate-200/30">
              Explore Collection
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
            {popularDestinations.map((city, i) => (
              <DestinationPreview key={i} city={city} index={i} navigate={navigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// QuickAction, TripPreview, DestinationPreview (unchanged from previous)
const QuickAction = ({ action, index, navigate }) => (
  <button onClick={() => action.path && navigate(action.path)} className="group text-center hover:-translate-y-3 transition-all duration-500 drop-shadow-4xl hover:drop-shadow-6xl" style={{ animationDelay: `${index * 0.15}s` }}>
    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-slate-700/95 to-slate-800/95 rounded-2xl flex items-center justify-center shadow-3xl group-hover:scale-110 transition-all duration-500 border border-slate-300/40 hover:border-slate-200/60">
      <svg className="w-8 h-8 text-white drop-shadow-2xl" fill="currentColor" viewBox="0 0 20 20">
        {action.icon === 'plus' && <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />}
        {action.icon === 'calendar' && <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />}
        {action.icon === 'heart' && <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />}
      </svg>
    </div>
    <h3 className="text-xl lg:text-2xl font-serif font-bold text-slate-950 mb-4 group-hover:text-slate-900 transition-colors duration-400 leading-tight drop-shadow-4xl">{action.title}</h3>
    <p className="text-base lg:text-lg text-slate-900/95 font-semibold leading-relaxed max-w-xs mx-auto drop-shadow-3xl">{action.desc}</p>
  </button>
)

const TripPreview = ({ trip, index, navigate }) => (
  <div className="group cursor-pointer hover:-translate-y-3 transition-all duration-700 drop-shadow-4xl hover:drop-shadow-6xl" onClick={() => navigate(`/trip/${trip.id}`)} style={{ animationDelay: `${index * 0.2}s` }}>
    <div className="relative h-48 lg:h-56 overflow-hidden rounded-2xl">
      <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 group-hover:brightness-110 rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30" />
      <div className="absolute top-6 right-6">
        <span className={`px-4 py-2 rounded-xl font-bold text-white text-xs shadow-3xl backdrop-blur-xl ${trip.status === 'upcoming' ? 'bg-gradient-to-r from-slate-700/95 to-slate-800/95' : 'bg-gradient-to-r from-emerald-600/95 to-emerald-700/95'}`}>
          {trip.status === 'upcoming' ? 'Upcoming' : 'Confirmed'}
        </span>
      </div>
    </div>
    <div className="mt-6">
      <h3 className="text-xl lg:text-2xl font-serif font-black text-slate-950 drop-shadow-5xl mb-3 leading-tight">{trip.title}</h3>
      <p className="text-lg text-slate-900/95 font-bold mb-4 drop-shadow-4xl">{trip.location}</p>
      <div className="flex items-center justify-between text-base drop-shadow-5xl">
        <span className="text-slate-800/95 font-semibold">{trip.dates}</span>
        <div className="text-xl lg:text-2xl font-black bg-gradient-to-r from-amber-600/95 to-orange-600/95 bg-clip-text text-transparent">${trip.price.toLocaleString()}</div>
      </div>
    </div>
  </div>
)

const DestinationPreview = ({ city, index, navigate }) => (
  <div className="group cursor-pointer hover:-translate-y-2 transition-all duration-500 drop-shadow-3xl hover:drop-shadow-5xl" onClick={() => navigate('/destinations')} style={{ animationDelay: `${index * 0.12}s` }}>
    <div className="relative h-48 lg:h-56 overflow-hidden rounded-xl">
      <img src={city.image} alt={city.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-1000 group-hover:brightness-110 rounded-xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 p-6 flex flex-col justify-end">
        <h4 className="text-xl lg:text-2xl font-serif font-black text-white drop-shadow-6xl leading-tight group-hover:text-amber-100 transition-colors duration-400">{city.name}</h4>
        <div className="flex items-center text-white/95 text-lg lg:text-xl font-bold drop-shadow-6xl mt-1">
          <svg className="w-6 h-6 mr-3 text-amber-500 fill-current flex-shrink-0 drop-shadow-3xl" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {city.rating}
        </div>
      </div>
    </div>
  </div>
)

export default Dashboard
