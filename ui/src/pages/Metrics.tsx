import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// MUI prop type and functional component from: https://mui.com/material-ui/react-tabs/#nav-tabs
interface LinkTabProps {
  label?: string;
  href?: string;
  style?: { color: string };
}

function LinkTab(props: LinkTabProps) {
  return <Tab component="a" {...props} />;
}

export default function Metrics() {
  const [tabVal, setTabVal] = useState(0);

  const handleTabSwitch = (event: React.SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  const linkTabs = [
    { label: 'Cluster View', href: '#/metrics' },
    { label: 'Partition View', href: '#/metrics/partition' },
    { label: 'Resource Usage', href: '#/metrics/resources' },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography component="h1" variant="h5" margin={'-20px auto 5px'}>
          CURRENT RUN METRICS
        </Typography>
        <Box display={'flex'} margin={'0 auto 20px'}>
          <Tabs value={tabVal} onChange={handleTabSwitch}>
            {linkTabs.map((linkTab, i) => (
              <LinkTab
                key={i}
                label={linkTab.label}
                href={linkTab.href}
                style={{ color: '#1976d2' }} // added to accommodate dark mode
              />
            ))}
          </Tabs>
        </Box>
      </Box>
      <Outlet />
    </>
  );
}
