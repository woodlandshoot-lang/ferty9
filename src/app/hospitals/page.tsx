'use client'
import { useState } from 'react'
import Link from 'next/link'
const H=[{id:1,name:'Nova IVF Fertility',city:'Hyderabad',rating:4.8,s:75,p:'1.2L'},{id:2,name:'Oasis Fertility',city:'Hyderabad',rating:4.7,s:72,p:'1.0L'},{id:3,name:'Ankura Hospital',city:'Hyderabad',rating:4.6,s:70,p:'95K'}]
export default function HospitalsPage(){
const[q,setQ]=useState('')
const f=H.filter(h=>h.name.toLowerCase().includes(q.toLowerCase()))
return(
<div className="min-h-screen bg-gray-50">
<header className="bg-white shadow px-6 py-4 flex justify-between items-center">
<h1 className="text-2xl font-bold text-purple-700">FERTY9</h1>
<Link href="/dashboard" className="text-purple-600 text-sm">← Back</Link>
</header>
<main className="max-w-4xl mx-auto p-6">
<h2 className="text-2xl font-bold mb-4">🏥 Hospitals</h2>
<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="w-full border rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{f.map(h=>(
<div key={h.id} className="bg-white rounded-2xl shadow p-5">
<h3 className="font-bold text-lg mb-1">{h.name}</h3>
<p className="text-gray-500 text-sm mb-3">📍 {h.city}</p>
<div className="flex gap-2 mb-3">
<span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm">{h.s}% success</span>
<span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm">₹{h.p}</span>
<span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm">⭐{h.rating}</span>
</div>
<Link href={'/hospitals/' + h.id} className="w-full bg-purple-600 text-white py-2 rounded-xl text-sm block text-center">Book Appointment →</Link>
</div>
))}
</div>
</main>
</div>
)
}