// utilty function to write a Grafana dashboard config with the path correctly pointing towrard the cluster's directory in the user volume
export default (clusterDir: string) => {
  return (`
  apiVersion: 1

  providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    editable: true
    updateIntervalSeconds: 3
    options:
      path: /backend/user/${clusterDir}/configs/grafana/dashboards`);
};