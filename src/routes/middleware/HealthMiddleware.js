function healthMiddleware(req, res, next){
    if(req.method=="GET"){
        next();
    }
    else{
        res.status(405).send();
    }
    if(Object.keys(req.body).length>0 || typeof(req.body)==JSON){
        res.status(400).send()
    }

    req.on("data", ()=>{
        res.status(400).send()
    })

}

module.exports = {
    healthMiddleware : healthMiddleware
}