import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { useAuthInit } from './hooks/useAuthInit';

const App = () => {
  useAuthInit(); // initialize auth state on app load

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;