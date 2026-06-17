'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const roles = [
  { id: 'patient', label: 'Patient', sublabel: 'భార్యాభర్తలు', emoji: '👨‍👩‍👧' },
  { id: 'hospital', label: 'Hospital', sublabel: 'Clinic', emoji: '🏥' },
  { id: 'doctor', label: 'Doctor', sublabel: 'వైద్యుడు', emoji: '👨‍⚕️' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    setStep(2)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!selectedRole) { setError('Role select చేయండి'); return }
    if (formData.password !== formData.confirmPassword) { setError('Passwords match కావడం లేదు!'); return }
    if (formData.password.length < 6) { setError('Password కనీసం 6 characters ఉండాలి'); return }
    setLoading(true)
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.name, role: selectedRole } }
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: formData.name,
        role: selectedRole,
        subscription_status: 'free'
      })
    }
    router.push('/auth/login?registered=true')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700">PREGA9</h1>
          <p className="text-gray-500 mt-1">మీ fertility journey మొదలు పెట్టండి</p>
        </div>

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">మీరు ఎవరు?</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {roles.map((role) => (
                <button key={role.id} onClick={() => handleRoleSelect(role.id)}
                  className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer">
                  <span className="text-3xl mb-2">{role.emoji}</span>
                  <span className="font-semibold text-gray-800 text-sm">{role.label}</span>
                  <span className="text-xs text-gray-500">{role.sublabel}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              Already account ఉందా?{' '}
              <Link href="/auth/login" className="text-purple-600 font-medium hover:underline">Login చేయండి</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center mb-4">
              <button onClick={() => setStep(1)} className="text-purple-600 hover:underline text-sm mr-2">← Back</button>
              <span className="text-sm text-gray-500">
                {roles.find(r => r.id === selectedRole)?.emoji} {roles.find(r => r.id === selectedRole)?.label} గా register చేస్తున్నారు
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Register</h2>
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="మీ పేరు" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
                {loading ? 'Registering...' : 'Register చేయండి'}
              </button>
            </form>
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">
              <p className="text-green-700 text-sm font-medium">🎉 Free Plan తో మొదలు పెట్టండి!</p>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              Already account ఉందా?{' '}
              <Link href="/auth/login" className="text-purple-600 font-medium hover:underline">Login చేయండి</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}