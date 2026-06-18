'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [hospitals, setHospitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('patient')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const role = user.user_metadata?.role || 'patient'
      setUserRole(role)

      if (role === 'hospital') { router.push('/hospital-admin'); return }
      const { data: appts } = await supabase.from('appointments').select('*').order('created_at', { ascending: false })
      setAppointments(appts || [])
      const { data: hosp } = await supabase.from('hospitals').select('*')
      setHospitals(hosp || [])
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
        <h1 className="text-2xl font-bold text-purple-700">PREGA9</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button onClick={handleLogout} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">Logout</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white mb-6">
          <h2 className="text-2xl font-bold">Welcome to PREGA9! 🎉</h2>
          <p className="text-purple-200 mt-1">మీ fertility journey dashboard</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-purple-600 text-sm font-medium">🏥 Hospitals</p>
            <p className="text-3xl font-bold mt-1">{hospitals.length}</p>
            <p className="text-gray-400 text-sm">Available</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-pink-600 text-sm font-medium">📅 Appointments</p>
            <p className="text-3xl font-bold mt-1">{appointments.length}</p>
            <p className="text-gray-400 text-sm">Total booked</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-green-600 text-sm font-medium">👤 Role</p>
            <p className="text-xl font-bold mt-1 text-green-600 capitalize">{userRole}</p>
            <p className="text-gray-400 text-sm">Your account type</p>
          </div>
        </div>

        {/* ✅ Hospitals — Rich Cards */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">🏥 Hospitals / Clinics</h3>
            <Link href="/hospitals" className="text-purple-600 text-sm hover:underline">అన్నీ చూడండి →</Link>
          </div>
          {hospitals.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Hospitals లేవు</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hospitals.map((h) => (
                <Link
                  key={h.id}
                  href={`/hospitals/${h.id}/book`}
                  className="block border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white"
                >
                  {/* Cover */}
                  <div className="h-28 bg-gradient-to-br from-purple-500 to-purple-800 relative">
                    {h.cover_image && (
                      <img src={h.cover_image} alt="" className="w-full h-full object-cover" />
                    )}
                    {Number(h.rating) > 0 && (
                      <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-2 py-1 rounded-lg shadow">
                        ⭐ {h.rating}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Doctor avatar */}
                      <div className="-mt-10 w-14 h-14 rounded-xl border-2 border-white shadow bg-purple-100 flex items-center justify-center overflow-hidden shrink-0">
                        {h.doctor_image ? (
                          <img src={h.doctor_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-purple-700 font-bold text-lg">{(h.name || '?')[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 truncate">{h.name}</p>
                        <p className="text-xs text-gray-500 truncate">📍 {h.location || '—'}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap mt-3">
                      {h.specialization && (
                        <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-medium">
                          {h.specialization}
                        </span>
                      )}
                      {Number(h.success_rate) > 0 && (
                        <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md font-medium">
                          {h.success_rate}% success
                        </span>
                      )}
                    </div>

                    {h.doctor_name && (
                      <p className="text-sm text-gray-600 mt-2">👨‍⚕️ {h.doctor_name}</p>
                    )}

                    <div className="mt-3 bg-purple-600 text-white text-center py-2 rounded-lg text-sm font-semibold">
                      Book చేయండి
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Appointments */}
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