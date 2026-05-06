import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getDashboardStats } from '../api/endpoints'

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats()
        setStats(response.data)
      } catch (err) {
        setError('Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Projects */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.total_projects || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="text-blue-600" size={28} />
                </div>
              </div>
            </div>

            {/* Assigned Tasks */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Assigned Tasks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.total_assigned_tasks || 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={28} />
                </div>
              </div>
            </div>

            {/* Overdue Tasks */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Overdue Tasks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.overdue_tasks || 0}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertCircle className="text-red-600" size={28} />
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.tasks_by_status?.in_progress || 0}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="text-orange-600" size={28} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Status Breakdown */}
        {stats?.tasks_by_status && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Task Status Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats.tasks_by_status.todo || 0}
                </div>
                <p className="text-gray-600">To Do</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {stats.tasks_by_status.in_progress || 0}
                </div>
                <p className="text-gray-600">In Progress</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stats.tasks_by_status.completed || 0}
                </div>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-600">
          <p>More features coming soon...</p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
