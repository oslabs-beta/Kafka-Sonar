// utility function to write a Grafana datasource file pointing to a cluster's instance of Prometheus
export default (clusterDir: string) => {
  return (`
# config file version
apiVersion: 1

# list of datasources that should be deleted from the database
deleteDatasources:
  - name: Prometheus
    orgId: 1

# list of datasources to insert/update depending
# what's available in the database
datasources:
  # <string, required> name of the datasource. Required
  - name: Prometheus
    # <string, required> datasource type. Required
    type: prometheus
    # <string, required> access mode. proxy or direct (Server or Browser in the UI). Required
    access: proxy
    # <int> org id. will default to orgId 1 if not specified
    orgId: 1
    # <string> url
    url: http://${clusterDir}-kafkasonar-prometheus:9090
    # <string> database password, if used
    password:
    # <string> database user, if used
    user:
    # <string> database name, if used
    database:
    # <bool> enable/disable basic auth
    basicAuth: false
    # <string> basic auth username
    # basicAuthUser: admin
    # <string> basic auth password
    # basicAuthPassword: kafka
    # <bool> enable/disable with credentials headers
    withCredentials: true
    # <bool> mark as default datasource. Max one per org
    isDefault: true
    # <map> fields that will be converted to json and stored in json_data
    jsonData:
      graphiteVersion: '1.1'
      tlsAuth: false
      tlsAuthWithCACert: false
    # <string> json object of data that will be encrypted.
    secureJsonData:
      tlsCACert: '...'
      tlsClientCert: '...'
      tlsClientKey: '...'
    version: 1
    # <bool> allow users to edit datasources from the UI.
    editable: true
  `)
}