const db = require('../db-config');

module.exports = {
  getAllRoutes: () => { return db('routes'); },
};
