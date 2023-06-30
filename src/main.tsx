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

import Login from './pages/Login';
import Signup from './pages/Signup';
import Connect from './pages/Connect';
import App from './App';
import BrokerIO from './components/BrokerIO';
import BrokerStats from './components/BrokerStats';
import BrokerUtilization from './components/BrokerUtil';
import PartitionStats from './components/PartitionStats';
import TopicIO from './components/TopicIO';
import NetworkEfficiency from './components/NetworkEfficiency';

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/connect" element={<Connect />} />
      {/* <Route index element={<App login={<Login />} />} />
      <Route path="/signup" element={<App signup={<Signup />} />} />
      <Route path="/connect" element={<App connect={<Connect />} />} /> */}
      <Route
        path="/cluster"
        element={
          <App
            partitionStats={<PartitionStats />}
            brokerStats={<BrokerStats />}
            brokerUtil={<BrokerUtilization />}
            brokerIO={<BrokerIO />}
            topicIO={<TopicIO />}
            networkEff={<NetworkEfficiency />}
          />
        }
      />
      <Route
        path="/broker"
        element={
          <App
            brokerStats={<BrokerStats />}
            partitionStats={<PartitionStats />}
          />
        }
      />
      <Route
        path="/consumer"
        element={<App partitionStats={<PartitionStats />} />}
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
