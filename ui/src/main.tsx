import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import CssBaseline from '@mui/material/CssBaseline';

import App from './App';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Connect from './pages/Connect';
import ResourceUsage from './components/ResourceUsage';
import ClusterView from './components/ClusterView';
import PartitionView from './components/PartitionView';

// This component will manage hash-style routing
function HashManager() {
  const navigate = useNavigate();
  const location = useLocation();

  // On first load, if there's a hash, navigate to it
  React.useEffect(() => {
    if (window.location.hash !== '') {
      navigate(window.location.hash.slice(1));
    }
  }, [navigate]);

  // Whenever the location changes, update the URL hash
  React.useEffect(() => {
    window.location.hash = location.pathname;
  }, [location]);

  return null;
}

const root = document.getElementById('root');

createRoot(root as HTMLElement).render(
  <DockerMuiThemeProvider>
    <CssBaseline />
    <React.StrictMode>
      <Router>
        <HashManager />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/connect" element={<App connect={<Connect />} />} />
          <Route path="/resources" element={<App resourceUsage={<ResourceUsage />} />} />
          <Route path="/cluster" element={<App clusterView={<ClusterView />} />} />
          <Route path="/partition" element={<App partitionView={<PartitionView />} />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </DockerMuiThemeProvider>
);