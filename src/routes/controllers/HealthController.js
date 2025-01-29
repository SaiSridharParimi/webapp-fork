const { sequelize } = require("../../config/database");
const {Router} = require("express");
const { HealthCheck } = require("../../models/healthCheck");
const HealthController = Router()

HealthController.get("/", async(req, res)=>{
    try{
        await sequelize.authenticate();
        res.removeHeader("Connection");
        res.removeHeader("X-Powered-By");
        res.set("Cache-Control", "no-cache, no-store, must-revalidate;");
        res.set("Pragma", "no-cache");
        res.set("X-Content-Type-Options", "nosniff");
        await HealthCheck.create({DateTime : new Date().toISOString()});
        res.status(200).send();
    }catch(err){
        res.status(503).send();
        return;
    }
})

module.exports = {
    HealthController : HealthController
}