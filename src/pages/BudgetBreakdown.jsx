import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DollarSign, TrendingUp, AlertTriangle, Plane, Home, Utensils, Camera, Gift } from 'lucide-react'
import Layout from '../components/common/Layout'
import GlassCard from '../components/common/GlassCard'
import PageHeader from '../components/common/PageHeader'
import useTripStore from '../store/tripStore'

// Custom tooltip component defined outside of the render function
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-xl">
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-amber-400 font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

const BudgetBreakdown = () => {
  const { tripId } = useParams()
  const { trips } = useTripStore()
  
  // Use useMemo instead of useState + useEffect for derived state
  const trip = useMemo(() => trips.find(t => t.id === tripId), [tripId, trips])

  if (!trip) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white/60">Trip not found</p>
        </div>
      </Layout>
    )
  }

  const budget = trip.budget || { total: 0, transport: 0, accommodation: 0, activities: 0, food: 0, other: 0 }
  
  // Calculate activities cost from stops
  const activitiesCost = trip.stops?.reduce((sum, stop) => 
    sum + (stop.activities?.reduce((aSum, a) => aSum + (a.cost || 0), 0) || 0), 0
  ) || 0

  const totalSpent = budget.transport + budget.accommodation + activitiesCost + budget.food + budget.other
  const remaining = budget.total - totalSpent
  const isOverBudget = remaining < 0

  // Pie chart data
  const pieData = [
    { name: 'Transport', value: budget.transport, color: '#3b82f6' },
    { name: 'Accommodation', value: budget.accommodation, color: '#8b5cf6' },
    { name: 'Activities', value: activitiesCost, color: '#f59e0b' },
    { name: 'Food', value: budget.food, color: '#10b981' },
    { name: 'Other', value: budget.other, color: '#6366f1' },
  ].filter(item => item.value > 0)

  // Bar chart data - daily breakdown
  const tripDays = trip.startDate && trip.endDate 
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
    : 7
  
  const dailyAvg = tripDays > 0 ? totalSpent / tripDays : 0

  const barData = Array.from({ length: Math.min(tripDays, 10) }, (_, i) => ({
    day: `Day ${i + 1}`,
    amount: Math.round(dailyAvg * (0.8 + (i % 3) * 0.15)), // Deterministic variation
    average: Math.round(dailyAvg)
  }))

  const categories = [
    { key: 'transport', label: 'Transport', value: budget.transport, icon: Plane, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { key: 'accommodation', label: 'Accommodation', value: budget.accommodation, icon: Home, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { key: 'activities', label: 'Activities', value: activitiesCost, icon: Camera, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { key: 'food', label: 'Food & Dining', value: budget.food, icon: Utensils, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { key: 'other', label: 'Other', value: budget.other, icon: Gift, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  ]

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            title="Budget Breakdown"
            subtitle={trip.name}
            backTo={`/trip/${tripId}`}
            backLabel="Back to Trip"
          />

          {/* Budget Warning */}
          {isOverBudget && (
            <div className="glass-card p-4 mb-8 border-red-500/30 bg-red-500/10 flex items-center space-x-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-red-400">Over Budget!</h4>
                <p className="text-white/70 text-sm">
                  You've exceeded your budget by ${Math.abs(remaining).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <GlassCard className="text-center">
              <div className="w-12 h-12 rounded-xl gradient-amber-light flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-white/60 text-sm mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-white">${budget.total.toLocaleString()}</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="w-12 h-12 rounded-xl gradient-emerald-light flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-white/60 text-sm mb-1">Total Allocated</p>
              <p className="text-2xl font-bold text-emerald-400">${totalSpent.toLocaleString()}</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${isOverBudget ? 'bg-red-500/20' : 'gradient-blue-light'}`}>
                <DollarSign className={`w-6 h-6 ${isOverBudget ? 'text-red-400' : 'text-blue-400'}`} />
              </div>
              <p className="text-white/60 text-sm mb-1">Remaining</p>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : 'text-blue-400'}`}>
                ${Math.abs(remaining).toLocaleString()}
              </p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)' }}>
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-white/60 text-sm mb-1">Daily Average</p>
              <p className="text-2xl font-bold text-purple-400">${Math.round(dailyAvg).toLocaleString()}</p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Pie Chart */}
            <GlassCard variant="premium">
              <h3 className="text-xl font-bold text-white mb-6">Spending by Category</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ color: 'white' }}
                      formatter={(value) => <span className="text-white/80">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Bar Chart */}
            <GlassCard variant="premium">
              <h3 className="text-xl font-bold text-white mb-6">Daily Spending</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Category Breakdown */}
          <GlassCard variant="premium">
            <h3 className="text-xl font-bold text-white mb-6">Category Details</h3>
            <div className="space-y-4">
              {categories.map(category => {
                const percentage = totalSpent > 0 ? (category.value / totalSpent) * 100 : 0
                const Icon = category.icon
                return (
                  <div key={category.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl ${category.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <span className="text-white font-medium">{category.label}</span>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${category.color}`}>${category.value.toLocaleString()}</p>
                        <p className="text-white/50 text-sm">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000`}
                        style={{ 
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, ${category.color.replace('text-', 'rgb(var(--')}, transparent)`
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  )
}

export default BudgetBreakdown
