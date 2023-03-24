var knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '0000',
    database: 'api_users',
    port: 3307
  }
});

module.exports = knex