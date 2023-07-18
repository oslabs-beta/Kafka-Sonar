import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import '../App.css';
import React from 'react';

// NOTE: breakpoint props (xs, sm, md, etc.) do NOT work when flex-direction is column or reverse-column!

export default function ClusterView() {
  return (
    <>
      <Typography
        variant="subtitle2"
        fontFamily="inherit"
        align="center"
        margin="-20px auto 20px"
      >
        Cluster Activity
      </Typography>

      {/* Direct child-items of this grid flex column-wise, enabling flex-basis to increase height of those rows */}
      <Grid container gap={1} direction={'column'}>
        {/* Direct child-items of this grid flex row-wise, enabling use of breakpoint props */}
        <Grid container item gap={1} flexBasis={'21vh'}>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=31"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=44"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=47"></iframe>
          </Grid>
        </Grid>

        <Grid container item gap={1} flexBasis={'21vh'}>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=39"></iframe>{' '}
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=24"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=40"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=25"></iframe>
          </Grid>
        </Grid>

        <Grid item flexBasis={'43vh'}>
          <iframe src="http://localhost:3000/d-solo/aRNaJwOmk/kafka-broker-performance-and-latency?orgId=1&refresh=5s&panelId=48"></iframe>
        </Grid>
      </Grid>
    </>
  );
}

// Following metrics were deprioritized:
// Messages in per broker: <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=37"></iframe>
// Following metrics we were unable to query using PromQL due to lack of documentation / bandwidth to research:
// Avg Replication Factor (stat)
