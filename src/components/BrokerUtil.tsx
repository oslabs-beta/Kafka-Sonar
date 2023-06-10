import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function BrokerUtilization() {
  return (
    <>
      <Typography variant="subtitle2" fontFamily="inherit" align="center">
        Resource Utilization
      </Typography>
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs sm md>
            {/* CPU usage / broker (graph) */}
            <iframe src="http://localhost:3000/d-solo/AdG9A1xmk/kafka-brokers-jvm-and-os?orgId=1&refresh=5s&panelId=4"></iframe>
          </Grid>
          <Grid item xs sm md>
            {/* Disk usage / broker (graph) */}
            <iframe src="http://localhost:3000/d-solo/AdG9A1xmk/kafka-brokers-jvm-and-os?orgId=1&refresh=5s&panelId=13"></iframe>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            {/* JVM memory used (graph) */}
            <iframe src="http://localhost:3000/d-solo/AdG9A1xmk/kafka-brokers-jvm-and-os?orgId=1&refresh=5s&panelId=6"></iframe>
          </Grid>
          <Grid item xs sm md>
            {/* Time spend in GC */}
            <iframe src="http://localhost:3000/d-solo/AdG9A1xmk/kafka-brokers-jvm-and-os?orgId=1&refresh=5s&panelId=10"></iframe>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
