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
import Connect from './pages/Connect';

// cluster page components
import BrokerStats from './components/BrokerStats';
import PartitionStats from './components/PartitionStats';
import ResourceUtilization from './components/ResourceUtil';
import NetworkEfficiency from './components/NetworkEfficiency';

// import BrokerIO from './components/BrokerIO'; // moved iframes from this component into BrokerStats directly
// import TopicIO from './components/TopicIO'; // unused b/c Grafana graphs don't render topic i/o during demo cluster runs

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/connect" element={<App connect={<Connect />} />} />
      <Route
        path="/cluster"
        element={
          <App
            brokerStats={<BrokerStats />}
            // brokerIO={<BrokerIO />}
            partitionStats={<PartitionStats />}
            resourceUtil={<ResourceUtilization />}
            networkEff={<NetworkEfficiency />}
          />
        }
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
