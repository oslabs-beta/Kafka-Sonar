import { CONFIG } from '../../config';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: CONFIG.DB_USER,
  password: CONFIG.DB_PASSWORD,
  host: CONFIG.DB_HOST,
  port: CONFIG.DB_PORT,
  database: CONFIG.DB_NAME,
});

const query = (
  text: string,
  params?: any[],
  callback?: (err: Error, result: any) => void
): Promise<any> => {
  // console.log('Executed query: ', text);
  return pool.query(text, params, callback);
};

export { query };
