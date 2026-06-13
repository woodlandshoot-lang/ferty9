'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window { Razorpay: any }
}

const plans = [
  { id: 'basic', name: 'Basic Plan', price: 2999, duration: '3 months', features: ['Hospital listing', '10 leads/month', 'Basic analytics', 'Email support'], color: 'border-blue-400', badge: '' },
  { id: 'pro', name: 'Pro Plan', price: 7999, duration: '6 months', features: ['Priority listing', '50 leads/month', 'Advanced analytics', 'Phone support', 'Featured badge'], color: 'border-purple-500', badge: '🔥 Popular' },
  { id: 'premium', name: 'Premium Plan', price: 14999, duration: '12 months', features: ['Top listing', 'Unlimited leads', 'Full analytics', '24/7 support', 'Social media promotion'], color: 'border-yellow-500', badge: '⭐ Best Value' },
]

export default function SubscriptionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handlePayment = async (plan: typeof plans[0]) => {
    setLoading(plan.id)
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: plan.price, planName: plan.name, hospitalId: 'hospital_123' }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: 'INR',
          name: 'FERTY9',
          description: plan.name,
          order_id: data.order.id,
          handler: (r: any) => {
            alert('✅ Payment Successful!\nPayment ID: ' + r.razorpay_payment_id)
            router.push('/dashboard')
          },
          theme: { color: '#7C3AED' },
        })
        rzp.open()
      }
    } catch (err: any) {
      alert('Payment failed: ' + err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">Hospital Subscription Plans</h1>
        <p className="text-center text-gray-500 mb-10">FERTY9 లో మీ hospital list చేయండి — patients మీకు చేరుకుంటారు!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-white rounded-2xl border-2 ${plan.color} p-6 shadow-sm relative`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <h2 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{plan.duration}</p>
              <p className="text-4xl font-bold text-purple-700 mb-6">₹{plan.price.toLocaleString()}</p>
              <ul className="space-y-2 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePayment(plan)}
                disabled={loading === plan.id}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
              >
                {loading === plan.id ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
