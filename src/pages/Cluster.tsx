import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import NavDrawer from './../components/NavDrawer';
import BrokerStats from './../components/BrokerStats';

export default function Cluster() {
  return (
    <>
      <NavDrawer />
      <BrokerStats />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography>Main contents</Typography>
      </Box>
    </>
  );
}
