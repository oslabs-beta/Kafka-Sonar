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

export default function TopicIO() {
  return (
    <>
      <Typography variant="subtitle2" align="center">
        Topics I/O
      </Typography>
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <iframe src="http://localhost:3000/d-solo/1vR8sjAmk/kafka-topics-logs?orgId=1&refresh=5s&panelId=8"></iframe>
          </Grid>
          <Grid item xs={4}>
            <iframe src="http://localhost:3000/d-solo/1vR8sjAmk/kafka-topics-logs?orgId=1&refresh=5s&panelId=10"></iframe>
          </Grid>
          <Grid item xs={4}>
            <iframe src="http://localhost:3000/d-solo/1vR8sjAmk/kafka-topics-logs?orgId=1&refresh=5s&panelId=9"></iframe>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
