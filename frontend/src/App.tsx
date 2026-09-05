import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppRouter } from '@/routes/AppRouter';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
