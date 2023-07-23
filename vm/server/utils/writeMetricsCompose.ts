export default (network: String, client_id: String) => {
  return (
`version: '3.5'

networks:
  ${network}:
    external: true

services:
  grafana:
    image: 'grafana/grafana:latest'
    networks:
      - ${network}
    container_name: grafana
    ports:
      - '3000:3000'
    environment:
      GF_PATHS_DATA: /var/lib/grafana
      CORS_ALLOW_ORIGIN: '*'
      GF_AUTH_ANONYMOUS_ENABLED: true
      GF_AUTH_ANONYMOUS_ORG_ROLE: Viewer
    volumes:
      - ./user/${client_id}/configs/grafana/provisioning:/etc/grafana/provisioning
      - ./user/${client_id}/configs/grafana/dashboards:/var/lib/grafana/dashboards
    depends_on:
      - prometheus

  prometheus:
    image: 'prom/prometheus:latest'
    networks:
      - ${network}
    container_name: prometheus
    ports:
      - '9090:9090'
    volumes:
      - ./user/${client_id}/configs/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    command: '--config.file=/etc/prometheus/prometheus.yml'`);
};

// we are in root/vm/server/utils/writeMetricsCompose.ts, volume paths are in root/vm/user/configs/prometheus/<name> for prometheus
// command for prometheus../user/configs/prometheus/${client_id}-prometheus.yml:/etc/prometheus/${client_id}-prometheus.yml