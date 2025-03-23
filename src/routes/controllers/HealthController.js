const { sequelize } = require("../../config/database");
const logger = require("../../logger");
const { HealthCheck } = require("../../models/healthCheck");
const statsd = require("../../statsd");

async function HealthController(req,res){
    try{
        const startTime = Date.now();
        logger.info("Received request: GET /healthz");
        statsd.increment("api.healthz.requests");
        await sequelize.authenticate();
        // res.removeHeader("Connection");
        console.log("Hi in Controller==============")
        // res.removeHeader("X-Powered-By");
        // res.set("Cache-Control", "no-cache, no-store, must-revalidate;");
        // res.set("Pragma", "no-cache");
        // res.set("X-Content-Type-Options", "nosniff");
        logger.info("Database connection successful");
        statsd.increment("api.healthz.db.success");
        await HealthCheck.create({DateTime : new Date().toISOString()});
        logger.info("Health check record added to database");
        statsd.increment("api.healthz.db.record_created");
        const duration = Date.now() - startTime;
        statsd.timing("api.healthz.time", duration);
        logger.info(`GET /healthz processed in ${duration}ms`);
        res.status(200).send();
        return;
    }catch(err){
        console.log(err)
        logger.error("Database connection failed", { error: err.message });
        res.status(503).send();
        return;
    }
}

module.exports = {
    HealthController : HealthController
}