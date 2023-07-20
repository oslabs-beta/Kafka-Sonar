import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React from 'react';

export default function BrokerIO() {
  return (
    <>
      <Typography variant="subtitle2" fontFamily="inherit" align="center">
        Broker I/O
      </Typography>

      {/* Following were metrics that were used in ClusterStats directly */}
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs sm md>
            {/* Messages in per broker */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=37"></iframe>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            {/* Bytes in per broker  */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=24"></iframe>
          </Grid>
          <Grid item xs sm md>
            {/* Bytes out per broker */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=25"></iframe>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
