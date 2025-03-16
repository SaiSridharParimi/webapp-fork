const {FileController} = require("./controllers/FileController");
const {HealthController} = require("./controllers/HealthController");
const {healthMiddleware} = require("./middleware/HealthMiddleware")
const {Router} = require("express")
const HealthRouter = Router();

HealthRouter.use("/", healthMiddleware, HealthController);

const FileRouter = Router();
FileRouter.post("/", FileController)
FileRouter.get("/:id", FileController)
FileRouter.delete("/:id", FileController)

module.exports = {
    HealthRouter : HealthRouter,
    FileRouter : FileRouter
}