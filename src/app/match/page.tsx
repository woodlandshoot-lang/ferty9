'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const QUESTIONS = [
  { key: 'age', q: 'మీ వయసు?', options: ['25–30', '31–35', '36–40', '40+'] },
  { key: 'years', q: 'ఎన్ని సంవత్సరాలుగా try చేస్తున్నారు?', options: ['1–2 yrs', '3–5 yrs', '5+ yrs', 'కొత్తగా'] },
  { key: 'treatment', q: 'ఏ treatment చూస్తున్నారు?', options: ['IVF', 'IUI', 'ICSI', 'Not sure'] },
  { key: 'budget', q: 'మీ budget range?', options: ['₹50K–1L', '₹1L–2L', '₹2L+', 'తెలియదు'] },
]

const COST: Record<string, string> = {
  IVF: '₹1,00,000 – ₹1,50,000',
  IUI: '₹10,000 – ₹25,000',
  ICSI: '₹1,50,000 – ₹2,50,000',
  'Not sure': '₹500 – ₹2,000 (consultation)',
}

export default function MatchPage() {
  const router = useRouter()
  const [hospitals, setHospitals] = useState<any[]>([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [cityStep, setCityStep] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('hospitals').select('*')
      setHospitals(data || [])
    }
    load()
  }, [])

  const cities = ['Any city', ...Array.from(new Set(hospitals.map(h => h.location).filter(Boolean)))]

  function pick(key: string, value: string) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setCityStep(true)
    }
  }

  function pickCity(c: string) {
    setAnswers(a => ({ ...a, city: c }))
    setCityStep(false)
    setDone(true)
  }

  function score(h: any) {
    let s = 0
    s += Math.min(Number(h.success_rate || 0), 100) * 0.35
    s += (Number(h.rating || 0) / 5) * 25
    if (answers.city && answers.city !== 'Any city' && h.location && h.location.toLowerCase().includes(answers.city.toLowerCase())) s += 30
    if (answers.treatment && h.specialization && h.specialization.toLowerCase().includes(answers.treatment.toLowerCase())) s += 10
    return Math.round(Math.min(s, 99))
  }

  const top3 = [...hospitals].map(h => ({ ...h, _score: score(h) })).sort((a, b) => b._score - a._score).slice(0, 3)
  const totalSteps = QUESTIONS.length + 1
  const currentStep = done ? totalSteps : cityStep ? QUESTIONS.length : step
  const progress = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">PREGA9</h1>
        <Link href="/" className="text-purple-600 text-sm">← Home</Link>
      </header>

      <div className="max-w-lg mx-auto p-4">
        {!done && (
          <>
            <div className="text-center mb-6 mt-4">
              <h2 className="text-2xl font-black text-gray-800">30 సెకన్లలో మీ best hospital కనుక్కోండి</h2>
              <p className="text-gray-500 text-sm mt-2">కొన్ని ప్రశ్నలకు సమాధానం ఇవ్వండి</p>
            </div>

            {/* Progress */}
            <div className="w-full h-2 bg-purple-100 rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-purple-600 transition-all" style={{ width: `${progress}%` }} />
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              {!cityStep ? (
                <>
                  <p className="text-sm text-purple-600 font-medium mb-1">Question {step + 1} / {totalSteps}</p>
                  <h3 className="text-xl font-bold text-gray-800 mb-5">{QUESTIONS[step].q}</h3>
                  <div className="flex flex-col gap-3">
                    {QUESTIONS[step].options.map(opt => (
                      <button key={opt} onClick={() => pick(QUESTIONS[step].key, opt)}
                        className="w-full text-left border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl px-4 py-3 font-medium text-gray-700 transition">
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-purple-600 font-medium mb-1">Question {totalSteps} / {totalSteps}</p>
                  <h3 className="text-xl font-bold text-gray-800 mb-5">మీ city?</h3>
                  <div className="flex flex-col gap-3">
                    {cities.map(c => (
                      <button key={c} onClick={() => pickCity(c)}
                        className="w-full text-left border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl px-4 py-3 font-medium text-gray-700 transition">
                        📍 {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {done && (
          <div className="mt-4">
            <div className="text-center mb-6">
              <p className="text-4xl mb-2">🎯</p>
              <h2 className="text-2xl font-black text-gray-800">మీకు సరిపోయే Top hospitals</h2>
              <p className="text-gray-500 text-sm mt-1">మీ answers ఆధారంగా match చేశాం</p>
            </div>

            {top3.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Hospitals లేవు</p>
            ) : (
              <div className="flex flex-col gap-4">
                {top3.map((h, i) => (
                  <div key={h.id} className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="flex">
                      <div className="w-2 bg-purple-600" />
                      <div className="flex-1 p-5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs text-purple-600 font-bold">#{i + 1} MATCH</p>
                            <h3 className="font-bold text-lg text-gray-800">{h.name}</h3>
                            <p className="text-sm text-gray-500">📍 {h.location || '—'}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-purple-600">{h._score}%</div>
                            <p className="text-xs text-gray-400">match</p>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap my-3">
                          {Number(h.rating) > 0 && (
                            <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-semibold">⭐ {h.rating}</span>
                          )}
                          {Number(h.success_rate) > 0 && (
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">{h.success_rate}% success</span>
                          )}
                          {h.specialization && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-semibold">{h.specialization}</span>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-xs text-gray-500">Estimated cost ({answers.treatment})</p>
                          <p className="font-bold text-gray-800">{COST[answers.treatment] || '₹50,000 – ₹1,50,000'}</p>
                        </div>

                        <button onClick={() => router.push(`/hospitals/${h.id}`)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl text-sm transition">
                          View & Book →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => { setStep(0); setAnswers({}); setDone(false); setCityStep(false) }}
              className="w-full mt-4 border border-purple-300 text-purple-600 py-2.5 rounded-xl text-sm font-medium">
              మళ్ళీ try చేయండి
            </button>
          </div>
        )}
      </div>
    </div>
  )
}