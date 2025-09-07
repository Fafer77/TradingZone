import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Playbook from "./pages/Playbook";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePlaybookPage from "./pages/CreatePlaybookPage";
import PlaybookDetailPage from './pages/PlaybookDetailPage';
import EditPlaybookPage from './pages/EditPlaybookPage';
import DRCPage from './pages/DRCPage';
import CreateDRCPage from './pages/CreateDRCPage';
import DRCDetailPage from './pages/DRCDetailPage';
import EditDRCPage from './pages/EditDRCPage';
import TradeSamplesPage from './pages/TradeSamplesPage';
import TradeSampleDetailPage from './pages/TradeSampleDetailPage';
import CreateTradeSamplePage from "./pages/CreateTradeSamplePage";
import AddTradePage from './pages/AddTradePage';
import EditTradePage from "./pages/EditTradePage";

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'playbook',
        element: <Playbook />,
      },
      {
        path: 'playbook/new',
        element: <CreatePlaybookPage />
      },
      {
        path: 'playbook/:playbookId',
        element: <PlaybookDetailPage />
      },
      {
        path: 'playbook/edit/:playbookId',
        element: <EditPlaybookPage />
      },
      {
      path: 'drc',
      element: <DRCPage />,
      },
      {
        path: 'drc/new',
        element: <CreateDRCPage />,
      },
      {
        path: 'drc/:drcId',
        element: <DRCDetailPage />
      },
      {
        path: 'drc/edit/:drcId',
        element: <EditDRCPage />
      },
      {
        path: 'samples',
        element: <TradeSamplesPage />
      },
      {
        path: 'samples/:sampleId',
        element: <TradeSampleDetailPage />
      },
      {
        path: 'samples/new',
        element: <CreateTradeSamplePage />
      },
      {
        path: `samples/:sampleId/add-trade`,
        element: <AddTradePage />
      },
      {
        path: 'samples/:sampleId/trades/:tradeId/edit',
        element: <EditTradePage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;