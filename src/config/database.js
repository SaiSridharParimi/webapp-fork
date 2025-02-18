const {Sequelize} = require("sequelize");
require("dotenv").config()
// const mysql = require("mysql2/promise")

// mysql.createConnection({
//     user : process.env.DATABASE_USERNAME,
//     password: process.env.DATABASE_PASSWORD
// }).then(async(connection)=>{
//     console.log("Creating DB")
//     try{
//         await connection.query("create database if not exists "+process.env.DATABASE_NAME)
//     }catch(err){
//         console.log(err)
//     }finally{
//         await connection.end()
//     }
// })
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host : process.env.HOST,
    port : process.env.DATABASE_PORT,
    dialect : process.env.DIALECT || 'mysql',
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