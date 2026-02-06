import Navbar from './Navbar'
import useAuthStore from '../../store/authStore'

const Layout = ({ children, showNav = true }) => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen relative">
      {/* Parallax Background */}
      <div className="parallax-bg" />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/50 z-[1]" />
      
      {/* Navigation */}
      {showNav && isAuthenticated && <Navbar />}
      
      {/* Main Content */}
      <main className={`relative z-10 ${showNav && isAuthenticated ? 'pt-16 sm:pt-20' : ''}`}>
        {children}
      </main>
    </div>
  )
}

export default Layout
