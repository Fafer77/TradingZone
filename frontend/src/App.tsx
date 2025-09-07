import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Playbook from "./pages/Playbook";
import Drc from "./pages/Drc";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePlaybookPage from "./pages/CreatePlaybookPage";
import PlaybookDetailPage from './pages/PlaybookDetailPage';
import EditPlaybookPage from './pages/EditPlaybookPage';

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
        path: 'drc',
        element: <Drc />,
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
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;