export default (network: string, clusterDir: string) => {
  const grafRunOpts = {
    image: 'grafana/grafana:latest',
    cmd: [`echo ${clusterDir}-kafkasonar-grafana is online`],
    createOpts: {
      name: `${clusterDir}-kafkasonar-grafana`,
      ExposedPorts: { ['3000/tcp']: {} },
      HostConfig: {
        VolumesFrom: ['kafka-sonar:ro'],
        PortBindings: {
          "3000/tcp": [ { HostPort: "3000"} ]
        }
      },
      // connect prometheus to the user's network to scrape JMX
      NetworkingConfig: {
        EndpointsConfig: {
          [network]: { Aliases: [`${network}`] },
        }
      },
      Env: [
        `GF_PATHS_DATA=/backend/user/${clusterDir}/configs/grafana/dashboards`,
        'CORS_ALLOW_ORIGIN=*',
        'GF_AUTH_ANONYMOUS_ENABLED=true',
        'GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer'
      ]
    },
    startOpts: {} 
  };
  return grafRunOpts;
};