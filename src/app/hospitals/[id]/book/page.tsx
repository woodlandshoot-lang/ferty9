'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const hospitals: Record<number, string> = {
  1: 'Nova IVF Fertility',
  2: 'Oasis Fertility',
  3: 'Ankura Hospital',
}

export default function BookAppointmentPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const hospitalName = hospitals[id] || 'Hospital'
  const [form, setForm] = useState({ name: '', phone: '', date: '', treatment: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const treatments = ['IVF', 'IUI', 'ICSI', 'Egg Freezing', 'Donor Egg', 'Surrogacy', 'Fertility Consultation']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { error: err } = await supabase.from('appointments').insert({
        user_id: user?.id,
        hospital_id: id,
        hospital_name: hospitalName,
        patient_name: form.name,
        phone: form.phone,
        appointment_date: form.date,
        treatment_type: form.treatment,
        notes: form.notes,
        status: 'pending',
      })
      if (err) throw err
      setSuccess(true)
    } catch {
      setError('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your appointment at {hospitalName} is booked!</p>
          <button onClick={() => router.push('/dashboard')} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl">Go to Dashboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">FERTY9</h1>
        <Link href={'/hospitals/' + id} className="text-purple-600 text-sm">Back</Link>
      </header>
      <div className="max-w-lg mx-auto p-4">
        <div className="bg-purple-50 rounded-2xl p-4 mb-6">
          <p className="text-purple-700 font-semibold">Booking for: {hospitalName}</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="9XXXXXXXXX" className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date *</label>
            <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Type *</label>
            <select required value={form.treatment} onChange={e => setForm({ ...form, treatment: e.target.value })} className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400">
              <option value="">Select Treatment</option>
              {treatments.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any specific requirements..." rows={3} className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl text-lg disabled:opacity-50">
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}