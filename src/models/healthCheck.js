const { DataTypes } = require("sequelize")
const {sequelize} = require("../config/database")

const HealthCheck = sequelize.define("Health", {
    checkId :{
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    DateTime : {
        type : DataTypes.DATE
    }
}, {
    sequelize,
    tableName : 'healthcheck',
    timestamps : false
})

module.exports = {
    HealthCheck : HealthCheck
}