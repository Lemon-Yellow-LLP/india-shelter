import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const WelcomeBack = lazy(() => import('./welcome-back'));
const LeadGeneration = lazy(() => import('./lead-generation'));
import AuthContextLayout from '../context/AuthContext';

const LeadGenerationRoute = () => {
  return (
    <Routes>
      <Route element={<AuthContextLayout />}>
        <Route path='/:id' element={<WelcomeBack />} />
        <Route path='/' element={<LeadGeneration />} />
      </Route>
    </Routes>
  );
};

export { LeadGenerationRoute };
