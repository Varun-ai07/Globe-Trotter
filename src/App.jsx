import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import MyTrips from './pages/MyTrips'
import ItineraryBuilder from './pages/ItineraryBuilder'
import CitySearch from './pages/CitySearch'
import ActivitySearch from './pages/ActivitySearch'
import BudgetBreakdown from './pages/BudgetBreakdown'
import TripCalendar from './pages/TripCalendar'
import PublicItinerary from './pages/PublicItinerary'
import UserProfile from './pages/UserProfile'

// Components
import Toast from './components/common/Toast'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/share/:publicUrl" element={<PublicItinerary />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/trips" element={
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        } />
        <Route path="/create-trip" element={
          <ProtectedRoute>
            <CreateTrip />
          </ProtectedRoute>
        } />
        <Route path="/trip/:tripId" element={
          <ProtectedRoute>
            <ItineraryBuilder />
          </ProtectedRoute>
        } />
        <Route path="/trip/:tripId/budget" element={
          <ProtectedRoute>
            <BudgetBreakdown />
          </ProtectedRoute>
        } />
        <Route path="/trip/:tripId/calendar" element={
          <ProtectedRoute>
            <TripCalendar />
          </ProtectedRoute>
        } />
        <Route path="/cities" element={
          <ProtectedRoute>
            <CitySearch />
          </ProtectedRoute>
        } />
        <Route path="/activities" element={
          <ProtectedRoute>
            <ActivitySearch />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
