import pkg from 'pg';
const { Pool } = pkg;

const PG_URI =
  'postgres://iixpmrcn:5v13C7G-4lHGnDcFI3FTEx8fKQWSJMak@stampy.db.elephantsql.com/iixpmrcn';

const pool = new Pool({
  // user: 'postgres',
  // password: 'mysecretpassword',
  // host: '172.18.0.10',
  // port: 5432,
  // database: 'kafka_sonar_db',

  connectionString: PG_URI,
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
