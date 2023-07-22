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
export interface BrokerInfo {
  broker: number;
  host: string;
  port: string;
}

// Login and Signup components, User type for verifyUser and postNewUser handlers
export interface User {
  email: string;
  password: string;
  role?: string;
}

export interface GridRowDef {
  clientId: string;
  host: string;
  port: string;
  auth: string;
  // fetchMetrics: 1; // Fix: MUI button
  // fetchLogs: 1; // Fix: MUI button
}

// FOLLOWING TYPE DEFINITIONS ARE DESIGNED TO MATCH DATABASE COL NAMES AND/OR EXPECTED BE DATA SHAPES

// SaveNewConnection component, KafkaJS client info
export interface KafkajsClientInfo {
  client_id: string;
  bootstrap_hostname: string;
  port_number: string;
  auth_mechanism: string;
  username: string;
  password: string;
}

// SaveNewConnection component, Connection type for handleFinish handler
export interface Connection {
  client: KafkajsClientInfo;
  user_network: string;
  jmxPorts: BrokerInfo[];
}
