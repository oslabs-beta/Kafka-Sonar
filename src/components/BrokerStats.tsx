import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

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
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&from=1686259664226&to=1686263264226&panelId=44"></iframe>
          </Grid>
          <Grid item xs={2.4}>
            Offline Brokers
          </Grid>
          <Grid item xs={2.4}>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&from=1686259971413&to=1686263571413&panelId=31"></iframe>
          </Grid>
          <Grid item xs={2.4}>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&from=1686260676891&to=1686264276891&panelId=9"></iframe>
          </Grid>
          <Grid item xs={2.4}>
            Avg RF
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
