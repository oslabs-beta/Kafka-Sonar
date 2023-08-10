import React, { Fragment } from 'react';

import Grid from '@mui/material/Grid';

import '../index.css';

export default function ClusterView() {
  return (
    <Fragment>
      {/* Direct child-items of this grid flex column-wise, enabling flex-basis to increase height of those rows */}
      <Grid container gap={1} direction={'column'}>
        {/* NOTE: breakpoint props (xs, sm, md, etc.) do NOT work when flex-direction is column or reverse-column! */}
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
