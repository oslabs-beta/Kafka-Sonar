import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function TopicIO() {
  return (
    <>
      <Typography variant="subtitle2" fontFamily="inherit" align="center">
        Topics I/O
      </Typography>

      {/* Following were metrics that didn't work while running demo cluster */}
      <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 3 }}>
        <Grid container spacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs sm md>
            {/* Messages in per topic */}
            <iframe src="http://localhost:3000/d-solo/1vR8sjAmk/kafka-topics-logs?orgId=1&refresh=5s&panelId=8"></iframe>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            {/* Bytes in per topic */}
            <iframe src="http://localhost:3000/d-solo/1vR8sjAmk/kafka-topics-logs?orgId=1&refresh=5s&panelId=10"></iframe>
          </Grid>
          <Grid item xs sm md>
            {/* Bytes out per topic */}
            <iframe src="http://localhost:3000/d-solo/1vR8sjAmk/kafka-topics-logs?orgId=1&refresh=5s&panelId=9"></iframe>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
