const { DataTypes } = require("sequelize")
const {sequelize} = require("../config/database")

const File = sequelize.define("File", {
    file_name :{
        type : DataTypes.STRING,
    },
    file_id :{
        type : DataTypes.STRING,
        primaryKey : true
    },
    url :{
        type : DataTypes.STRING,
    },
    upload_date :{
        type : DataTypes.STRING,
    }
    
}, {
    sequelize,
    tableName : 'File',
    timestamps : false
})

module.exports = {
    File : File
}