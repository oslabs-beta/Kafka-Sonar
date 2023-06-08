import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import CssBaseline from '@mui/material/CssBaseline';

import Dashboard from './pages/Dashboard';
import BrokerStats from './components/BrokerStats';
import PartitionStats from './components/PartitionStats';

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Dashboard brokerStats={<BrokerStats />} />} />
      <Route
        path="/broker"
        element={
          <Dashboard
            brokerStats={<BrokerStats />}
            partitionStats={<PartitionStats />}
          />
        }
      />
      <Route
        path="/consumer"
        element={<Dashboard partitionStats={<PartitionStats />} />}
      />
    </Route>
  )
);

const root = document.getElementById('root');

// Using Docker's MUI theme: https://docs.docker.com/desktop/extensions-sdk/design/#recommended-reactmui-using-our-theme
createRoot(root as HTMLElement).render(
  <DockerMuiThemeProvider>
    <CssBaseline />
    <React.StrictMode>
      <RouterProvider router={appRouter} />
    </React.StrictMode>
  </DockerMuiThemeProvider>
);
