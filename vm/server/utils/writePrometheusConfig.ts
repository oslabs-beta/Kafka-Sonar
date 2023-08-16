interface Targets {
  broker: String;
  jmx_hostname: String;
  jmx_port_number: String;
}

// utility function to write a Prometheus config which targets the user's cluster's JMX ports
export default (targets: Targets) => {
  const targetsString = JSON.stringify(targets);
  return `
    global:
      scrape_interval: 3s
    
    rule_files:
    
    scrape_configs:
      - job_name: "kafkasonar"
    
        static_configs:
          - targets: ${targetsString}`;
};
