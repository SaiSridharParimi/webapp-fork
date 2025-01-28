const {HealthController} = require("./controllers/HealthController");
const {healthMiddleware} = require("./middleware/HealthMiddleware")
const {Router} = require("express")
const HealthRouter = Router();

HealthRouter.use("/", healthMiddleware, HealthController);

module.exports = {
    HealthRouter : HealthRouter
}