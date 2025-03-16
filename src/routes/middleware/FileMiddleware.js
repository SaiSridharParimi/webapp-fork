async function FileMiddleware(req, res, next){
    if(req.method === "HEAD" || req.method === "OPTIONS" || req.method === "PUT" || req.method === "PATCH"){
        res.status(405).send();
        return;
    }
    else{
        next();
    }
    // if(!req.file || Object.keys(req.body).length > 0){
    //     res.status(400).send()
    // }
}

module.exports = {
    FileMiddleware : FileMiddleware
}