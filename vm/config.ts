import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST || "timescaledb",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "kafka_sonar_db",
  ENV: process.env.ENV || "cluster-demo",
  JWT_SECRET: process.env.JWT_SECRET,
  METRICS_PORT: Number(process.env.METRICS_PORT) || 3332,
  PROMETHEUS_URL: process.env.PROMETHEUS_URL || "http://host.docker.internal:9090",
  SOCKET_PATH: "/run/guest-services/backend.sock",
};
