'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

const H: Record<number, any> = {
  1: { id: 1, name: 'Nova IVF Fertility', city: 'Hyderabad', rating: 4.8, successRate: 75, price: '1.2L', doctor: 'Dr. Hrishikesh Pai', treatments: ['IVF', 'IUI', 'ICSI', 'Egg Freezing'], about: 'Nova IVF Fertility is India leading fertility chain with 75% success rate and 10000+ successful pregnancies.', phone: '9100000001' },
  2: { id: 2, name: 'Oasis Fertility', city: 'Hyderabad', rating: 4.7, successRate: 72, price: '1.0L', doctor: 'Dr. Durga Rao', treatments: ['IVF', 'IUI', 'ICSI', 'Donor Egg'], about: 'Oasis Fertility offers world-class fertility treatment with cutting-edge technology.', phone: '9100000002' },
  3: { id: 3, name: 'Ankura Hospital', city: 'Hyderabad', rating: 4.6, successRate: 70, price: '95K', doctor: 'Dr. Suresh Kumar', treatments: ['IVF', 'IUI', 'Surrogacy'], about: 'Ankura Hospital trusted name in fertility care with 70% IVF success rate.', phone: '9100000003' },
}

export default function HospitalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const h = H[id]
  const [tab, setTab] = useState('about')

  if (!h) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Hospital not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">PREGA9 </h1>
        <Link href="/hospitals" className="text-purple-600 text-sm">← Back</Link>
      </header>
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          <h2 className="text-2xl font-bold">{h.name}</h2>
          <p className="text-gray-500 text-sm mt-1">📍 {h.city}</p>
          <div className="flex gap-3 mt-3 flex-wrap">
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm">{h.successRate}% success</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm">₹{h.price}</span>
            <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-sm">⭐ {h.rating}</span>
          </div>
          <p className="text-gray-600 text-sm mt-2">👨‍⚕️ {h.doctor}</p>
        </div>

        <div className="flex gap-2 mb-4">
          {['about', 'treatments', 'contact'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={tab === t ? 'px-4 py-2 rounded-full bg-purple-600 text-white text-sm capitalize' : 'px-4 py-2 rounded-full bg-white border text-sm capitalize'}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'about' && (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-600">{h.about}</p>
          </div>
        )}
        {tab === 'treatments' && (
          <div className="bg-white rounded-2xl shadow p-6 flex flex-wrap gap-2">
            {h.treatments.map((t: string) => (
              <span key={t} className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm">{t}</span>
            ))}
          </div>
        )}
        {tab === 'contact' && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-3">
            <a href={'tel:' + h.phone} className="block text-blue-600 font-medium">📞 {h.phone}</a>
            <a href={'https://wa.me/91' + h.phone + '?text=Hi I want appointment at ' + h.name} target="_blank" className="block text-green-600 font-medium">💬 WhatsApp Inquiry</a>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button onClick={() => router.push('/hospitals/' + h.id + '/book')}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl text-lg">
            📅 Book Appointment
          </button>
          <a href={'https://wa.me/91' + h.phone} target="_blank"
            className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}