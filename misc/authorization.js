const jwt = require("jsonwebtoken")
const model = require("../models/users.model")

var Authorization = {}

Authorization.authorizeJWTUser = async function(req, res, nex){
    try{
        var auth = req.headers.authorization.split(" ")[1]
        var data = await jwt.decode(auth)
        if(data.company_id != null) res.status(403).send()
        req.body.userId = data.serial_id
        nex()
    }catch(err){
        res.status(403).send()
    }
}
Authorization.authorizeJWTCompany = async function(req, res, nex){
    try{
        var auth = req.headers.authorization.split(" ")[1]
        var data = await jwt.decode(auth)
        if(data.company_id == null) res.status(403).send()
        req.body.userId = data.serial_id
        req.body.companyId = data.company_id
        nex()
    }catch(err){
        res.status(403).send()
    }
}

module.exports = Authorization