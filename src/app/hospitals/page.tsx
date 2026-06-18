'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('All Cities')
  const [minSuccess, setMinSuccess] = useState(0)
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('hospitals').select('*')
      setHospitals(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const cities = ['All Cities', ...Array.from(new Set(hospitals.map(h => h.location).filter(Boolean)))]

  const filtered = hospitals
    .filter(h => (h.name || '').toLowerCase().includes(search.toLowerCase()) || (h.location || '').toLowerCase().includes(search.toLowerCase()))
    .filter(h => city === 'All Cities' || h.location === city)
    .filter(h => Number(h.success_rate || 0) >= minSuccess)
    .sort((a, b) => {
      if (sortBy === 'rating') return Number(b.rating || 0) - Number(a.rating || 0)
      if (sortBy === 'success') return Number(b.success_rate || 0) - Number(a.success_rate || 0)
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
      return 0
    })

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-purple-700">PREGA9</h1>
        <Link href="/dashboard" className="text-purple-600 text-sm">← Dashboard</Link>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        <div className="flex gap-2 mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search hospitals or location..."
            className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl font-medium text-sm transition ${showFilters ? 'bg-purple-600 text-white' : 'bg-white border text-gray-600'}`}
          >
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl shadow p-4 mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">City / Location</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Min Success Rate: {minSuccess}%</label>
              <input type="range" min={0} max={90} step={5} value={minSuccess} onChange={e => setMinSuccess(Number(e.target.value))} className="w-full accent-purple-600" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option value="rating">Rating</option>
                <option value="success">Success Rate</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-gray-500">{filtered.length} hospitals found</p>
          <div className="flex gap-2">
            {city !== 'All Cities' && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">{city}</span>}
            {minSuccess > 0 && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">{minSuccess}%+</span>}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">No hospitals found</p>
            <button onClick={() => { setSearch(''); setCity('All Cities'); setMinSuccess(0) }} className="mt-3 text-purple-600 text-sm underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(h => (
              <Link
                key={h.id}
                href={`/hospitals/${h.id}`}
                className="block bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
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
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="-mt-12 w-14 h-14 rounded-xl border-2 border-white shadow bg-purple-100 flex items-center justify-center overflow-hidden shrink-0">
                      {h.doctor_image ? (
                        <img src={h.doctor_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-purple-700 font-bold text-lg">{(h.name || '?')[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-800 truncate">{h.name}</h3>
                      <p className="text-gray-500 text-sm truncate">📍 {h.location || '—'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap mt-3 mb-4">
                    {h.specialization && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-lg text-xs font-medium">{h.specialization}</span>
                    )}
                    {Number(h.success_rate) > 0 && (
                      <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg text-xs font-medium">{h.success_rate}% success</span>
                    )}
                    {h.doctor_name && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs">👨‍⚕️ {h.doctor_name}</span>
                    )}
                  </div>

                  <div className="w-full bg-purple-600 text-white font-semibold py-2 rounded-xl text-sm text-center">
                    View & Book →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}