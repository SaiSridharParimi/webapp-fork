const express = require("express");
const app = express()
app.use(express.json())
require("dotenv").config()
const {sequelize} = require("./config/database");
const { HealthRouter } = require("./routes/routes");

app.listen(process.env.PORT || 3000, (()=>{
    console.log("Server is listening on port "+process.env.PORT)
}))

sequelize.authenticate().then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log("Error connecting DB "+err)
})

app.use("/healthz", HealthRouter)