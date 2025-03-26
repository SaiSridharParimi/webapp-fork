const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const aws = require("aws-sdk");
const { File } = require("../../models/File");
const s3 = new aws.S3();
const { v4: uuidv4 } = require('uuid');
const logger = require("../../logger");
const statsd = require("../../statsd");

async function FileController(req, res) {
    const apiStartTime = Date.now();
    logger.info(`Received request: ${req.method} ${req.url}`);
    statsd.increment(`api.${req.method.toLowerCase()}.requests`);
    
    const apiDurationStart = Date.now(); 
    
    if (req.method === "HEAD" || req.method === "OPTIONS" || req.method === "PUT" || req.method === "PATCH") {
        logger.warn(`Method ${req.method} not allowed on ${req.url}`);
        statsd.increment(`api.${req.method.toLowerCase()}.errors`);
        res.status(405).send();
        return;
    }

    if (req.method === "POST") {
        const startTime = Date.now();
        upload.single("profilePic")(req, res, async function (err) {
            if (err) {
                logger.error("Multer error while uploading file", { error: err.message });
                statsd.increment("api.upload.errors");
                res.status(400).send();
                return;
            }
            if (!req.file) {
                logger.warn("File not provided in request");
                statsd.increment("api.upload.missing_file");
                return res.status(400).send();
            }
            const file = req.file;
            const fileStartTime = Date.now();
            // console.log(file.originalname);

            const fileId = uuidv4();
            const key = `${fileId}/${file.originalname}`;
            const s3StartTime = Date.now();
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const uploadResult = await s3.upload(uploadParams).promise();
            const s3Duration = Date.now() - s3StartTime;
            statsd.timing("api.s3.upload.time", s3Duration);
            logger.info(`File uploaded to S3 successfully: ${uploadResult.Location}, Time taken: ${s3Duration}ms`);
            const uploadDate = new Date().toISOString().split("T")[0];
            const dbStartTime = Date.now();
            const dbResult = await File.create({
                file_name: file.originalname,
                id: fileId,
                url: `${process.env.BUCKET_NAME}/${key}`,
                upload_date: uploadDate,
            });

            const dbDuration = Date.now() - dbStartTime;
            statsd.timing("api.db.insert.time", dbDuration);
            logger.info(`File metadata saved to database with ID: ${dbResult.id}, Time taken: ${dbDuration}ms`);
            statsd.increment("api.upload.success");

            const totalDuration = Date.now() - startTime;
            statsd.timing("api.upload.time", totalDuration);

            const apiTotalDuration = Date.now() - apiDurationStart;
            statsd.timing("api.upload.api.time", apiTotalDuration);
            logger.info(`Total API request time: ${apiTotalDuration}ms`);

            return res.status(201).json({
                file_name: file.originalname,
                id: dbResult.id,
                url: `${process.env.BUCKET_NAME}/${key}`,
                upload_date: uploadDate,
            });
        });
    }

    else if (req.method === "GET") {
        const startTime = Date.now();
        const { id } = req.params;
        // console.log(id);

        if (!id) {
            logger.warn("File ID missing in GET request");
            statsd.increment("api.get.missing_id");
            res.status(400).send();
            return;
        }
        logger.info(`Fetching file metadata from database for ID: ${id}`);
        const dbStartTime = Date.now();
        const fileRecord = await File.findOne({ where: { id: id } });
        const dbDuration = Date.now() - dbStartTime;
        statsd.timing("api.db.query.time", dbDuration);
        logger.info(`DB query completed in: ${dbDuration}ms`);
        if (!fileRecord) {
            logger.warn(`File with ID ${id} not found`);
            statsd.increment("api.get.not_found");
            res.status(404).send();
            return;
        }
        logger.info(`File metadata retrieved successfully for ID: ${id}`);
        const getTotalDuration = Date.now() - startTime;
        statsd.timing("api.get.time", getTotalDuration);
        logger.info(`GET request completed in: ${getTotalDuration}ms`);
        res.status(200).send({
            file_name: fileRecord.file_name,
            id: fileRecord.id,
            url: fileRecord.url,
            upload_date: fileRecord.upload_date,
        });
    }

    else if (req.method === "DELETE") {
        const deleteStartTime = Date.now();
        const { id } = req.params;
        if (!id) {
            logger.warn("File ID missing in DELETE request");
            res.status(404).send();
            return;
        }
        logger.info(`Fetching file metadata for deletion with ID: ${id}`);
        const fileRecord = await File.findOne({ where: { id: id } });
        if (!fileRecord) {
            logger.warn(`File with ID ${id} not found`);
            res.status(404).send();
            return;
        }
        const deleteParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileRecord.url,
        };
        logger.info(`Deleting file from S3: ${fileRecord.url}`);
        const deleteStartT = Date.now();
        const response = await s3.deleteObject(deleteParams).promise();
        const deleteDuration = Date.now() - deleteStartT;
        statsd.timing("api.s3.delete.time", deleteDuration);
        logger.info(`File deleted from S3 successfully`);
        const dbDeleteStartTime = Date.now();
        const dbResponse = await File.destroy({ where: { id: id } });
        const dbDeleteDuration = Date.now() - dbDeleteStartTime;
        statsd.timing("api.db.delete.time", dbDeleteDuration);
        logger.info(`File metadata deleted from database for ID: ${id}, Time taken: ${dbDeleteDuration}ms`);
        const deleteTotalDuration = Date.now() - deleteStartTime;
        statsd.timing("api.delete.time", deleteTotalDuration);
        logger.info(`DELETE request completed in: ${deleteTotalDuration}ms`);
        res.status(204).send();
    }
}

module.exports = {
    FileController: FileController
};
