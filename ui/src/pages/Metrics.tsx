import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

// inside App
import ClusterView from '../components/ClusterView';
import PartitionView from '../components/PartitionView';
import ResourceUsage from '../components/ResourceUsage';

// MUI component reference: https://mui.com/material-ui/react-drawer/#mini-variant-drawer
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// MUI types
interface LinkTabProps {
  label?: string;
  href?: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export default function Metrics() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography component="h1" variant="h5" margin={'-20px auto 10px'}>
        CURRENT RUN METRICS
      </Typography>
      <nav>
        <Link to="cluster">Cluster View</Link>
        <Link to="partition">Partition View</Link>
        <Link to="resources">Resource Usage</Link>
      </nav>
      {/* <Tabs value={value} onChange={handleChange}>
        <LinkTab label="Cluster View" href="metrics/cluster" />
        <LinkTab label="Partition View" href="metrics/partition" />
        <LinkTab label="Resource Usage" href="metrics/resources" />
      </Tabs> */}
      <Outlet />
    </Box>
  );
}
