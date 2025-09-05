import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from "./layout";
import Playbook from "./pages/Playbook";
import Drc from "./pages/Drc";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'playbook',
        element: <Playbook />
      },
      {
        path: 'drc',
        element: <Drc />
      }
    ],
  }
])

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
