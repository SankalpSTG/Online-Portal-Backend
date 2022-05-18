const dbconfig = require("../dbconfig")
var model = {}

model.addCompany = async function({companyName}){
    try{
        const response = await dbconfig.conn.query("INSERT INTO companies (company_name) VALUES (?)", [companyName])
        return response[0].insertId
    }catch(err){
        return undefined
    }
}

module.exports = model