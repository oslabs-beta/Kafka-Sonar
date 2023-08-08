import { Fragment } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import React from 'react';

// NOTE: breakpoint props (xs, sm, md, etc.) do NOT work when flex-direction is column or reverse-column!

export default function ResourceUsage() {
  return (
    <Fragment>
      {/* <Typography
        component="h1"
        variant="h5"
        align="center"
        margin="-20px auto 20px"
      >
        Local Resource Utilization
      </Typography> */}

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
