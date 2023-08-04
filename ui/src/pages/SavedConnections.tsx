import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
// Referenced guide for migration from MUI v5 to v6 in order to get import Data Grid from MUI X v6: https://mui.com/x/migration/migration-data-grid-v5/
import { DataGrid, GridEventListener } from '@mui/x-data-grid';
// MUI types
import { GridColDef } from '@mui/x-data-grid';
// TS types
import { GridRowDef, UserConnection } from './../types/types';
// Docker client library
import { createDockerDesktopClient } from '@docker/extension-api-client';

const columns: GridColDef[] = [
  // Reference https://mui.com/x/react-data-grid/row-definition/#row-identifier: It is not necessary to create a column to display the unique identifier data. The data grid pulls this information directly from the data set itself, not from anything that is displayed on the screen.
  {
    field: 'clientId',
    headerName: 'Client ID',
    description: 'Kafka application name',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 160,
  },
  {
    field: 'host',
    headerName: 'Hostname',
    description: 'Your cluster is found at this host.',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 190,
  },
  {
    field: 'port',
    headerName: 'Port',
    description: 'Your cluster is found at this port.',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 110,
  },
  {
    field: 'auth',
    headerName: 'Authentication',
    description:
      'SASL method to authenticate to the cluster (or not applicable)',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 190,
  },
];

const DownloadPastMetrics = async () => {
  fetch('http://localhost:3333/download')
  .then(response => response.blob())
  .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'metrics_table.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  })
}

export default function SavedConnectionsDataGrid() {
  const [rows, setRows] = useState<GridRowDef[]>([]);
  // on BE, cluster_id is a number type; assuming there will never be a cluster with an id of 0
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const navigate = useNavigate();

  // handles updating selectedRow with cluster_id / id of the selected row in the DataGrid
  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    setSelectedRow(params.row.id);
  };

  // instantiate DD client object
  const ddClient = createDockerDesktopClient();

  const getUserConnections = async () => {
    // GET all connections associated with logged-in user
    // Issue with type UserConnection[]
    const allUserConnections: any = await ddClient.extension.vm.service.get(
      `/api/clusters/userclusters/${localStorage.getItem('id')}`
    );
    // map over allUserConnections to get only the data expected for the grid
    const gridRows = allUserConnections.map(
      // destructure and keep only the properties needed for the DataGrid
      ({
        cluster_id,
        client_id,
        bootstrap_hostname,
        port_number,
        auth_mechanism,
      }) => {
        return {
          // See references: https://mui.com/x/react-data-grid/row-definition/#row-identifier, https://mui.com/x/react-data-grid/getting-started/#define-rows
          id: cluster_id, // all cluster_ids should be unique
          clientId: client_id,
          host: bootstrap_hostname,
          port: port_number,
          auth: auth_mechanism,
        };
      }
    );
    setRows(gridRows);
  };

  // useEffect is called 2x on component mount as of React v18 (need to fact check version)
  useEffect(() => {
    getUserConnections();
  }, []); // called once on component mount and whenever rows updates

  // Needed checks:
  // BUG: Delete works, nothing happens after.
  const deleteUserConnection = async () => {
    // DELETE selected connection
    const deletedConnection: any = await ddClient.extension.vm.service.delete(
      `/api/clusters/${localStorage.getItem('id')}/${selectedRow}`
    );
    // refresh page, should trigger useEffect / getUserConnections, which will update state
    location.reload();
  };

  return (
    <Grid container gap={5}>
      {/* The following Grids are both items AND containers. 
      As child items, they flow in the row direction of the parent Grid. 
      As containers, their child elements flow in the column direction. 
      This setup is necessary to center both text headings and Add button.
      */}
      <Grid
        container
        flexDirection={'column'}
        gap={2}
        item
        xs
        sm
        md
        sx={{
          '.header': {
            backgroundColor: '#ff8c42',
          },
        }}
      >
        {/* <Typography component="h1" variant="h5"> */}
        <Typography component="h1" variant="h5" margin={'-20px auto 0'}>
          SAVED CLUSTER CONNECTIONS
        </Typography>
        <Button
          variant="contained"
          size="medium"
          onClick={() => {
            navigate('/connect');
          }}
        >
          ADD NEW CONNECTION
        </Button>
        <DataGrid
          onRowClick={handleRowClick}
          showCellVerticalBorder
          showColumnVerticalBorder
          columns={columns}
          rows={rows}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          autoHeight
        />
      </Grid>
      <Grid container flexDirection={'column'} gap={1} item xs sm md>
        <Typography component="h1" variant="h6" margin={'-20px auto 1vh'}>
          Select a row to take an action:
        </Typography>
        <Button variant="outlined" size="medium">
          CONNECT TO SELECTED CLUSTER
        </Button>
        <Tooltip
          title="You must disconnect a running cluster before connecting to another cluster!"
          placement="top"
        >
          <Button variant="outlined" color="error" size="medium">
            DISCONNECT FROM RUNNING CLUSTER
          </Button>
        </Tooltip>
        <Tooltip
          title="Get a CSV of metrics from all previous runs of this cluster connection"
          placement="top"
        >
          <Button variant="contained" color="success" size="medium" onClick={DownloadPastMetrics}>
            DOWNLOAD PAST METRICS
          </Button>
        </Tooltip>
        <Tooltip
          title="Get a CSV of error logs from all previous runs of this cluster connection"
          placement="top"
        >
          <Button variant="contained" color="success" size="medium">
            DOWNLOAD PAST LOGS
          </Button>
        </Tooltip>
        <Tooltip
          title="Delete this cluster connection from your saved connections. This action cannot be undone!"
          placement="top"
        >
          <Button
            onClick={deleteUserConnection}
            variant="contained"
            color="error"
            size="medium"
          >
            DELETE SELECTED CONNECTION
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
