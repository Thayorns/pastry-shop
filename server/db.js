const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'k0raelstrazS',
    port: 5432,
})

module.exports = pool;
