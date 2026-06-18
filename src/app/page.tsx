'use client'

import { useState } from 'react'
import Link from 'next/link'

const hospitals = [
  {
    id: 1,
    name: 'Nova IVF Fertility',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.6,
    reviews: 2340,
    successRate: 72.5,
    cycles: '12,500+',
    price: '₹1.2L',
    accreditation: 'NABH',
    featured: true,
    emoji: '🏥',
    color: 'from-blue-600 to-blue-900',
    doctor: 'Dr. Hrishikesh Pai',
    exp: '35 yrs',
  },
  {
    id: 2,
    name: 'Cloudnine Fertility',
    city: 'Bangalore',
    state: 'Karnataka',
    rating: 4.4,
    reviews: 1856,
    successRate: 68.3,
    cycles: '8,200+',
    price: '₹1.4L',
    accreditation: 'JCI',
    featured: false,
    emoji: '🌸',
    color: 'from-purple-600 to-purple-900',
    doctor: 'Dr. Priya Selvaraj',
    exp: '22 yrs',
  },
  {
    id: 3,
    name: 'Oasis Fertility Centre',
    city: 'Hyderabad',
    state: 'Telangana',
    rating: 4.5,
    reviews: 1678,
    successRate: 70.1,
    cycles: '9,800+',
    price: '₹1.1L',
    accreditation: 'NABH',
    featured: true,
    emoji: '💊',
    color: 'from-rose-600 to-rose-900',
    doctor: 'Dr. Durga Gedela Rao',
    exp: '18 yrs',
  },
]

