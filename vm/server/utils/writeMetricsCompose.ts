export default (network: String, clusterDir: String) => {
  return (
`version: '3.5'

networks:
  ${network}:
    external: true
  kafka-sonar:
    external: true

services:
  grafana:
    image: 'grafana/grafana:latest'
    networks:
      - ${network}
      - kafka-sonar
    container_name: ${clusterDir}-kafkasonar-grafana
    ports:
      - '3000:3000'
    environment:
      GF_PATHS_DATA: /var/lib/grafana
      CORS_ALLOW_ORIGIN: '*'
      GF_AUTH_ANONYMOUS_ENABLED: true
      GF_AUTH_ANONYMOUS_ORG_ROLE: Viewer
    volumes:
      - user:/etc/grafana/provisioning
      - user:/var/lib/grafana/dashboards
    depends_on:
      - prometheus

  prometheus:
    image: 'prom/prometheus:latest'
    networks:
      - ${network}
      - kafka-sonar
    container_name: ${clusterDir}-kafkasonar-prometheus
    ports:
      - '9090:9090'
    volumes:
      - /var/lib/docker/volumes/kafka-test-kafkasonar-metrics_user/_data:/user
    command: '--config.file=/user/${clusterDir}/configs/prometheus/prometheus.yml'

volumes:
  user:
    external:
      name: kafkasonar_kafkasonar-desktop-extension_user
`);
};

// we are in root/vm/server/utils/writeMetricsCompose.ts, volume paths are in root/vm/user/configs/prometheus/<name> for prometheus
// command for prometheus../user/configs/prometheus/${client_id}-prometheus.yml:/etc/prometheus/${client_id}-prometheus.yml

// ${clusterDir}-kafkasonar-metrics_kafka:
// driver: bridge
// name: ${clusterDir}-kafkasonar-metrics_kafka

// networks:
//   ${network}:
//     external: true


// services:
//   grafana:
//     image: 'grafana/grafana:latest'
//     networks:
//       - ${network}
//     container_name: grafana
//     ports:
//       - '3000:3000'
//     environment:
//       GF_PATHS_DATA: /var/lib/grafana
//       CORS_ALLOW_ORIGIN: '*'
//       GF_AUTH_ANONYMOUS_ENABLED: true
//       GF_AUTH_ANONYMOUS_ORG_ROLE: Viewer
//     volumes:
//       - ../configs/grafana/provisioning:/etc/grafana/provisioning
//       - ../configs/grafana/dashboards:/var/lib/grafana/dashboards
//     depends_on:
//       - prometheus

//   prometheus:
//     image: 'prom/prometheus:latest'
//     networks:
//       - ${network}
//     container_name: prometheus
//     ports:
//       - '9090:9090'
//     volumes:
//       - ../configs/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
//     command: '--config.file=/etc/prometheus/prometheus.yml'