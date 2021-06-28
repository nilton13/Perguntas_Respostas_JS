const Sequelize = require("sequelize");

const connection = new Sequelize('perguntas','niltonf','123456',{
    host:'localhost',
    dialect:'mysql'
});

module.exports = connection;
