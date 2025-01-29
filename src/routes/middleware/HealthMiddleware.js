function healthMiddleware(req, res, next){
    if(req.method=="GET"){
        next();
    }
    else{
        res.removeHeader("Connection");
        res.removeHeader("X-Powered-By");
        res.set("Cache-Control", "no-cache, no-store, must-revalidate;");
        res.set("Pragma", "no-cache");
        res.set("X-Content-Type-Options", "nosniff");
        res.status(405).send();
    }
    if(Object.keys(req.body).length>0 || typeof(req.body)==JSON){
        res.removeHeader("Connection");
        res.removeHeader("X-Powered-By");
        res.set("Cache-Control", "no-cache, no-store, must-revalidate;");
        res.set("Pragma", "no-cache");
        res.set("X-Content-Type-Options", "nosniff");
        res.status(400).send();
    }

    req.on("data", ()=>{
        res.removeHeader("Connection");
        res.removeHeader("X-Powered-By");
        res.set("Cache-Control", "no-cache, no-store, must-revalidate;");
        res.set("Pragma", "no-cache");
        res.set("X-Content-Type-Options", "nosniff");
        res.status(400).send();
    })

    if(Object.keys(req.query).length>0){
        res.removeHeader("Connection");
        res.removeHeader("X-Powered-By");
        res.set("Cache-Control", "no-cache, no-store, must-revalidate;");
        res.set("Pragma", "no-cache");
        res.set("X-Content-Type-Options", "nosniff");
        res.status(400).send();
    }

    console.log(req.headers);

    const predefinedHeaders = ['user-agent', 'accept', 'postman-token', 'host', 'accept-encoding', 'connection', 'cookie'];
    
    for(let header in req.headers){
        if(!predefinedHeaders.includes(header.toLowerCase())){
            res.removeHeader("Connection");
            res.removeHeader("X-Powered-By");
            res.set("Cache-Control", "no-cache, no-store, must-revalidate;");
            res.set("Pragma", "no-cache");
            res.set("X-Content-Type-Options", "nosniff");
            res.status(400).send();
        }
    }

}

module.exports = {
    healthMiddleware : healthMiddleware
}