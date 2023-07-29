import React from 'react';
import { createRoot } from 'react-dom/client';
// import {
//   MemoryRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
//   useLocation,
// } from 'react-router-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
// Variable Fontsource font supports weights 100-900. Must import the font, but can be done in main or App files.
import '@fontsource-variable/montserrat';
import fontTheme from './themes/fontTheme';

import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';

import App from './App';

// outside app
import Login from './pages/Login';
import Signup from './pages/Signup';

// in app
// used components
import SavedConnectionsDataGrid from './pages/SavedConnections';
import SaveNewConnectionStepper from './pages/SaveNewConnection';
import ResourceUsage from './components/ResourceUsage';
import ClusterView from './components/ClusterView';
import PartitionView from './components/PartitionView';
// unused components
// import BrokerIO from './components/unused/BrokerIO'; // moved iframes from this component into ClusterStats directly
// import TopicIO from './components/unused/TopicIO'; // unused b/c Grafana graphs don't render topic i/o during demo cluster runs
// import NetworkEfficiency from './components/unused/NetworkEfficiency'; // moved iframes from this component into ClusterStats directly

// This component will manage hash-style routing
// function HashManager() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // On first load, if there's a hash, navigate to it
//   React.useEffect(() => {
//     if (window.location.hash !== '') {
//       navigate(window.location.hash.slice(1));
//     }
//   }, [navigate]);

//   // Whenever the location changes, update the URL hash
//   React.useEffect(() => {
//     window.location.hash = location.pathname;
//   }, [location]);

//   return null;
// }

const root = document.getElementById('root');

createRoot(root as HTMLElement).render(
  <DockerMuiThemeProvider>
    <CssBaseline />
    <React.StrictMode>
      <ThemeProvider theme={fontTheme}>
        <HashRouter>
          <Routes>
            <Route path="/saved" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={<App saved={<SavedConnectionsDataGrid />} />}
            />
            <Route
              path="/connect"
              element={<App connect={<SaveNewConnectionStepper />} />}
            />
            <Route
              path="/resources"
              element={<App resourceUsage={<ResourceUsage />} />}
            />
            <Route
              path="/cluster"
              element={<App clusterView={<ClusterView />} />}
            />
            <Route
              path="/partition"
              element={<App partitionView={<PartitionView />} />}
            />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </React.StrictMode>
  </DockerMuiThemeProvider>
);
