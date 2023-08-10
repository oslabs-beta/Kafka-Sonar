import { ContainerCreateOptions } from "dockerode";

// utility function creates and returns an object which Dockerode uses to create a Grafana container
export default (network: string, clusterDir: string) => {
  const grafContainerCreateOpts: ContainerCreateOptions = {
    name: `${clusterDir}-kafkasonar-grafana`,
    Image: 'grafana/grafana:latest',
    // run as root user to grant write permissions in GF_PATHS_DATA, need to find better approach but this works for now
    User: 'root',
    Cmd: [''],
    ExposedPorts: { ['3000/tcp']: {} },
    HostConfig: {
      VolumesFrom: ['kafka-sonar:rw'],
      PortBindings: {
        "3000/tcp": [ { HostPort: "3000"} ]
      },
      AutoRemove: false
    },
    NetworkingConfig: {
      EndpointsConfig: {
        [network]: { Aliases: [`${network}`] },
      }
    },
    Env: [
      `GF_PATHS_DATA=/backend/user/${clusterDir}/configs/grafana/dashboards`,
      `GF_PATHS_PROVISIONING=/backend/user/${clusterDir}/configs/grafana/provisioning`,
      `GF_PATHS_CONFIG=/backend/user/${clusterDir}/configs/grafana/grafana.ini`,
      'CORS_ALLOW_ORIGIN=*',
      'GF_AUTH_ANONYMOUS_ENABLED=true',
      'GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer',
    ]
  }
  return grafContainerCreateOpts;
}