import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// MUI component reference: https://mui.com/material-ui/react-drawer/#mini-variant-drawer
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
// import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// custom selected or created icons
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CableIcon from '@mui/icons-material/Cable';
import HubIcon from '@mui/icons-material/Hub';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import PolylineIcon from '@mui/icons-material/Polyline';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as OrangeLogo } from './../src/assets/kafka-sonar-orange-logo.svg';
// import { ReactComponent as WhiteLogo } from './../../public/kafka-sonar-white-logo.svg';

// TS types
import { Props, NavTabOption } from './types/types';

// Variable Fontsource font supports weights 100-900
import '@fontsource-variable/montserrat';

const navTabOptions: NavTabOption[] = [
  {
    route: '/saved',
    icon: <BookmarkIcon />,
    text: 'Saved Connections',
  },
  {
    route: '/connect',
    icon: <CableIcon />,
    text: 'Connect New Cluster',
  },
  {
    route: '/resources',
    icon: <HubIcon />,
    text: 'Resource Usage',
  },
  {
    route: '/cluster',
    icon: <DeviceHubIcon />,
    text: 'Cluster View',
  },
  {
    route: '/partition',
    icon: <PolylineIcon />,
    text: 'Partition View',
  },
];

export default function App(props: Props) {
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

  const { connect, resourceUsage, clusterView, partitionView } = props;

  const [open, setOpen] = React.useState(false); // switch to false to change drawer to be closed on App load
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* <CssBaseline /> */}
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
          {/* <SvgIcon fontSize="large" viewBox="0 0 1100 1100">
            <WhiteLogo />
          </SvgIcon> */}
          <img
            src="./../../public/kafka-sonar-white-logo.svg"
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
              onClick={() => {
                navigate(navTabInfo.route);
              }}
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
                  primary={
                    <Typography variant="inherit" fontFamily="inherit">
                      {navTabInfo.text}
                    </Typography>
                  }
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
        {connect}
        {resourceUsage}
        {clusterView}
        {partitionView}
      </Box>
    </Box>
  );
}
