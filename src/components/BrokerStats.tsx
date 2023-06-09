import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

export default function BrokerStats() {
  return (
    <>
      <Typography variant="subtitle2" align="center">
        Broker Statistics
      </Typography>
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={2.4}>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=44"></iframe>
          </Grid>
          <Grid item xs={2.4}>
            Offline Brokers
          </Grid>
          <Grid item xs={2.4}>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=31"></iframe>
          </Grid>
          <Grid item xs={2.4}>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=9"></iframe>
          </Grid>
          <Grid item xs={2.4}>
            Avg RF
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
