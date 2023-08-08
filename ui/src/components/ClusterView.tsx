import { Fragment } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import '../App.css';
import React from 'react';

// NOTE: breakpoint props (xs, sm, md, etc.) do NOT work when flex-direction is column or reverse-column!

export default function ClusterView() {
  return (
    <Fragment>
      {/* <Typography
        component="h1"
        variant="h5"
        align="center"
        margin="-20px auto 20px"
      >
        Cluster Activity
      </Typography> */}

      {/* Direct child-items of this grid flex column-wise, enabling flex-basis to increase height of those rows */}
      <Grid container gap={1} direction={'column'}>
        {/* Direct child-items of this grid flex row-wise, enabling use of breakpoint props */}
        <Grid container item gap={1} flexBasis={'21vh'}>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=4"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=5"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=6"></iframe>
          </Grid>
        </Grid>

        <Grid container item gap={1} flexBasis={'21vh'}>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=7"></iframe>{' '}
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=8"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=9"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=10"></iframe>
          </Grid>
        </Grid>

        <Grid item flexBasis={'43vh'}>
          <iframe src="http://localhost:3000/d-solo/aRNaJwOmk/kafka-broker-performance-and-latency?orgId=1&refresh=5s&panelId=11"></iframe>
        </Grid>
        <Grid item flexBasis={'43vh'}>
          <iframe src="http://localhost:3000/d-solo/aRNaJwOmk/kafka-broker-performance-and-latency?orgId=1&refresh=5s&panelId=12"></iframe>
        </Grid>
        <Grid item flexBasis={'43vh'}>
          <iframe src="http://localhost:3000/d-solo/aRNaJwOmk/kafka-broker-performance-and-latency?orgId=1&refresh=5s&panelId=13"></iframe>
        </Grid>
        <Grid item flexBasis={'43vh'}>
          <iframe src="http://localhost:3000/d-solo/aRNaJwOmk/kafka-broker-performance-and-latency?orgId=1&refresh=5s&panelId=14"></iframe>
        </Grid>
      </Grid>
    </Fragment>
  );
}

// Following metrics were deprioritized:
// Messages in per broker: <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=37"></iframe>
// Following metrics we were unable to query using PromQL due to lack of documentation / bandwidth to research:
// Avg Replication Factor (stat)
