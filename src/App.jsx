import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LeadGeneration from './pages/lead-generation';
import WelcomeBackResumeJourney from './pages/lead-generation/WelcomeBackResumeJourney';

function App() {
  const router = createBrowserRouter([
    {
      path: '/:id',
      element: <WelcomeBackResumeJourney />,
    },
    {
      path: '/',
      element: <LeadGeneration />,
    },
  ]);

  return (
      <RouterProvider router={router} />
  );
}

export default App;
