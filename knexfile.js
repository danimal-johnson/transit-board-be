require('dotenv').config();
// import 'dotenv/config';

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOSTNAME,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE_NAME
    },
    // generates migration files in a data/migrations/ folder
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  testing: {
    // TODO: Add testing configuration details
    client: 'pg',
    connection: process.env.DB_URL,
    migrations: {
      directory: './data/migrations'
    },
    seeds: { directory: './data/seeds' }
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOSTNAME,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE_NAME
    },
    // generates migration files in a data/migrations/ folder
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

};
