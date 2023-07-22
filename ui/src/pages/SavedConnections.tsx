import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Referenced guide for migration from MUI v5 to v6 in order to get import Data Grid from MUI X v6: https://mui.com/x/migration/migration-data-grid-v5/
import { DataGrid } from '@mui/x-data-grid';
// MUI types
import { GridColDef } from '@mui/x-data-grid';

// TS types
import { GridRowDef, KafkajsClientInfo } from './../types/types';

import { createDockerDesktopClient } from '@docker/extension-api-client';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    description: 'Row number',
    width: 90,
  },
  {
    field: 'clientId',
    headerName: 'Client ID',
    description: 'Kafka application name',
    width: 150,
  },
  {
    field: 'host',
    headerName: 'Hostname',
    description: '',
    width: 150,
  },
  {
    field: 'port',
    headerName: 'Port',
    description: '',
    width: 110,
  },
  {
    field: 'auth',
    headerName: 'Authentication Mechanism',
    description: 'SASL method to authenticate to the cluster',
    width: 150,
  },
  // {
  //   field: 'fetchMetrics',
  //   headerName: 'Download metrics',
  //   description:
  //     'Get a CSV of metrics from all previous runs of this cluster connection',
  //   width: 150,
  // },
  // {
  //   field: 'fetchLogs',
  //   headerName: 'Download error logs',
  //   description:
  //     'Get a CSV of error logs from all previous runs of this cluster connection',
  //   width: 150,
  // },
];

export default function SavedConnectionsDataGrid() {
  // Needed checks:
  // 1) Get user's email from session token.
  // 2) Parse email for just the portion before @ to render as username.
  // 3) Fix font.
  const [username, setUsername] = useState('upnata');
  const [rows, setRows] = useState<GridRowDef[]>([
    {
      id: 1,
      clientId: 'upnata',
      host: 'localhost',
      port: '9090',
      auth: 'PLAIN',
      // fetchMetrics: 1,
      // fetchLogs: 1,
    },
  ]);

  useEffect(() => {
    // instantiate DD client object
    const ddClient = createDockerDesktopClient();
    // GET all connections associated with logged-in user
    ddClient.extension.vm.service
      .get('/api/clusters/userclusters/:user_id')
      .then((data: { clusters: KafkajsClientInfo[] }) => data.json().clusters)
      .then((clusters: KafkajsClientInfo[]) => {
        // map over clusters array to get only the data expected for the grid
        const gridRows = clusters.map(
          // destructure 6 properties from each KafkajsClientInfo object
          ({
            client_id,
            bootstrap_hostname,
            port_number,
            auth_mechanism,
            username,
            password,
          }) => {
            // keep only 4 rendered in DataGrid
            return {
              clientId: client_id,
              host: bootstrap_hostname,
              port: port_number,
              auth: auth_mechanism,
            };
          }
        );
        setRows(gridRows);
      });
  }, []); // called once on component mount

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography component="h1" variant="h2" marginBottom={'5vh'}>
        Welcome back, {username}!
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
