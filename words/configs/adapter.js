const SqlAdapter = require("moleculer-db-adapter-sequelize");

module.exports = new SqlAdapter('words', 'test', 'test', {
    host: 'words-postgre',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    // noSync: true
})