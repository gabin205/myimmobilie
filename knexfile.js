// Update with your config settings.

module.exports = {

    development: {
        client    : 'mysql2',
        connection: {host: '127.0.0.1', user: 'root', password: '', database: 'fa17g16'},
        migrations: {tableName: 'knex_migrations'}
    },
    staging    : {
        client    : 'mysql2',
        connection: {host: '127.0.0.1', user: 'root', password: '', database: 'fa17g16'},
        pool      : {min: 2, max: 10},
        migrations: {tableName: 'knex_migrations'}
    },
    production : {
        client    : 'mysql2',
        connection: {host: '127.0.0.1', user: 'root', password: '', database: 'fa17g16'},
        pool      : {min: 2, max: 10},
        migrations: {tableName: 'knex_migrations'}
    }


};
