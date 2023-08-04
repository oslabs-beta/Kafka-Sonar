import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
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
    width: 130,
  },
  {
    field: 'host',
    headerName: 'Hostname',
    description: 'Your cluster is found at this host.',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 140,
  },
  {
    field: 'port',
    headerName: 'Port',
    description: 'Your cluster is found at this port.',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 100,
  },
  {
    field: 'auth',
    headerName: 'Authentication',
    description:
      'SASL method to authenticate to the cluster (or not applicable)',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 170,
  },
  {
    field: 'network',
    headerName: 'Docker Network',
    description: 'Your cluster is in this network.',
    headerClassName: 'header',
    headerAlign: 'center',
    width: 180,
  },
];

export default function SavedConnectionsDataGrid() {
  const [rows, setRows] = useState<GridRowDef[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(0); // on BE, cluster_id is a number type
  const [connectedClientId, setConnectedClientId] = useState<string>('');
  const navigate = useNavigate();

  // handles updating selectedRow with cluster_id / id of the selected row in the DataGrid
  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    console.log('PARAMS --> ', params);
    // console.log('EVENT --> ', event);
    setSelectedRow(params.row.id);
  };

  // ISSUE: need to handle Cmd+click deselect of a row, which should reset selectedRow to 0

  // instantiate DD client object
  const ddClient = createDockerDesktopClient();

  const getUserConnections = async () => {
    // must pass user_id to BE
    // GET all connections associated with logged-in user
    // Issue with type UserConnection[]
    const allUserConnections: any = await ddClient.extension.vm.service.get(
      `/api/clusters/userclusters/${localStorage.getItem('id')}`
    );
    console.log('allUserConnections --> ', allUserConnections);
    // map over allUserConnections to get only the data expected for the grid
    const gridRows = allUserConnections.map(
      // destructure and keep only the properties needed for the DataGrid
      ({
        cluster_id,
        client_id,
        bootstrap_hostname,
        port_number,
        auth_mechanism,
        user_network,
      }) => {
        return {
          // See references: https://mui.com/x/react-data-grid/row-definition/#row-identifier, https://mui.com/x/react-data-grid/getting-started/#define-rows
          id: cluster_id, // all cluster_ids should be unique
          clientId: client_id,
          host: bootstrap_hostname,
          port: port_number,
          auth: auth_mechanism,
          network: user_network,
        };
      }
    );
    setRows(gridRows);
  };

  // useEffect is called 2x on component mount as of React v18 (need to fact check version)
  useEffect(() => {
    getUserConnections();
  }, []); // called once on component mount (and whenever rows updates?)

  const connectToSelected = async () => {
    // if there IS a running connection, don't do the API call!
    if (connectedClientId) {
      // alert user there's a currently running cluster connection
      alert(
        `${connectedClientId} is currently running. Always disconnect a running client before connecting to another.`
      );
      // exit function
      return;
    }
    // must pass clientId and network of the selected row to BE
    const selectedClientId = rows.filter((row) => row.id === selectedRow)[0]
      .clientId;
    const selectedNetwork = rows.filter((row) => row.id === selectedRow)[0]
      .network;
    // store selectedClientId as connectedClientId (this will be used to disconnect later on)
    setConnectedClientId(selectedClientId);
    // request to connect to the selected cluster
    const connected: any = await ddClient.extension.vm.service.get(
      `/api/clusters/connect/${selectedClientId}/${selectedNetwork}`
    );
    // error handling
    // if (connected instanceof Error)
    // else
    // toast success message
    ddClient.desktopUI.toast.success(
      `You have connected to ${selectedClientId}. Please wait a moment for Grafana metrics to render.`
    );
    // redirect to ClusterView
    navigate('/cluster');
    // reload after 2 seconds to allow Grafana panels a moment to appear
    setTimeout(() => location.reload(), 2000);
  };

  const disconnectFromCurrent = async () => {
    const selectedClientId = rows.filter((row) => row.id === selectedRow)[0]
    .clientId;
    setConnectedClientId(selectedClientId);
    console.log('selectedClientId', selectedClientId)
    console.log('connectedClientId', connectedClientId)
    // if there is NO running connection, don't do the API call!
    if (!connectedClientId || !selectedClientId) {
      // alert user there's no currently running cluster connection
      alert('You are not connected to any client.');
      // exit function
      return;
    }
    console.log('connectedClientId after alert', connectedClientId)
    // must pass connectedClientId to BE
    // request to disconnect from the connected cluster
    const disconnected: any = await ddClient.extension.vm.service.get(
      `/api/clusters/disconnect/${connectedClientId}`
    );
    // error handling
    // if (disconnected instanceof Error)
    // else
    // alert user of successful disconnection
    alert(`You have disconnected from ${connectedClientId}.`);
    // reset connectedClientId to empty string
    setConnectedClientId('');
  };

  // Needed checks:
  // BUG: Delete works, nothing happens after.
  const deleteUserConnection = async () => {
    const selectedClientId = rows.filter((row) => row.id === selectedRow)[0]
      .clientId;
    // if the selected connection is currently running, don't do the API call! Users should NOT be able to delete a running connection.
    if (connectedClientId === selectedClientId) {
      // alert user that the connection they selected is currently running
      alert(
        `${connectedClientId} is currently running. Disconnect the client before deleting it from your saved connections.`
      );
      // exit function
      return;
    }
    // must pass user_id and cluster_id to BE
    // DELETE selected connection
    const deletedConnection: any = await ddClient.extension.vm.service.delete(
      `/api/clusters/${localStorage.getItem('id')}/${selectedRow}`
    );
    // error handling
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
        <Typography component="h1" variant="h6" margin={'-20px auto 0'}>
          HOW THE ACTIONS WORK
        </Typography>
        <List>
          <ListItemText primary="1. Except for Disconnect, select a row to take an action. Cmd+click to deselect a selected row." />
          <ListItemText primary="2. You can run only ONE client at a time." />
          <ListItemText primary="3. You must disconnect a running client before deleting it or connecting to another client." />
          <ListItemText primary="4. If you download metrics or logs for a running client, you will get the most up-to-date data." />
        </List>
        <Button onClick={connectToSelected} variant="outlined" size="medium">
          CONNECT TO SELECTED CLUSTER
        </Button>
        <Tooltip
          title="You must disconnect a running cluster before connecting to another cluster!"
          placement="top"
        >
          <Button
            onClick={disconnectFromCurrent}
            variant="outlined"
            color="error"
            size="medium"
          >
            DISCONNECT FROM RUNNING CLUSTER
          </Button>
        </Tooltip>
        <Tooltip
          title="Get a CSV of metrics from all previous runs of this cluster connection"
          placement="top"
        >
          <Button variant="contained" color="success" size="medium">
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