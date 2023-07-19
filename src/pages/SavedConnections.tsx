import { useState } from 'react';
import Box from '@mui/material/Box';
// Referenced guide for migration from MUI v5 to v6 in order to get import Data Grid from MUI X v6: https://mui.com/x/migration/migration-data-grid-v5/
import { DataGrid } from '@mui/x-data-grid';
// MUI types
import { GridColDef } from '@mui/x-data-grid';

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
  {
    field: 'fetchMetrics',
    headerName: 'Download metrics',
    description:
      'Get a CSV of metrics from all previous runs of this cluster connection',
    width: 150,
  },
  {
    field: 'fetchLogs',
    headerName: 'Download error logs',
    description:
      'Get a CSV of error logs from all previous runs of this cluster connection',
    width: 150,
  },
];

export default function SavedConnectionsDataGrid() {
  const [rows, setRows] = useState([
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  ]);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
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
