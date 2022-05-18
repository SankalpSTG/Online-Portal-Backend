require("dotenv").config()
const usersModel = require("../models/users.model")
const companiesModel = require("../models/companies.model")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

var controller = {}

controller.signUp = async function(req, res){
    var isCompany = req.params.role == "company"
    var emailId = req.body.email_id
    var password = req.body.password
    var companyName = req.body.company_name 
    if(!validator.default.isEmail(emailId)) return res.status(400).send()
    if(password.length < 8) return res.status(400).send()
    var passwordHash = await bcrypt.hash(password, 8)
    var companyId = null
    if(isCompany){
        companyId = await companiesModel.addCompany({companyName})
    }
    var insertId = await usersModel.signUp({emailId, password: passwordHash, companyId})
    if(insertId == undefined) return res.status(401).send()
    var data = await usersModel.getUserOfId({serialId: insertId})
    var accessToken = jwt.sign(data, process.env.ACCESS_TOKEN, {expiresIn: "6h"})
    var refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN, {expiresIn: "30d"})
    res.status(200).send({accessToken, refreshToken})
}
controller.login = async function(req, res){
    var isCompany = req.params.role == "company"
    var emailId = req.body.email_id
    var password = req.body.password
    if(!validator.default.isEmail(emailId)) return res.status(400).send()
    if(password.length < 8) return res.status(400).send()
    var data = await usersModel.getUserOfEmail({emailId})
    if(data == undefined) return res.status(400).send()
    var passwordMatch = await bcrypt.compare(password, data.password)
    if(!passwordMatch) return res.status(400).send()
    if(isCompany && data.company_id == null) return res.status(403).send()
    if(!isCompany && data.company_id != null) return res.status(403).send()
    var accessToken = jwt.sign({serial_id: data.serial_id, email_id: data.email_id, company_id: data.company_id}, process.env.ACCESS_TOKEN, {expiresIn: "6h"})
    var refreshToken = jwt.sign({serial_id: data.serial_id, email_id: data.email_id, company_id: data.company_id}, process.env.REFRESH_TOKEN, {expiresIn: "30d"})
    res.status(200).send({accessToken, refreshToken})
}

module.exports = controller