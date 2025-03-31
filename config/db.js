const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false,  // Accept self-signed certificates (Aiven provides SSL certificates)
  },
});

// Test the connection on startup
pool.connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  });

// Handle connection errors after the server has started
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(1); // Exit the process in case of a database error
});

module.exports = pool;
