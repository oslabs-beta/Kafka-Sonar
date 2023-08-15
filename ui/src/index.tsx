import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
// Variable Fontsource font supports weights 100-900. Must import the font, but can be done in main or App files.
import '@fontsource-variable/montserrat';
import fontTheme from './themes/fontTheme';

import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';

import App from './App';
// outside App
import Login from './pages/Login';
import Signup from './pages/Signup';

const root = document.getElementById('root');

createRoot(root as HTMLElement).render(
  <DockerMuiThemeProvider>
    <CssBaseline />
    <React.StrictMode>
      <ThemeProvider theme={fontTheme}>
        <HashRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<App />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </React.StrictMode>
  </DockerMuiThemeProvider>
);
