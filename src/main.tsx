import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Cluster from './pages/Cluster';

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Cluster />} />
      <Route path="/cluster" element={<Cluster />} />
      <Route path="/broker" element={<Cluster />} />
      <Route path="/consumer" element={<Cluster />} />
    </Route>
  )
);

const root = document.getElementById('root');

createRoot(root as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);
