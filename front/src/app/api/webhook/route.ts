import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51Q7otE00ffkRUeeSNKqMZLAVvxk5Eb0hwkkw7cVVYWiWPIPPTSe2fu4p3074vbNxPALEERydW5Vxw6VrKLVgpoq100Y1WEh078", {});

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    // Obtiene el cuerpo como texto
    const rawBody = await request.text();

    // Construye el evento usando el webhook de Stripe
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'Webhook Error: Unhandled exception' }, { status: 400 });
    }
  }

  // Manejar los eventos de Stripe aquí
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const appointmentId = session.metadata?.appointmentId;

    if (appointmentId) {
      try {
        // Actualizar el estado de la cita en la base de datos
        await updateAppointmentStatus(appointmentId, 'Pagado');
        console.log(`Pago confirmado y cita ${appointmentId} actualizada a Pagado`);
      } catch (error) {
        console.error('Error actualizando la cita:', error);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function updateAppointmentStatus(appointmentId: string, status: string) {
  // Aquí debes implementar la lógica para actualizar la cita en tu base de datos.
  // Por ejemplo, si estás usando MongoDB:
  // await Appointment.updateOne({ _id: appointmentId }, { status: status });
}
