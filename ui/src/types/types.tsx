import { ReactNode, ChangeEvent } from 'react';
// MUI types
import { SelectChangeEvent } from '@mui/material/Select';

// App component Props type
// Login and Signup don't need to be passed as props to App b/c they display outside the app
export interface Props {
  saved?: JSX.Element;
  connect?: JSX.Element;
  resourceUsage?: JSX.Element;
  clusterView?: JSX.Element;
  partitionView?: JSX.Element;
}

// App component navTabOption type
export interface NavTabOption {
  route: string;
  icon: ReactNode;
  text: string;
}

// Connect component Props type
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

// Configure component Props type
export interface ConfigureProps {
  network: string;
  networkOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  brokerInfo: BrokerInfo[];
  updateHostOrPort: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  addBroker: () => void;
  removeBroker: (index: number) => void;
}

// Configure component brokerInfo array obj type
// Corresponds to backend interface jmxData
export interface BrokerInfo {
  broker: number; // not used on BE
  host: string; // jmx_hostname
  port: string; // jmx_port_number
}

// Login and Signup components, User type for verifyUser and postNewUser handlers
export interface User {
  email: string;
  password: string;
  role?: string;
}

// SavedConnections component, GridRowDef type for each row obj in rows array in state
export interface GridRowDef {
  id: number;
  clientId: string;
  host: string;
  port: string;
  auth: string;
}

// SaveNewConnection component, KafkaJS client info
// Corresponds to backend interface clientData
export interface KafkajsClientInfo {
  client_id: string;
  bootstrap_hostname: string;
  port_number: string;
  auth_mechanism: string;
  username: string; // will pass empty string if auth_mechanism is not N/A
  password: string; // will pass empty string if auth_mechanism is not N/A
}

// SaveNewConnection component, Connection type for handleFinish handler
// Corresponds to backend interface userData
export interface Connection {
  client: KafkajsClientInfo;
  user_network: string;
  jmxPorts: BrokerInfo[];
}

// Login and Signup components, User type for verifyUser and postNewUser handlers
export interface User {
  email: string;
  password: string;
  role?: string;
}

// SavedConnections component, GridRowDef type for each row obj in rows array in state
export interface GridRowDef {
  id: number;
  clientId: string;
  host: string;
  port: string;
  auth: string;
  // fetchMetrics: 1; // Fix: MUI button
  // fetchLogs: 1; // Fix: MUI button
}

// SaveNewConnection component, KafkaJS client info
// Corresponds to backend interface clientData
export interface KafkajsClientInfo {
  client_id: string;
  bootstrap_hostname: string;
  port_number: string;
  auth_mechanism: string;
  username: string; // will pass empty string if auth_mechanism is not N/A
  password: string; // will pass empty string if auth_mechanism is not N/A
}

// SaveNewConnection component, Connection type for handleFinish handler
// Corresponds to backend interface userData
export interface Connection {
    client: KafkajsClientInfo;
    user_network: string;
    jmxPorts: BrokerInfo[];
}
