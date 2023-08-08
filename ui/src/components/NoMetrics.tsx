import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function NoMetrics() {
  return (
    <Box display={'flex'}>
      <Typography component="h1" variant="h6" margin={'0 auto'}>
        No metrics to display. Connect to a client in your Saved Connections.
      </Typography>
    </Box>
  );
}
