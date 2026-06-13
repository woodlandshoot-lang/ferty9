'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data } = await supabase.from('appointments').select('*').order('created_at', { ascending: false })
      setAppointments(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">FERTY9</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button onClick={handleLogout} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">Logout</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white mb-6">
          <h2 className="text-2xl font-bold">Welcome to FERTY9! 🎉</h2>
          <p className="text-purple-200 mt-1">Your fertility journey dashboard</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Link href="/hospitals" className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition">
            <p className="text-purple-600 text-sm font-medium">🏥 Hospitals</p>
            <p className="text-3xl font-bold mt-1">3</p>
            <p className="text-gray-400 text-sm">Click to browse</p>
          </Link>
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-pink-600 text-sm font-medium">📅 Appointments</p>
            <p className="text-3xl font-bold mt-1">{appointments.length}</p>
            <p className="text-gray-400 text-sm">Total booked</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-green-600 text-sm font-medium">👤 Role</p>
            <p className="text-xl font-bold mt-1 text-green-600">Patient</p>
            <p className="text-gray-400 text-sm">Your account type</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">My Appointments</h3>
            <Link href="/hospitals" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">+ Book New</Link>
          </div>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-gray-500">No appointments yet</p>
              <Link href="/hospitals" className="mt-3 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg text-sm">Book Now</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="border rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{apt.hospital_name}</p>
                    <p className="text-sm text-gray-500">{apt.treatment_type} · {apt.appointment_date}</p>
                    <p className="text-sm text-gray-400">{apt.patient_name} · {apt.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}