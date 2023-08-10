import { ReactNode, ChangeEvent } from 'react';
// MUI types
import { SelectChangeEvent } from '@mui/material/Select';

// LOGIN / SIGNUP
// verifyUser and postNewUser handlers, POST body data shape
export interface User {
  username: string;
  password: string;
  role?: string; // not reqd for Login; required for Signup since creating a user record in DB necessitates a role / account_type
}

// verifyUser and postNewUser handlers, result data shape
export interface AuthSuccess {
  message: string;
  id: number;
  token: string;
}
export interface AuthError {
  message: string;
  error: string;
}
// for Login only
export interface AuthInvalid {
  message: string;
}
export type AuthResult = AuthSuccess | AuthError | AuthInvalid;

// APP
export interface NavTabOption {
  onClick: () => void;
  icon: ReactNode;
  text: string;
}

// SAVENEWCONNECTION and CONNECT
export interface ConnectProps {
  client: string;
  clientOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  host: string;
  hostOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  port: string;
  portOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  auth: string;
  authOnChange: (e: SelectChangeEvent) => void;
  username: string;
  usernameOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  password: string;
  passwordOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// SAVENEWCONNECTION and CONFIGURE
export interface ConfigureProps {
  network: string;
  networkOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  brokerInfo: BrokerInfo[]; // BrokerInfo interface defined below
  updateHostOrPort: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  addBroker: () => void;
  removeBroker: (index: number) => void;
}

// Corresponds to BE interface jmxData
export interface BrokerInfo {
  broker: number; // not used on BE
  host: string; // jmx_hostname
  port: string; // jmx_port_number
}

// SAVENEWCONNECTION
// handleFinish handler, POST body data shape
export interface NewConnection {
  client: string;
  host: string;
  port: string;
  auth: string;
  username: string;
  password: string;
  network: string;
  brokerInfo: BrokerInfo[];
}

// SAVEDCONNECTIONS
export interface SavedConnectionsProps {
  connectedClientId: string | null; // added "| null" b/c of a make update-extension TS error in App
  setConnectedClientId: (clientId: string | null) => void;
}

// For each row obj in rows array in state (rows are rendered in the DataGrid)
export interface GridRowDef {
  id: number;
  clientId: string;
  host: string;
  port: string;
  auth: string;
  network: string;
}

// getUserConnections function, result data shape
export interface UserConnection {
  cluster_id: number;
  client_id: string;
  bootstrap_hostname: string;
  port_number: string;
  auth_mechanism: string;
  username: string;
  password: string;
  user_network: string;
  _id: number;
  user_id: number;
}
