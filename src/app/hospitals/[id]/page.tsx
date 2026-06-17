'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function HospitalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const [h, setH] = useState<any>(null)
  const [tab, setTab] = useState('about')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('hospitals').select('*').eq('id', id).single()
      setH(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  if (!h) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Hospital not found</p></div>

  const successStories = h.success_stories || []
  const images = h.images || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">PREGA9</h1>
        <Link href="/dashboard" className="text-purple-600 text-sm">← Back</Link>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Hospital Info */}
        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          <h2 className="text-2xl font-bold">{h.name}</h2>
          <p className="text-gray-500 text-sm mt-1">📍 {h.location}</p>
          <div className="flex gap-3 mt-3 flex-wrap">
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm">{h.specialization}</span>
            {h.rating && <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-sm">⭐ {h.rating}</span>}
          </div>
          {h.doctor && <p className="text-gray-600 text-sm mt-2">👨‍⚕️ {h.doctor}</p>}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {['about', 'images', 'video', 'stories', 'contact'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm capitalize whitespace-nowrap ${tab === t ? 'bg-purple-600 text-white' : 'bg-white border'}`}>
              {t === 'images' ? '📸 Photos' : t === 'video' ? '🎥 Video' : t === 'stories' ? '⭐ Stories' : t === 'contact' ? '📞 Contact' : '📋 About'}
            </button>
          ))}
        </div>

        {/* About */}
        {tab === 'about' && (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-600">{h.description || 'No description available'}</p>
          </div>
        )}

        {/* Images */}
        {tab === 'images' && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg mb-4">📸 Hospital Photos</h3>
            {images.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">📷</p>
                <p>Photos upload కాలేదు ఇంకా</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img: string, i: number) => (
                  <img key={i} src={img} alt={`Hospital ${i+1}`} className="rounded-xl w-full h-40 object-cover" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video */}
        {tab === 'video' && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg mb-4">🎥 Hospital Video</h3>
            {h.video_url ? (
              <div className="relative pb-56 h-0 overflow-hidden rounded-xl">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={h.video_url.replace('watch?v=', 'embed/')}
                  allowFullScreen />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">🎬</p>
                <p>Video upload కాలేదు ఇంకా</p>
              </div>
            )}
          </div>
        )}

        {/* Success Stories */}
        {tab === 'stories' && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-lg mb-4">⭐ Success Stories</h3>
            {successStories.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">💝</p>
                <p>Success stories లేవు ఇంకా</p>
              </div>
            ) : (
              <div className="space-y-4">
                {successStories.map((story: any, i: number) => (
                  <div key={i} className="border rounded-xl p-4 bg-purple-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">👶</span>
                      <div>
                        <p className="font-semibold">{story.name}</p>
                        <p className="text-xs text-gray-500">{story.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{story.message}</p>
                    {'⭐'.repeat(story.rating || 5)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact */}
        {tab === 'contact' && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-3">
            {h.phone && <a href={'tel:' + h.phone} className="block text-blue-600 font-medium">📞 {h.phone}</a>}
            {h.phone && <a href={`https://wa.me/91${h.phone}?text=Hi I want appointment at ${h.name}`} target="_blank" className="block text-green-600 font-medium">💬 WhatsApp Inquiry</a>}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button onClick={() => router.push('/hospitals/' + h.id + '/book')}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl text-lg">
            📅 Book Appointment
          </button>
          {h.phone && (
            <a href={`https://wa.me/91${h.phone}`} target="_blank"
              className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center">
              💬 WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}