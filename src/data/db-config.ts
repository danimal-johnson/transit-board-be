const knex = require('knex');

const configOptions = require('../../knexfile').development;

module.exports = knex(configOptions);

// TODO: Convert to ES module? Or will this break conditional importing?
