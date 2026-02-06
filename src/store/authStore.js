import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email) => {
        set({ isLoading: true })
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const user = {
          id: '1',
          name: 'Alexander James',
          email: email,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&fit=crop',
          adventureType: 'cultural',
          budgetRange: 'comfort',
          travelStyle: 'couple',
          preferredDestinations: ['Greece', 'Japan', 'Italy'],
          tripDuration: 'week',
          createdAt: new Date().toISOString()
        }
        
        set({ user, isAuthenticated: true, isLoading: false })
        return { success: true }
      },

      signup: async (userData) => {
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const user = {
          id: Date.now().toString(),
          ...userData,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&fit=crop',
          createdAt: new Date().toISOString()
        }
        
        set({ user, isAuthenticated: true, isLoading: false })
        return { success: true }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: (updates) => {
        const currentUser = get().user
        set({ user: { ...currentUser, ...updates } })
      }
    }),
    {
      name: 'globetrotter-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
)

export default useAuthStore
