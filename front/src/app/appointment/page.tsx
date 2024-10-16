import React, { Suspense } from 'react';
import AppointmentForm from '@/components/AddApp/AddApp';

const AppointmentPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AppointmentForm />
      </Suspense>
    </div>
  );
};

export default AppointmentPage;
