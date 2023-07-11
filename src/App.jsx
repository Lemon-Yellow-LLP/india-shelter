import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LeadGenerationRoute } from './pages';
import Loader from './components/Loader';

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<LeadGenerationRoute />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
