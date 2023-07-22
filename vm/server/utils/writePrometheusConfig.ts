export default (targets: String) => {
  return (`
    global:
      scrape_interval: 15s
    
    rule_files:
    
    scrape_configs:
      - job_name: "kafka-sonar"
    
        static_configs:
          - targets: ${targets}`
  );
};