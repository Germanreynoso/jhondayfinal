import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51Q7otE00ffkRUeeSNKqMZLAVvxk5Eb0hwkkw7cVVYWiWPIPPTSe2fu4p3074vbNxPALEERydW5Vxw6VrKLVgpoq100Y1WEh078", {});

export async function GET(request: Request) {
  // Obtiene el session_id de la URL
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const appointmentId = session.metadata?.appointmentId;

      return NextResponse.json({ status: 'paid', appointmentId });
    } else {
      return NextResponse.json({ status: 'unpaid' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    return NextResponse.json({ error: 'Error retrieving payment status' }, { status: 500 });
  }
}
