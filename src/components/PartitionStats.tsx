import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// import Skeleton from '@mui/material/Skeleton';

export default function PartitionStats() {
  return (
    <>
      <Typography variant="subtitle2" fontFamily="inherit" align="center">
        Partition Statistics
      </Typography>
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={4} sm={4} md={4}>
            {/* Total leaders (stat) */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=14"></iframe>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            {/* Total replicas (stat) */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=15"></iframe>
          </Grid>
          <Grid item xs={2} sm={2} md={2}>
            {/* Offline replicas (stat) */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=32"></iframe>
          </Grid>
          <Grid item xs={2} sm={2} md={2}>
            {/* URPs (stat) */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=33"></iframe>
          </Grid>
        </Grid>
      </Box>

      {/* Following were metrics we were unable to query using PromQL due to lack of documentation / bandwidth to research: */}
      {/* <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs sm md>
            // In-sync Replicas (stat)
            <Skeleton animation={false} variant="rectangular" height={160} />
          </Grid>
          <Grid item xs sm md>
            // Out-of-sync Replicas (stat)
            <Skeleton animation={false} variant="rectangular" height={160} />
          </Grid>
        </Grid>
      </Box> */}
    </>
  );
}
