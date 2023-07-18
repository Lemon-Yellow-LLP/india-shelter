import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LeadGeneration from './pages/lead-generation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LeadGeneration />,
  },
  {
    path: '/loanOfficer',
    element: <LeadGeneration />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
