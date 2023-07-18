import { ReactNode } from 'react';

// App component Props type
// Login and Signup don't need to be passed as props to App b/c they display outside the app
export interface Props {
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
  clientOnChange: () => void;
  host: string;
  hostOnChange: () => void;
  port: string;
  portOnChange: () => void;
  auth: string;
  authOnChange: (e: MouseEvent) => void;
  username: string;
  usernameOnChange: () => void;
  password: string;
  passwordOnChange: () => void;
}

// Configure component Props type
export interface ConfigureProps {
  network: string;
  networkOnChange: () => void;
  brokerInfo: BrokerInfo[];
  updateHostOrPort: (e: KeyboardEvent, index: number) => void;
  addBroker: () => void;
  removeBroker: (index: number) => void;
}

// Configure component brokerInfo array obj type
export interface BrokerInfo {
  broker: number;
  host: string;
  port: string;
}
