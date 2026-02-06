import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Sample data for cities and activities
const sampleCities = [
  { id: 'c1', name: 'Santorini', country: 'Greece', region: 'Europe', costIndex: 150, popularity: 4.9, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&fit=crop', description: 'Iconic white-washed buildings and stunning sunsets' },
  { id: 'c2', name: 'Kyoto', country: 'Japan', region: 'Asia', costIndex: 120, popularity: 4.9, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop', description: 'Ancient temples and traditional Japanese culture' },
  { id: 'c3', name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 80, popularity: 4.8, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&fit=crop', description: 'Tropical paradise with rich spiritual heritage' },
  { id: 'c4', name: 'Amalfi Coast', country: 'Italy', region: 'Europe', costIndex: 180, popularity: 4.8, image: 'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&fit=crop', description: 'Dramatic coastline with colorful villages' },
  { id: 'c5', name: 'Reykjavik', country: 'Iceland', region: 'Europe', costIndex: 200, popularity: 4.7, image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&fit=crop', description: 'Gateway to stunning natural wonders' },
  { id: 'c6', name: 'Marrakech', country: 'Morocco', region: 'Africa', costIndex: 70, popularity: 4.6, image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&fit=crop', description: 'Vibrant souks and exotic architecture' },
  { id: 'c7', name: 'Zermatt', country: 'Switzerland', region: 'Europe', costIndex: 250, popularity: 4.8, image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&fit=crop', description: 'Alpine village with Matterhorn views' },
  { id: 'c8', name: 'Maldives', country: 'Maldives', region: 'Asia', costIndex: 300, popularity: 4.9, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&fit=crop', description: 'Crystal clear waters and overwater villas' },
  { id: 'c9', name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 130, popularity: 4.7, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&fit=crop', description: 'Gaudi architecture and Mediterranean vibes' },
  { id: 'c10', name: 'Cape Town', country: 'South Africa', region: 'Africa', costIndex: 90, popularity: 4.6, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&fit=crop', description: 'Stunning mountains meet the ocean' },
]

const sampleActivities = [
  { id: 'a1', name: 'Sunset Sailing', category: 'adventure', cost: 150, duration: 3, image: 'https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=600&fit=crop', description: 'Sail into the sunset with wine and appetizers' },
  { id: 'a2', name: 'Temple Tour', category: 'cultural', cost: 50, duration: 4, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&fit=crop', description: 'Visit ancient temples with expert guides' },
  { id: 'a3', name: 'Cooking Class', category: 'food', cost: 80, duration: 3, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&fit=crop', description: 'Learn to cook authentic local cuisine' },
  { id: 'a4', name: 'Scuba Diving', category: 'adventure', cost: 200, duration: 4, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&fit=crop', description: 'Explore vibrant coral reefs underwater' },
  { id: 'a5', name: 'Wine Tasting', category: 'food', cost: 120, duration: 3, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&fit=crop', description: 'Sample premium wines at local vineyards' },
  { id: 'a6', name: 'Hiking Trail', category: 'adventure', cost: 30, duration: 5, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&fit=crop', description: 'Trek through scenic mountain trails' },
  { id: 'a7', name: 'Spa & Wellness', category: 'relaxation', cost: 180, duration: 3, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&fit=crop', description: 'Rejuvenate with traditional treatments' },
  { id: 'a8', name: 'Street Food Tour', category: 'food', cost: 40, duration: 3, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&fit=crop', description: 'Taste authentic local street food' },
  { id: 'a9', name: 'Museum Visit', category: 'cultural', cost: 25, duration: 2, image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&fit=crop', description: 'Explore world-class art and history' },
  { id: 'a10', name: 'Hot Air Balloon', category: 'adventure', cost: 300, duration: 2, image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&fit=crop', description: 'Soar above landscapes at sunrise' },
  { id: 'a11', name: 'Beach Day', category: 'relaxation', cost: 20, duration: 6, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop', description: 'Relax on pristine sandy beaches' },
  { id: 'a12', name: 'Night Market', category: 'shopping', cost: 60, duration: 2, image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&fit=crop', description: 'Shop for unique local treasures' },
]

const useTripStore = create(
  persist(
    (set, get) => ({
      trips: [
        {
          id: 't1',
          name: 'Santorini Retreat',
          description: 'A romantic getaway to the Greek islands',
          coverPhoto: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&fit=crop',
          startDate: '2026-03-15',
          endDate: '2026-03-22',
          isPublic: false,
          publicUrl: null,
          status: 'confirmed',
          stops: [
            {
              id: 's1',
              cityId: 'c1',
              city: sampleCities[0],
              arrivalDate: '2026-03-15',
              departureDate: '2026-03-22',
              activities: [
                { ...sampleActivities[0], scheduledDate: '2026-03-16', scheduledTime: '17:00' },
                { ...sampleActivities[4], scheduledDate: '2026-03-17', scheduledTime: '14:00' },
                { ...sampleActivities[6], scheduledDate: '2026-03-18', scheduledTime: '10:00' },
              ]
            }
          ],
          budget: {
            total: 5000,
            transport: 1200,
            accommodation: 1800,
            activities: 450,
            food: 800,
            other: 750
          },
          createdAt: '2026-01-15T10:00:00Z'
        },
        {
          id: 't2',
          name: 'Alpine Escape',
          description: 'Mountain adventure in Switzerland',
          coverPhoto: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&fit=crop',
          startDate: '2026-04-02',
          endDate: '2026-04-12',
          isPublic: true,
          publicUrl: 'alpine-escape-2026',
          status: 'upcoming',
          stops: [
            {
              id: 's2',
              cityId: 'c7',
              city: sampleCities[6],
              arrivalDate: '2026-04-02',
              departureDate: '2026-04-12',
              activities: [
                { ...sampleActivities[5], scheduledDate: '2026-04-03', scheduledTime: '09:00' },
                { ...sampleActivities[6], scheduledDate: '2026-04-04', scheduledTime: '14:00' },
              ]
            }
          ],
          budget: {
            total: 8000,
            transport: 1800,
            accommodation: 3500,
            activities: 600,
            food: 1200,
            other: 900
          },
          createdAt: '2026-01-20T15:00:00Z'
        }
      ],
      cities: sampleCities,
      activities: sampleActivities,
      currentTrip: null,
      savedDestinations: ['c1', 'c2', 'c4'],

      // Trip CRUD
      createTrip: (tripData) => {
        const newTrip = {
          id: `t${Date.now()}`,
          ...tripData,
          stops: [],
          budget: { total: 0, transport: 0, accommodation: 0, activities: 0, food: 0, other: 0 },
          status: 'draft',
          isPublic: false,
          publicUrl: null,
          createdAt: new Date().toISOString()
        }
        set(state => ({ trips: [...state.trips, newTrip], currentTrip: newTrip }))
        return newTrip
      },

      updateTrip: (tripId, updates) => {
        set(state => ({
          trips: state.trips.map(trip => 
            trip.id === tripId ? { ...trip, ...updates } : trip
          ),
          currentTrip: state.currentTrip?.id === tripId 
            ? { ...state.currentTrip, ...updates } 
            : state.currentTrip
        }))
      },

      deleteTrip: (tripId) => {
        set(state => ({
          trips: state.trips.filter(trip => trip.id !== tripId),
          currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip
        }))
      },

      setCurrentTrip: (tripId) => {
        const trip = get().trips.find(t => t.id === tripId)
        set({ currentTrip: trip || null })
      },

      // Stops management
      addStop: (tripId, stopData) => {
        const city = get().cities.find(c => c.id === stopData.cityId)
        const newStop = {
          id: `s${Date.now()}`,
          ...stopData,
          city,
          activities: []
        }
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? { ...trip, stops: [...trip.stops, newStop] }
              : trip
          )
        }))
      },

      removeStop: (tripId, stopId) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? { ...trip, stops: trip.stops.filter(s => s.id !== stopId) }
              : trip
          )
        }))
      },

      reorderStops: (tripId, newOrder) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId ? { ...trip, stops: newOrder } : trip
          )
        }))
      },

      // Activities management
      addActivity: (tripId, stopId, activity) => {
        const activityData = get().activities.find(a => a.id === activity.activityId) || activity
        const newActivity = {
          ...activityData,
          id: `act${Date.now()}`,
          scheduledDate: activity.scheduledDate,
          scheduledTime: activity.scheduledTime
        }
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? {
                  ...trip,
                  stops: trip.stops.map(stop =>
                    stop.id === stopId
                      ? { ...stop, activities: [...stop.activities, newActivity] }
                      : stop
                  )
                }
              : trip
          )
        }))
      },

      removeActivity: (tripId, stopId, activityId) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? {
                  ...trip,
                  stops: trip.stops.map(stop =>
                    stop.id === stopId
                      ? { ...stop, activities: stop.activities.filter(a => a.id !== activityId) }
                      : stop
                  )
                }
              : trip
          )
        }))
      },

      // Budget management
      updateBudget: (tripId, budgetUpdates) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId
              ? { ...trip, budget: { ...trip.budget, ...budgetUpdates } }
              : trip
          )
        }))
      },

      // Sharing
      togglePublic: (tripId) => {
        const trip = get().trips.find(t => t.id === tripId)
        const publicUrl = !trip.isPublic ? `${trip.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}` : null
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, isPublic: !t.isPublic, publicUrl }
              : t
          )
        }))
      },

      // Saved destinations
      toggleSavedDestination: (cityId) => {
        set(state => ({
          savedDestinations: state.savedDestinations.includes(cityId)
            ? state.savedDestinations.filter(id => id !== cityId)
            : [...state.savedDestinations, cityId]
        }))
      },

      // Search & Filter
      searchCities: (query, filters = {}) => {
        let results = get().cities
        
        if (query) {
          const lowerQuery = query.toLowerCase()
          results = results.filter(city =>
            city.name.toLowerCase().includes(lowerQuery) ||
            city.country.toLowerCase().includes(lowerQuery)
          )
        }
        
        if (filters.region) {
          results = results.filter(city => city.region === filters.region)
        }
        
        if (filters.maxCost) {
          results = results.filter(city => city.costIndex <= filters.maxCost)
        }
        
        return results
      },

      searchActivities: (query, filters = {}) => {
        let results = get().activities
        
        if (query) {
          const lowerQuery = query.toLowerCase()
          results = results.filter(activity =>
            activity.name.toLowerCase().includes(lowerQuery) ||
            activity.category.toLowerCase().includes(lowerQuery)
          )
        }
        
        if (filters.category) {
          results = results.filter(activity => activity.category === filters.category)
        }
        
        if (filters.maxCost) {
          results = results.filter(activity => activity.cost <= filters.maxCost)
        }
        
        if (filters.maxDuration) {
          results = results.filter(activity => activity.duration <= filters.maxDuration)
        }
        
        return results
      },

      // Calculate trip cost
      calculateTripCost: (tripId) => {
        const trip = get().trips.find(t => t.id === tripId)
        if (!trip) return 0
        
        let totalActivitiesCost = 0
        trip.stops.forEach(stop => {
          stop.activities.forEach(activity => {
            totalActivitiesCost += activity.cost || 0
          })
        })
        
        return {
          activities: totalActivitiesCost,
          ...trip.budget,
          total: trip.budget.transport + trip.budget.accommodation + totalActivitiesCost + trip.budget.food + trip.budget.other
        }
      }
    }),
    {
      name: 'globetrotter-trips',
    }
  )
)

export default useTripStore
