import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  password: 'mysecretpassword',
  host: 'timescaledb',
  port: 5432,
  database: 'kafka_sonar_db',
});

//Schema for database found in data.sql

const query = (
  text: string,
  params?: any[],
  callback?: (err: Error, result: any) => void
): Promise<any> => {
  console.log('Executed query: ', text);
  return pool.query(text, params, callback);
};

export { query };
