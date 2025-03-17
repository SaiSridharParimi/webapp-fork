const { DataTypes } = require("sequelize")
const {sequelize} = require("../config/database")

const File = sequelize.define("File", {
    file_name :{
        type : DataTypes.STRING,
    },
    id :{
        type : DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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

// sequelize.sync({alter:true})

module.exports = {
    File : File
}