const treatments = [
  { name: 'IVF', emoji: '🧬', success: '72%' },
  { name: 'IUI', emoji: '💉', success: '25%' },
  { name: 'ICSI', emoji: '🔬', success: '70%' },
  { name: 'FET', emoji: '❄️', success: '65%' },
  { name: 'Egg Donation', emoji: '🥚', success: '75%' },
  { name: 'Surrogacy', emoji: '👩', success: 'Supported' },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [savedHospitals, setSavedHospitals] = useState<number[]>([3])

  const toggleSave = (id: number) => {
    setSavedHospitals(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    )
  }

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black text-sm font-bold">♥</div>
          <span className="font-bold text-xl tracking-tight flex items-center">
            FERTY<span className="inline-flex items-center justify-center w-5 h-5 bg-white text-black rounded text-xs font-black ml-0.5">9</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="text-sm font-semibold text-white/60 px-3 py-2">Sign In</Link>
          <Link href="/hospitals" className="text-sm font-bold bg-white text-black px-4 py-2 rounded-xl">Book Now</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 text-center w-full max-w-lg mx-auto">
          {/* Mother & Baby Illustration */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/40 via-rose-500/30 to-blue-500/40 animate-spin" style={{animationDuration:'8s'}} />
            <div className="absolute inset-1 rounded-full bg-black" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <path d="M65 45 Q55 38 50 30 Q48 22 58 20 Q68 18 70 28 Q72 36 65 45Z" fill="#c8a882"/>
                <ellipse cx="60" cy="42" rx="14" ry="15" fill="#c8a882"/>
                <path d="M46 36 Q42 25 50 18 Q60 12 70 18 Q78 25 74 36" fill="#2d1810"/>
                <path d="M46 36 Q40 46 44 56" stroke="#2d1810" strokeWidth="6" strokeLinecap="round" fill="none"/>
                <path d="M74 36 Q80 46 76 56" stroke="#2d1810" strokeWidth="5" strokeLinecap="round" fill="none"/>
                <path d="M55 50 Q57 53 60 53 Q63 53 65 50" stroke="#8b6347" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <ellipse cx="72" cy="75" rx="28" ry="20" fill="#1a1520"/>
                <path d="M34 62 Q28 55 35 48 Q42 43 48 56 Q52 64 58 70" stroke="#c8a882" strokeWidth="9" strokeLinecap="round" fill="none"/>
                <path d="M86 62 Q92 55 85 48 Q78 43 72 56 Q68 64 62 70" stroke="#c8a882" strokeWidth="9" strokeLinecap="round" fill="none"/>
                <ellipse cx="60" cy="78" rx="16" ry="11" fill="#d4eef7"/>
                <ellipse cx="60" cy="67" rx="10" ry="9" fill="#f5d5b5"/>
                <path d="M52 60 Q56 56 60 58 Q64 56 68 60" stroke="#8b6040" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M56 66 Q58 64 60 66" stroke="#c4875a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M60 66 Q62 64 64 66" stroke="#c4875a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="50" cy="82" r="5" fill="#f5d5b5"/>
                <text x="80" y="55" fontSize="7" fill="rgba(244,63,94,0.7)">♥</text>
                <text x="32" y="58" fontSize="5" fill="rgba(244,63,94,0.5)">♥</text>
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
          </div>

          {/* Quote */}
          <div className="mb-8">
            <div className="text-6xl font-black text-transparent" style={{WebkitTextStroke:'1px rgba(14,165,233,0.2)',fontFamily:'Georgia'}}>
              &ldquo;
            </div>
            <p className="text-lg text-white/50 italic -mt-4 mb-2">India's most trusted</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-2 bg-gradient-to-r from-white via-blue-200 to-rose-300 bg-clip-text text-transparent">
              fertility hospital platform
            </h1>
            <p className="text-lg text-white/50 italic mb-2">Find, compare & book with full transparency.</p>
            <div className="text-6xl font-black text-transparent text-right" style={{WebkitTextStroke:'1px rgba(244,63,94,0.18)',fontFamily:'Georgia'}}>
              &rdquo;
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-rose-400 mx-auto -mt-2 rounded" />
          </div>

          <p className="text-sm text-white/40 italic mb-8">
            That moment is waiting for you.<br/>
            We help you find the right hospital to get there.
          </p>

          {/* Search */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Search hospital, city or treatment…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30"
            />
            <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold">
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {[['500+','Hospitals'],['72%','Avg Success'],['50K+','Helped']].map(([val,label]) => (
              <div key={label} className="bg-white/5 py-4 text-center backdrop-blur-sm">
                <div className="text-xl font-black text-white">{val}</div>
                <div className="text-xs text-white/30 uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="grid grid-cols-2 gap-px bg-white/10 border-y border-white/10">
        {[['500+','Verified Hospitals'],['72%','Avg IVF Success'],['50K+','Couples Helped'],['25K+','Verified Reviews']].map(([v,l]) => (
          <div key={l} className="bg-black py-6 px-4 text-center">
            <div className="text-3xl font-black text-white">{v.replace('+','')}<span className="text-blue-400">{v.includes('+') ? '+' : v.includes('%') ? '' : ''}</span></div>
            <div className="text-xs text-white/30 uppercase tracking-wider mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* HOSPITALS */}
      <section className="bg-zinc-950 py-14 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">Top Rated</div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-1">Featured Hospitals</h2>
          <p className="text-sm text-white/40 mb-8">Handpicked with verified success rates</p>

          <div className="flex flex-col gap-3">
            {filteredHospitals.map((h, i) => (
              <div key={h.id} className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden active:scale-99 transition-transform cursor-pointer">
                <div className={`h-28 bg-gradient-to-br ${h.color} flex items-center justify-center relative`}>
                  <span className="text-6xl opacity-20">{h.emoji}</span>
                  {h.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-lg">⭐ FEATURED</div>
                  )}
                  <button
                    onClick={() => toggleSave(h.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-base"
                  >
                    {savedHospitals.includes(h.id) ? '♥' : '♡'}
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center text-lg -mt-8 border-2 border-black shrink-0`}>
                      {h.emoji}
                    </div>
                    <div>
                      <div className="font-bold text-white text-base">{h.name}</div>
                      <div className="text-xs text-white/40">📍 {h.city}, {h.state}</div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    <span className="text-xs bg-blue-500/15 text-blue-300 border border-blue-500/25 px-2 py-0.5 rounded-md font-semibold">✓ {h.accreditation}</span>
                    <span className="text-xs bg-green-500/15 text-green-300 border border-green-500/25 px-2 py-0.5 rounded-md font-semibold">⭐ {h.rating} ({h.reviews.toLocaleString()})</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      [h.successRate + '%', 'Success Rate', 'text-emerald-400'],
                      [h.cycles, 'IVF Cycles', 'text-blue-400'],
                      [h.price, 'Starting', 'text-white'],
                    ].map(([val, label, color]) => (
                      <div key={label} className="bg-white/5 border border-white/8 rounded-xl p-2 text-center">
                        <div className={`text-sm font-black ${color}`}>{val}</div>
                        <div className="text-xs text-white/30 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/5 rounded-xl p-2.5 flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold text-black shrink-0">
                      {h.doctor.split(' ').map(w => w[0]).join('').slice(1,3)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{h.doctor}</div>
                      <div className="text-xs text-white/30">{h.exp} experience</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button className="col-span-1 bg-white text-black py-2.5 rounded-xl text-xs font-bold">📅 Book</button>
                    <button className="bg-green-500/15 border border-green-500/25 text-green-400 py-2.5 rounded-xl text-xs font-semibold">💬 Chat</button>
                    <button
                      onClick={() => toggleSave(h.id)}
                      className={`py-2.5 rounded-xl text-base border ${savedHospitals.includes(h.id) ? 'bg-rose-500/15 border-rose-500/25 text-rose-400' : 'bg-white/5 border-white/10 text-white/40'}`}
                    >
                      {savedHospitals.includes(h.id) ? '♥' : '♡'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-4 border border-white/15 rounded-2xl text-sm font-semibold text-white/60">
            View All 500+ Hospitals →
          </button>
        </div>
      </section>

      {/* TREATMENTS */}
      <section className="bg-black py-14 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">All Treatments</div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-6">What We Cover</h2>
          <div className="grid grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {treatments.map(t => (
              <div key={t.name} className="bg-zinc-950 p-4 cursor-pointer active:bg-zinc-900 transition-colors relative">
                <div className="text-2xl mb-2">{t.emoji}</div>
                <div className="text-sm font-bold text-white">{t.name}</div>
                <div className="text-xs text-white/30 mt-0.5">Avg {t.success} success</div>
                <span className="absolute top-3 right-3 text-white/20 text-sm">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-zinc-950 py-14 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">Simple Process</div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-6">3 Steps to Your Hospital</h2>
          <div className="flex flex-col divide-y divide-white/10">
            {[
              ['1', '🔍', 'Search & Filter', 'Filter by city, treatment, success rate & budget.'],
              ['2', '⚖️', 'Compare Side by Side', 'Compare success rates, pricing, doctors & reviews.'],
              ['3', '📅', 'Book & Connect', 'Book online or WhatsApp directly. Zero phone calls.'],
            ].map(([num, icon, title, desc]) => (
              <div key={num} className="flex gap-4 py-5">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/15 flex items-center justify-center text-sm font-black text-white shrink-0">
                  {num}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white mb-1">{title}</div>
                  <div className="text-sm text-white/40">{desc}</div>
                </div>
                <span className="text-xl self-center">{icon}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-white/10 px-4 py-10 pb-24">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black text-xs font-bold">♥</div>
            <span className="font-black text-lg text-white tracking-tight flex items-center">
              FERTY<span className="inline-flex items-center justify-center w-4 h-4 bg-white text-black rounded text-xs font-black ml-0.5">9</span>
            </span>
          </div>
          <p className="text-sm text-white/30 mb-4 leading-relaxed">
            India's most trusted fertility hospital platform. Find, compare & book with full transparency.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/30 mb-4">
            <span>📞 +91 80000 00000</span>
            <span>✉️ hello@PREGA9 .in</span>
          </div>
          <div className="flex gap-4 text-xs text-white/20">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">About</a>
          </div>
          <div className="mt-4 text-xs text-white/10">© 2025 PREGA9 . All rights reserved.</div>
        </div>
      </footer>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 flex z-50">
        {[['🏠','Home'],['🔍','Search'],['⚖️','Compare'],['📊','Account'],['💳','Plans']].map(([icon, label]) => (
          <button key={label} className="flex-1 flex flex-col items-center gap-1 py-3">
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-xs text-white/30 font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* WA FLOAT */}
      <a
        href="https://wa.me/918000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl shadow-lg shadow-green-500/40 z-40"
      >
        💬
      </a>
    </div>
  )
}
