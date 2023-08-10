import dotenv from 'dotenv';

dotenv.config();

export const METRICS_PORT = 3332;

export const CONFIG = {
  DB_USER: process.env.DB_USER || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_HOST: process.env.DB_HOST || "",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "",
  ENV: process.env.ENV || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  PROMETHEUS_URL: process.env.PROMETHEUS_URL || "",
  SOCKET_PATH: "/run/guest-services/backend.sock",
};
