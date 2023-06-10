import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

export default function NetworkEfficiency() {
  return (
    <>
      <Typography variant="subtitle2" fontFamily="inherit" align="center">
        Network Efficiency
      </Typography>
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={12} sm={12} md={12}>
            {/* Avg E2E req handling time (graph) */}
            <iframe src="http://localhost:3000/d-solo/aRNaJwOmk/kafka-broker-performance-and-latency?orgId=1&refresh=5s&panelId=1"></iframe>{' '}
          </Grid>
        </Grid>
      </Box>
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs sm md>
            {/* Producer request rate OR req to server (broker?) / sec (graph) */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=39"></iframe>{' '}
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            {/* Broker response rate OR res to consumers / sec (graph) */}
            <Skeleton animation={false} variant="rectangular" height={160} />
          </Grid>
          <Grid item xs sm md>
            {/* Consumer fetch rate OR req to server (broker?) / sec (graph) */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=40"></iframe>
          </Grid>
        </Grid>
      </Box>
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs sm md>
            {/* Failed producer request rate OR failed req to server / sec (graph) */}
            <Skeleton animation={false} variant="rectangular" height={160} />{' '}
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            {/* Requests in-flight (awaiting responses) (graph) */}
            <iframe src="http://localhost:3000/d-solo/aRNaJwOmk/kafka-broker-performance-and-latency?orgId=1&refresh=5s&panelId=10"></iframe>
          </Grid>
          <Grid item xs sm md>
            {/* Failed fetch request rate OR req to server (broker?) / sec (graph) */}
            <Skeleton animation={false} variant="rectangular" height={160} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
