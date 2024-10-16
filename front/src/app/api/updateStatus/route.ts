import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; // Asegúrate de que esta ruta sea correcta

export async function POST(request: Request) {
  const { appointmentId, status } = await request.json(); // Obtener los datos del cuerpo de la solicitud

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
    return NextResponse.json(updatedAppointment); // Devolver la cita actualizada como respuesta
  } catch (error) {
    console.error('Error actualizando la cita:', error);
    return NextResponse.json({ error: 'Error actualizando la cita' }, { status: 500 });
  }
}
