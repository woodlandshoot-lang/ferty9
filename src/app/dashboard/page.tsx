'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login') }
      else { setUser(user); setLoading(false) }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-purple-600 text-xl">Loading...</p></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-700">FERTY9</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">👋 {user?.user_metadata?.full_name || user?.email}</span>
          <button onClick={handleLogout} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition">Logout</button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to FERTY9! 🎉</h2>
          <p className="text-gray-500">మీ fertility journey dashboard</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/hospitals">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 hover:shadow-md transition cursor-pointer">
              <p className="text-purple-600 text-sm font-medium">🏥 Hospitals</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">3</p>
              <p className="text-gray-400 text-xs mt-1">Click to browse →</p>
            </div>
          </Link>
          <div className="bg-pink-50 rounded-xl p-5 border border-pink-100">
            <p className="text-pink-600 text-sm font-medium">📅 Appointments</p>
            <p className="text-3xl font-bold text-pink-700 mt-1">0</p>
            <p className="text-gray-400 text-xs mt-1">Upcoming</p>
          </div>
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <p className="text-green-600 text-sm font-medium">👤 Role</p>
            <p className="text-xl font-bold text-green-700 mt-1 capitalize">{user?.user_metadata?.role || 'Patient'}</p>
            <p className="text-gray-400 text-xs mt-1">Your account type</p>
          </div>
        </div>
      </main>
    </div>
  )
}