import React, { Fragment } from 'react';

import Grid from '@mui/material/Grid';

import '../index.css';

// NOTE: breakpoint props (xs, sm, md, etc.) do NOT work when flex-direction is column or reverse-column!

export default function PartitionView() {
  return (
    <Fragment>
      {/* Direct child-items of this grid flex column-wise, enabling flex-basis to increase height of those rows */}
      <Grid container gap={1} direction={'column'}>
        {/* Direct child-items of this grid flex row-wise, enabling use of breakpoint props */}
        <Grid container item gap={1} flexBasis={'21vh'}>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=15"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=16"></iframe>
          </Grid>
          <Grid item xs sm md>
            <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=17"></iframe>
          </Grid>
        </Grid>
        <Grid item flexBasis={'32vh'}>
          <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=18"></iframe>
        </Grid>
        <Grid item flexBasis={'32vh'}>
          <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=19"></iframe>
        </Grid>
        <Grid item flexBasis={'32vh'}>
          <iframe src="http://localhost:3000/d-solo/e-6AJQOik/kafka-cluster-global-healthcheck?orgId=1&refresh=5s&panelId=20"></iframe>
        </Grid>
      </Grid>
    </Fragment>
  );
}

// Following metrics we were unable to query using PromQL due to lack of documentation / bandwidth to research:
// In-sync Replicas (stat)
// Out-of-sync Replicas (stat)
