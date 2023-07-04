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
      max: 10,
      // createTimeoutMillis: 3000,
      // acquireTimeoutMillis: 30000,
      // idleTimeoutMillis: 30000,
      // reapIntervalMillis: 1000,
      // createRetryIntervalMillis: 100,
      // See https://github.com/knex/knex/issues/2820 for the next line
      propagateCreateError: false // "true" prevents reconnection attempts in Knex!
    },
    // Knex may not be reading timeouts from inside the pool object
    // See github.com/strapi/strapi/issues/11860 thread for more info
    acquireConnectionTimeout: 60000 // Should be the default
  },
};
