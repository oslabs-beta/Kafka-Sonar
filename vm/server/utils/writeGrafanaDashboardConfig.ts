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