'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function HospitalAdminPage() {
  const router = useRouter()
  const [hospital, setHospital] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState('profile')
  const [user, setUser] = useState<any>(null)

  const [profile, setProfile] = useState({ name: '', location: '', specialization: '', phone: '', description: '' })
  const [videoUrl, setVideoUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [story, setStory] = useState({ name: '', message: '', rating: 5, date: '' })
  const [stories, setStories] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      if (user.user_metadata?.role !== 'hospital') { router.push('/dashboard'); return }
      setUser(user)

      // Phone లేదా user_id తో hospital fetch చేయాలి
      let { data } = await supabase.from('hospitals')
        .select('*').eq('user_id', user.id).single()

      // user_id లేకపోతే phone తో try చేయాలి
      if (!data) {
        const res = await supabase.from('hospitals')
          .select('*').eq('phone', user.user_metadata?.phone).single()
        data = res.data
      }

      if (data) {
        setHospital(data)
        setProfile({ name: data.name || '', location: data.location || '', specialization: data.specialization || '', phone: data.phone || '', description: data.description || '' })
        setVideoUrl(data.video_url || '')
        setImages(data.images || [])
        setStories(data.success_stories || [])
      } else {
        // Hospital లేకపోతే user info తో pre-fill చేయాలి
        setProfile(p => ({ ...p, 
          name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || ''
        }))
      }
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    setSaving(true)
    const supabase = createClient()
    if (hospital) {
      await supabase.from('hospitals').update(profile).eq('id', hospital.id)
      setMsg('Profile saved! ✅')
    } else {
      // కొత్త hospital create చేయాలి
      const { data } = await supabase.from('hospitals')
        .insert({ ...profile, user_id: user.id })
        .select().single()
      if (data) {
        setHospital(data)
        setMsg('Hospital profile created! ✅')
      }
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function saveVideo() {
    if (!hospital) { setMsg('ముందు profile save చేయండి!'); return }
    setSaving(true)
    const supabase = createClient()
    await supabase.from('hospitals').update({ video_url: videoUrl }).eq('id', hospital.id)
    setMsg('Video saved! ✅')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function addImage() {
    if (!hospital) { setMsg('ముందు profile save చేయండి!'); return }
    if (!imageUrl) return
    const newImages = [...images, imageUrl]
    const supabase = createClient()
    await supabase.from('hospitals').update({ images: newImages }).eq('id', hospital.id)
    setImages(newImages)
    setImageUrl('')
    setMsg('Image added! ✅')
    setTimeout(() => setMsg(''), 3000)
  }

  async function removeImage(idx: number) {
    const newImages = images.filter((_, i) => i !== idx)
    const supabase = createClient()
    await supabase.from('hospitals').update({ images: newImages }).eq('id', hospital.id)
    setImages(newImages)
  }

  async function addStory() {
    if (!hospital) { setMsg('ముందు profile save చేయండి!'); return }
    if (!story.name || !story.message) return
    const newStories = [...stories, { ...story, date: new Date().toLocaleDateString() }]
    const supabase = createClient()
    await supabase.from('hospitals').update({ success_stories: newStories }).eq('id', hospital.id)
    setStories(newStories)
    setStory({ name: '', message: '', rating: 5, date: '' })
    setMsg('Story added! ✅')
    setTimeout(() => setMsg(''), 3000)
  }

  async function removeStory(idx: number) {
    const newStories = stories.filter((_, i) => i !== idx)
    const supabase = createClient()
    await supabase.from('hospitals').update({ success_stories: newStories }).eq('id', hospital.id)
    setStories(newStories)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-700">PREGA9 — Hospital Admin</h1>
        <button onClick={async () => { const s = createClient(); await s.auth.signOut(); router.push('/auth/login') }}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">Logout</button>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {msg && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4">{msg}</div>}

        {!hospital && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <p className="text-yellow-700 text-sm">⚠️ Profile details fill చేసి Save చేయండి — hospital create అవుతుంది!</p>
          </div>
        )}

        {hospital && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <p className="text-green-700 text-sm">✅ {hospital.name} — Profile active!</p>
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {['profile', 'photos', 'video', 'stories'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm capitalize whitespace-nowrap ${tab === t ? 'bg-purple-600 text-white' : 'bg-white border'}`}>
              {t === 'photos' ? '📸 Photos' : t === 'video' ? '🎥 Video' : t === 'stories' ? '⭐ Stories' : '👤 Profile'}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h3 className="font-bold text-lg">👤 Hospital Profile</h3>
            {['name', 'location', 'specialization', 'phone'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <input value={(profile as any)[field]} onChange={e => setProfile({ ...profile, [field]: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })}
                rows={3} className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <button onClick={saveProfile} disabled={saving}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : hospital ? 'Update Profile' : 'Create Hospital Profile'}
            </button>
          </div>
        )}

        {tab === 'photos' && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h3 className="font-bold text-lg">📸 Hospital Photos</h3>
            <div className="flex gap-2">
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                placeholder="Image URL paste చేయండి"
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button onClick={addImage} className="bg-purple-600 text-white px-4 py-2 rounded-lg">Add</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-full h-32 object-cover rounded-xl" />
                  <button onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs">✕</button>
                </div>
              ))}
            </div>
            {images.length === 0 && <p className="text-gray-400 text-center py-4">Photos లేవు ఇంకా</p>}
          </div>
        )}

        {tab === 'video' && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h3 className="font-bold text-lg">🎥 Hospital Video</h3>
            <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
              placeholder="YouTube URL (https://www.youtube.com/watch?v=xxxxx)"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button onClick={saveVideo} disabled={saving}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Video'}
            </button>
            {videoUrl && (
              <div className="relative pb-56 h-0 overflow-hidden rounded-xl">
                <iframe className="absolute top-0 left-0 w-full h-full"
                  src={videoUrl.replace('watch?v=', 'embed/')} allowFullScreen />
              </div>
            )}
          </div>
        )}

        {tab === 'stories' && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h3 className="font-bold text-lg">⭐ Success Stories</h3>
            <input value={story.name} onChange={e => setStory({ ...story, name: e.target.value })}
              placeholder="Patient పేరు" className="w-full border rounded-lg px-4 py-2" />
            <textarea value={story.message} onChange={e => setStory({ ...story, message: e.target.value })}
              placeholder="వారి story..." rows={3} className="w-full border rounded-lg px-4 py-2" />
            <select value={story.rating} onChange={e => setStory({ ...story, rating: Number(e.target.value) })}
              className="w-full border rounded-lg px-4 py-2">
              {[5,4,3].map(r => <option key={r} value={r}>{r} ⭐</option>)}
            </select>
            <button onClick={addStory}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold">Add Story</button>
            <div className="space-y-3">
              {stories.map((s, i) => (
                <div key={i} className="border rounded-xl p-3 bg-purple-50 flex justify-between">
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-sm text-gray-600">{s.message}</p>
                    <p>{'⭐'.repeat(s.rating)}</p>
                  </div>
                  <button onClick={() => removeStory(i)} className="text-red-500 text-sm">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}