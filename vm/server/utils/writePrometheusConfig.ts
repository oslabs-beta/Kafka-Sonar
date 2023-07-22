interface Targets {
  broker: string,
  host: string,
  port: string
}

export default (targets: String) => {
  return (`
    global:
      scrape_interval: 15s
    
    rule_files:
    
    scrape_configs:
      - job_name: "kafka"
    
        static_configs:
          - targets: ${targets}`
  )
}