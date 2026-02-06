import { create } from 'zustand'

const useUIStore = create((set) => ({
  // Sidebar/Menu state
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Modal state
  activeModal: null,
  modalData: null,
  openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Toast notifications
  toasts: [],
  addToast: (toast) => {
    const id = Date.now()
    set(state => ({
      toasts: [...state.toasts, { ...toast, id }]
    }))
    // Auto remove after 5 seconds
    setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }))
    }, 5000)
  },
  removeToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  // Loading states
  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),

  // Search state
  globalSearchQuery: '',
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

  // Theme (for future use)
  theme: 'dark',
  toggleTheme: () => set(state => ({ 
    theme: state.theme === 'dark' ? 'light' : 'dark' 
  })),

  // View preferences
  tripViewMode: 'grid', // 'grid' or 'list'
  setTripViewMode: (mode) => set({ tripViewMode: mode }),
  
  calendarViewMode: 'month', // 'month', 'week', 'day'
  setCalendarViewMode: (mode) => set({ calendarViewMode: mode }),
}))

export default useUIStore
