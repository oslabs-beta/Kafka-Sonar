// App component Props type
// Login and Signup don't need to be passed as props to App b/c they display outside the app
export interface Props {
  connect?: JSX.Element;
  resourceUsage?: JSX.Element;
  clusterView?: JSX.Element;
  partitionView?: JSX.Element;
}

// Configure component brokerInfo array obj type
export interface BrokerInfo {
  broker: number;
  host: string;
  port: string;
}
