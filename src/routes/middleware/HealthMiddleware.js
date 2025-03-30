function healthMiddleware(req, res, next){
    if(req.method=="GET" || req.method == "get"){
        // console.log(req.method)
        next();
    }
    else{
        res.status(405).send();
        return;
    }
    if(Object.keys(req.body).length>0 || typeof(req.body)==JSON){
        res.status(400).send();
        return;
    }

    req.on("data", ()=>{
        res.status(400).send();
        return;
    })

    if(Object.keys(req.query).length>0){
        res.status(400).send();
    }

    // console.log(req.headers);

    // const predefinedHeaders = ['user-agent', 'accept', 'postman-token', 'host', 'accept-encoding', 'connection', 'cookie', , 'x-amzn-trace-id', 'x-forwarded-for'];
    
    // for(let header in req.headers){
    //     if(!predefinedHeaders.includes(header.toLowerCase())){
    //         res.status(400).send();
    //     }
    // }

}

module.exports = {
    healthMiddleware : healthMiddleware
}