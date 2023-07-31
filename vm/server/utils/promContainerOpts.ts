export default (network: string, clusterDir: string) => {
  const promRunOpts = {
    image: 'prom/prometheus:latest',
    cmd: [`--config.file=/backend/user/${clusterDir}/configs/prometheus/prometheus.yml`],
    createOpts: {
      ExposedPorts: { ['9090/tcp']: {} },
      HostConfig: {
        VolumesFrom: ['kafka-sonar:ro'],
        PortBindings: {
          "9090/tcp": [ { HostPort: "9090"} ]
        }
      },
      // connect prometheus to the user's network to scrape JMX
      NetworkingConfig: {
        EndpointsConfig: {
          [network]: { Aliases: [`${network}`] },
        }
      },
    },
    startOpts: {} 
  };
  return promRunOpts;
}