import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface LinkTabProps {
  label?: string;
  href?: string;
}

function LinkTab(props: LinkTabProps) {
  return <Tab component="a" {...props} />;
}

export default function Metrics() {
  const [tabVal, setTabVal] = useState(0);

  const handleTabSwitch = (event: React.SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography component="h1" variant="h5" margin={'-20px auto 5px'}>
          CURRENT RUN METRICS
        </Typography>
        <Box display={'flex'} margin={'0 auto 20px'}>
          <Tabs value={tabVal} onChange={handleTabSwitch}>
            <LinkTab label="Cluster View" href="#/metrics" />
            <LinkTab label="Partition View" href="#/metrics/partition" />
            <LinkTab label="Resource Usage" href="#/metrics/resources" />
          </Tabs>
        </Box>
      </Box>
      <Outlet />
    </>
  );
}
