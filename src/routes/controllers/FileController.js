const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() });
const aws = require("aws-sdk");
const {File} = require("../../models/File");
const s3= new aws.S3()
const { v4: uuidv4 } = require('uuid');

async function FileController(req, res){
    if(req.method === "HEAD" || req.method === "OPTIONS" || req.method === "PUT" || req.method === "PATCH"){
        res.status(405).send();
        return;
    }
    if(req.method==="POST"){
        upload.single("profilePic")(req, res, async function(err){
            if(err){
                res.status(400).send()
            }
            if (!req.file) {
                return res.status(400).send();
            }
            const file = req.file;
            console.log(file.originalname)

            const fileId = uuidv4();
            const key = `${fileId}/${file.originalname}`
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }
            const uploadResult = await s3.upload(uploadParams).promise()
            const uploadDate = new Date().toISOString().split("T")[0];
            const dbResult = await File.create({
                file_name: file.originalname,
                id: fileId,
                url: `${process.env.BUCKET_NAME}/${key}`,
                upload_date: uploadDate,
            })
            return res.status(201).json({
                file_name: file.originalname,
                id: dbResult.id,
                url:`${process.env.BUCKET_NAME}/${key}`,
                upload_date: uploadDate
            });
        })
    }

    else if(req.method==="GET"){
        const {id} = req.params;
        console.log(id)
        if(!id){
            console.log("ID IS HERE")
            res.status(400).send()
            return;
        }
        
        const fileRecord = await File.findOne({ where: { id: id } });
        if(!fileRecord){
            res.status(404).send()
            return;
        }
        res.status(200).send({
            file_name: fileRecord.file_name,
            id: fileRecord.id,
            url: fileRecord.url,
            upload_date: fileRecord.upload_date,
        })
    }

    else if(req.method==="DELETE"){
        const {id} = req.params;
        if(!id){
            res.status(404).send()
            return;
        }
        const fileRecord = await File.findOne( { where: { id: id } } )
        console.log(fileRecord)
        if(!fileRecord){
            res.status(404).send()
            return;
        }
        const deleteParams = {
            Bucket : process.env.BUCKET_NAME,
            Key: fileRecord.url
        }
        const response = await s3.deleteObject(deleteParams).promise()
        const dbResponse = await File.destroy({where : {id : id}})
        res.status(204).send()
    }
}

module.exports = {
    FileController : FileController
}