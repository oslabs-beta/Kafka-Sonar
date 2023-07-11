import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import './../App.css';
// Referenced:
// https://mui.com/material-ui/react-grid/#auto-layout
// https://mui.com/material-ui/react-grid/#responsive-values

export default function BrokerStats() {
  return (
    <>
      <Typography variant="subtitle2" fontFamily="inherit" align="center">
        Broker Statistics
      </Typography>
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs sm md>
            {/* Online brokers (stat) */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=44"></iframe>
          </Grid>
          <Grid item xs sm md>
            {/* Offline brokers (stat) - cannot find on Grafana Dashboards, will need to custom query */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=47"></iframe>
          </Grid>
          <Grid item xs={2.4} sm={2.4} md={2.4}>
            {/* Active controllers (stat) (EITHER count OR count and broker ID?) */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=31"></iframe>
          </Grid>
          <Grid item xs sm md>
            {/* Unclean Leader Election Rate */}
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=9"></iframe>
          </Grid>
          <Grid item xs sm md>
            {/* Avg RF (stat) */}
            <Skeleton animation={false} variant="rectangular" height={160} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
