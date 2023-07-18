import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LeadGeneration from './pages/lead-generation';
import LoanOfficer from './pages/loanOfficer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LeadGeneration />,
  },
  {
    path: '/loanOfficer',
    element: <LoanOfficer />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
