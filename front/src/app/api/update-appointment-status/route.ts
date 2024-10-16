import { NextResponse } from 'next/server';
import { updateAppointmentStatus } from '@/app/lib/db'; // Asegúrate de que esta ruta sea correcta

export async function PATCH(request: Request) {
  try {
    const { appointmentId, status } = await request.json(); // Obtener los datos del cuerpo de la solicitud

    if (!appointmentId || !status) {
      return NextResponse.json({ error: 'Faltan appointmentId o status' }, { status: 400 });
    }

    // Actualizar el estado de la cita en tu base de datos
    await updateAppointmentStatus(appointmentId, status);
    return NextResponse.json({ message: 'Estado de la cita actualizado' }, { status: 200 });
  } catch (error) {
    console.error('Error actualizando la cita:', error);
    return NextResponse.json({ error: 'Error al actualizar la cita' }, { status: 500 });
  }
}
