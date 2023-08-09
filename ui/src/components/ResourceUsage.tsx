import React, { Fragment } from 'react';

import Grid from '@mui/material/Grid';

import '../index.css';

// NOTE: breakpoint props (xs, sm, md, etc.) do NOT work when flex-direction is column or reverse-column!

export default function ResourceUsage() {
  return (
    <Fragment>
      <Grid container gap={1} direction={'column'}>
        <Grid item flexBasis={'29vh'}>
          <iframe src="http://localhost:3000/d-solo/AdG9A1xmk/kafka-brokers-jvm-and-os?orgId=1&refresh=5s&panelId=1"></iframe>
        </Grid>
        <Grid item flexBasis={'29vh'}>
          <iframe src="http://localhost:3000/d-solo/AdG9A1xmk/kafka-brokers-jvm-and-os?orgId=1&refresh=5s&panelId=2"></iframe>
        </Grid>
        <Grid item flexBasis={'29vh'}>
          <iframe src="http://localhost:3000/d-solo/AdG9A1xmk/kafka-brokers-jvm-and-os?orgId=1&refresh=5s&panelId=3"></iframe>
        </Grid>
      </Grid>
    </Fragment>
  );
}

// Following metrics didn't work while running demo cluster:
// Time spend in GC (garbage collection): <iframe src="http://localhost:3000/d-solo/AdG9A1xmk/kafka-brokers-jvm-and-os?orgId=1&refresh=5s&panelId=10"></iframe>
