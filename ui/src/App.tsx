import React, { useEffect, useState } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { Routes, Route, useNavigate } from 'react-router-dom';

// inside App
import SavedConnectionsDataGrid from './pages/SavedConnections';
import SaveNewConnectionStepper from './pages/SaveNewConnection';
import Metrics from './pages/Metrics';
import ResourceUsage from './components/ResourceUsage';
import ClusterView from './components/ClusterView';
import PartitionView from './components/PartitionView';

// MUI component reference: https://mui.com/material-ui/react-drawer/#mini-variant-drawer
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// MUI or created icons
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HubIcon from '@mui/icons-material/Hub';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import PolylineIcon from '@mui/icons-material/Polyline';
import LogoutIcon from '@mui/icons-material/Logout';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as OrangeLogo } from './assets/kafka-sonar-orange-logo.svg';

// TS types
import { NavTabOption } from './types/types';

// Docker client library
import { createDockerDesktopClient } from '@docker/extension-api-client';

export default function App() {
  const drawerWidth = 240;

  const openedMixin = (theme: Theme): CSSObject => ({
    backgroundColor: '#0d090a',
    color: '#f8fbfd',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    backgroundColor: '#0d090a',
    color: '#f8fbfd',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }));

  const [open, setOpen] = useState(true); // switch to false to change drawer to be closed on App load
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const navTabOptions: NavTabOption[] = [
    {
      onClick: () => {
        navigate('/saved');
      },
      icon: <BookmarkIcon />,
      text: 'Saved Connections',
    },
    {
      onClick: () => {
        navigate('/metrics');
      },
      icon: <DeviceHubIcon />,
      text: 'Metrics',
    },
    {
      onClick: async () => {
        // on log out, clear user's id and token from localStorage, ending their session
        localStorage.removeItem('id');
        localStorage.removeItem('token');

        // TO DO: add request to BE to disconnect a running cluster; /api/clusters/disconnect/
        const ddClient = createDockerDesktopClient();
        const logoutDisconnect = await ddClient.extension.vm.service.get(
          `/api/clusters/disconnect/${localStorage.connectedClientId}`
        );
        // error handling
        if (logoutDisconnect instanceof Error) {
          // toast error message
          ddClient.desktopUI.toast.error(
            'ERROR disconnecting running client before you logged out.'
          );
          // exit handler
          return;
        }
        localStorage.removeItem('connectedClientId');
        // navigate to Login page
        navigate('/');
      },
      icon: <LogoutIcon />,
      text: 'Log Out',
    },
  ];

  // The following hook was lifted from SavedConnections component
  const [connectedClientId, setConnectedClientId] = useState<string>('');
  useEffect(() => {
    if (localStorage.getItem('connectedClientId')) {
      setConnectedClientId(localStorage.getItem('connectedClientId'));
    }
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{ backgroundColor: 'transparent' }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <ChevronRightIcon />
          </IconButton>
          <SvgIcon fontSize="large">
            <OrangeLogo />
          </SvgIcon>
          <img
            src="./../public/kafka-sonar-white-logo.svg"
            style={{ margin: 20, width: 75 }}
          />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerClose}
            sx={{
              ...(!open && { display: 'none' }),
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider color="#f8fbfd" />
        <List>
          {navTabOptions.map((navTabInfo) => (
            <ListItem
              key={navTabInfo.text}
              disablePadding
              onClick={navTabInfo.onClick}
              sx={{
                display: 'block',
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: '#f8fbfd',
                  }}
                >
                  {navTabInfo.icon}
                </ListItemIcon>
                <ListItemText
                  primary={<Typography>{navTabInfo.text}</Typography>}
                  sx={{
                    opacity: open ? 1 : 0,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route
            path="saved"
            element={
              <SavedConnectionsDataGrid
                connectedClientId={connectedClientId}
                setConnectedClientId={setConnectedClientId}
              />
            }
          />
          <Route path="connect" element={<SaveNewConnectionStepper />} />
          <Route path="metrics" element={<Metrics />}>
            <Route index element={<ClusterView />} />
            <Route path="cluster" element={<ClusterView />} />
            <Route path="partition" element={<PartitionView />} />
            <Route path="resources" element={<ResourceUsage />} />
          </Route>
        </Routes>
      </Box>
    </Box>
  );
}
