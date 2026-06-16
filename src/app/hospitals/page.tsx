'use client'
import { useState } from 'react'
import Link from 'next/link'

const hospitals = [
  { id: 1, name: 'Nova IVF Fertility', city: 'Hyderabad', rating: 4.8, successRate: 75, price: 120000, accreditation: 'NABH', treatments: ['IVF', 'IUI', 'ICSI', 'Egg Freezing'] },
  { id: 2, name: 'Oasis Fertility', city: 'Hyderabad', rating: 4.7, successRate: 72, price: 100000, accreditation: 'NABH', treatments: ['IVF', 'IUI', 'ICSI', 'Donor Egg'] },
  { id: 3, name: 'Ankura Hospital', city: 'Hyderabad', rating: 4.6, successRate: 70, price: 95000, accreditation: 'ISO', treatments: ['IVF', 'IUI', 'Surrogacy'] },
  { id: 4, name: 'Kamineni Fertility', city: 'Hyderabad', rating: 4.5, successRate: 68, price: 90000, accreditation: 'NABH', treatments: ['IVF', 'IUI', 'ICSI'] },
  { id: 5, name: 'Rainbow Hospitals', city: 'Bangalore', rating: 4.9, successRate: 80, price: 150000, accreditation: 'NABH', treatments: ['IVF', 'ICSI', 'Egg Freezing', 'Donor Egg'] },
  { id: 6, name: 'Milann Fertility', city: 'Bangalore', rating: 4.7, successRate: 74, price: 130000, accreditation: 'ISO', treatments: ['IVF', 'IUI', 'Surrogacy'] },
  { id: 7, name: 'Cloudnine Fertility', city: 'Chennai', rating: 4.6, successRate: 71, price: 110000, accreditation: 'NABH', treatments: ['IVF', 'IUI', 'ICSI'] },
  { id: 8, name: 'GG Hospital', city: 'Chennai', rating: 4.4, successRate: 66, price: 85000, accreditation: 'ISO', treatments: ['IVF', 'IUI'] },
]

const cities = ['All Cities', 'Hyderabad', 'Bangalore', 'Chennai']
const treatmentsList = ['All', 'IVF', 'IUI', 'ICSI', 'Egg Freezing', 'Donor Egg', 'Surrogacy']

export default function HospitalsPage() {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('All Cities')
  const [treatment, setTreatment] = useState('All')
  const [minSuccess, setMinSuccess] = useState(0)
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = hospitals
    .filter(h => h.name.toLowerCase().includes(search.toLowerCase()))
    .filter(h => city === 'All Cities' || h.city === city)
    .filter(h => treatment === 'All' || h.treatments.includes(treatment))
    .filter(h => h.successRate >= minSuccess)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'success') return b.successRate - a.successRate
      if (sortBy === 'price_low') return a.price - b.price
      if (sortBy === 'price_high') return b.price - a.price
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-purple-700">PREGA9 </h1>
        <Link href="/dashboard" className="text-purple-600 text-sm">← Dashboard</Link>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        <div className="flex gap-2 mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search hospitals..."
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
          <div className="bg-white rounded-2xl shadow p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">City</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Treatment</label>
              <select value={treatment} onChange={e => setTreatment(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                {treatmentsList.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Min Success Rate: {minSuccess}%</label>
              <input type="range" min={0} max={80} step={5} value={minSuccess} onChange={e => setMinSuccess(Number(e.target.value))} className="w-full accent-purple-600" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option value="rating">Rating</option>
                <option value="success">Success Rate</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-gray-500">{filtered.length} hospitals found</p>
          <div className="flex gap-2">
            {city !== 'All Cities' && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">{city} ×</span>}
            {treatment !== 'All' && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">{treatment} ×</span>}
            {minSuccess > 0 && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">{minSuccess}%+ ×</span>}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">No hospitals found</p>
            <button onClick={() => { setSearch(''); setCity('All Cities'); setTreatment('All'); setMinSuccess(0) }} className="mt-3 text-purple-600 text-sm underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(h => (
              <div key={h.id} className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{h.name}</h3>
                    <p className="text-gray-500 text-sm">📍 {h.city} · {h.accreditation}</p>
                  </div>
                  <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm font-semibold">⭐ {h.rating}</span>
                </div>
                <div className="flex gap-2 flex-wrap mt-3 mb-4">
                  <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-medium">{h.successRate}% success</span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">₹{(h.price/1000).toFixed(0)}K</span>
                  {h.treatments.slice(0,2).map(t => <span key={t} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs">{t}</span>)}
                </div>
                <Link href={'/hospitals/' + h.id} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl text-sm block text-center transition">
                  View & Book →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}