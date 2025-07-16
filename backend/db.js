const {Sequelize} = require('sequelize')


module.exports = new Sequelize(
    'Sibers', // Название БД
    'root', // Пользователь
    '', // ПАРОЛЬ
    {
        dialect: 'mysql',
        host: 'localhost',
        logging: false
    }
)
