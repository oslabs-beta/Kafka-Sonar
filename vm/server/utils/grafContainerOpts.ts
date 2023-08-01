export default (network: string, clusterDir: string) => {
  const grafRunOpts = {
    image: 'grafana/grafana:latest',
    cmd: [`echo ${clusterDir}-kafkasonar-grafana is online`],
    createOpts: {
      name: `${clusterDir}-kafkasonar-grafana`,
      // Volumes: {
      //   '/etc/grafana/provisioning': {},
      //   '/var/lib/grafana/dashboards': {},
      // },
      ExposedPorts: { ['3000/tcp']: {} },
      HostConfig: {
        VolumesFrom: ['kafka-sonar:rw'],
        // Mounts: [
        //   {
        //     Type: 'volume',
        //     Source: 'kafkasonar_kafkasonar-desktop-extension_user',
        //     Target: '/etc/grafana/provisioning',
        //     ReadOnly: false,
        //   }
        // ],
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