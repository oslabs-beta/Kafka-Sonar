export default (network: string, clusterDir: string) => {
  const grafRunOpts = {
    image: 'grafana/grafana:latest',
    // cmd: ['chmod', '600', `/backend/user/${clusterDir}/configs/grafana/dashboards`],
    cmd: [''],
    createOpts: {
      name: `${clusterDir}-kafkasonar-grafana`,
      // run as root user to grant write permissions in GF_PATHS_DATA, need to find better approach but this works for now
      User: 'root',
      ExposedPorts: { ['3000/tcp']: {} },
      HostConfig: {
        VolumesFrom: ['kafka-sonar:rw'],
        PortBindings: {
          "3000/tcp": [ { HostPort: "3000"} ]
        }
      },
      NetworkingConfig: {
        EndpointsConfig: {
          [network]: { Aliases: [`${network}`] },
        }
      },
      Env: [
        `GF_PATHS_DATA=/backend/user/${clusterDir}/configs/grafana/dashboards`,
        `GF_PATHS_PROVISIONING=/backend/user/${clusterDir}/configs/grafana/provisioning`,
        'CORS_ALLOW_ORIGIN=*',
        'GF_AUTH_ANONYMOUS_ENABLED=true',
        'GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer',
      ]
    },
    startOpts: {} 
  };
  return grafRunOpts;
};