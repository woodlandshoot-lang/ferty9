import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const { amount, planName, hospitalId } = await req.json()

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise లో (₹1 = 100 paise)
      currency: 'INR',
      receipt: `PREGA9 _${hospitalId}_${Date.now()}`.slice(0, 40),
      notes: {
        planName,
        hospitalId,
      },
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error('Razorpay error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}