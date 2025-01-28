const {Sequelize} = require("sequelize");
require("dotenv").config()

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host : process.env.HOST,
    port : process.env.DATABASE_PORT,
    dialect : process.env.DIALECT,
    logging : false,
    pool :{
        max : 10,
        min : 2,
        acquire : 1000,
        idle : 20000
    }
})

module.exports = {
    sequelize : sequelize
}