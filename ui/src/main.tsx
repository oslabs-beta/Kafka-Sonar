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

import App from './App';

// outside app
import Login from './pages/Login';
import Signup from './pages/Signup';

// in app
// used components
import Connect from './pages/Connect';
import ResourceUsage from './components/ResourceUsage';
import ClusterView from './components/ClusterView';
import PartitionView from './components/PartitionView';
// unused components
// import BrokerIO from './components/unused/BrokerIO'; // moved iframes from this component into ClusterStats directly
// import TopicIO from './components/unused/TopicIO'; // unused b/c Grafana graphs don't render topic i/o during demo cluster runs
// import NetworkEfficiency from './components/unused/NetworkEfficiency'; // moved iframes from this component into ClusterStats directly

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/connect" element={<App connect={<Connect />} />} />
      <Route
        path="/resources"
        element={<App resourceUsage={<ResourceUsage />} />}
      />
      <Route path="/cluster" element={<App clusterView={<ClusterView />} />} />
      <Route
        path="/partition"
        element={<App partitionView={<PartitionView />} />}
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
