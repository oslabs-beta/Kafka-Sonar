import { ContainerCreateOptions } from 'dockerode';

// utility function that creates and returns an object which Dockerode uses to create a Prometheus container
export default (network: string, clusterDir: string) => {
  const promContainerCreateOpts: ContainerCreateOptions = {
    name: `${clusterDir}-kafkasonar-prometheus`,
    Image: 'prom/prometheus:latest',
    Cmd: [
      `--config.file=/backend/user/${clusterDir}/configs/prometheus/prometheus.yml`,
    ],
    ExposedPorts: { ['9090/tcp']: {} },
    HostConfig: {
      VolumesFrom: ['kafkasonar:ro'],
      PortBindings: {
        '9090/tcp': [{ HostPort: '9090' }],
      },
      AutoRemove: false,
    },
    // connect prometheus to the user's network to scrape JMX
    NetworkingConfig: {
      EndpointsConfig: {
        [network]: { Aliases: [`${network}`] },
      },
    },
  };
  return promContainerCreateOpts;
};
