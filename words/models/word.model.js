const Sequelize = require("sequelize");

module.exports = {
    name: 'Word',
    define: {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        text: {
            type: Sequelize.STRING
        },
        trans: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: []
        }
    }
}