const dbconfig = require("../dbconfig")
var model = {}

model.signUp = async function({emailId, password, companyId}){
    try{
        const response = await dbconfig.conn.query("INSERT INTO users (email_id, password, company_id) VALUES (?, ?, ?)", [emailId, password, companyId])
        return response[0].insertId
    }catch(err){
        return undefined
    }
}
model.getUserOfEmail = async function({emailId}){
    try{
        const [rows, fields] = await dbconfig.conn.query("SELECT serial_id, email_id, company_id, password FROM users WHERE email_id = ?", [emailId])
        return rows[0]
    }catch(err){
        return undefined
    }
}
model.getUserOfId = async function({serialId}){
    try{
        const [rows, fields] = await dbconfig.conn.query("SELECT serial_id, email_id, company_id FROM users WHERE serial_id = ?", [serialId])
        return rows[0]
    }catch(err){
        return undefined
    }
}

module.exports = model