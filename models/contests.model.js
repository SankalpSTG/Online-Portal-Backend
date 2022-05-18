const dbconfig = require("../dbconfig")
var model = {}

model.addContest = async function({companyId, name, startTime, endTime, requiredTime}){
    try{
        const response = await dbconfig.conn.query("INSERT INTO contests (company_id, name, start_time, end_time, required_time) VALUES (?, ?, ?, ?, ?)", [companyId, name, startTime, endTime, requiredTime])
        return response[0].insertId
    }catch(err){
        console.log(err)
        return undefined
    }
}
model.getUpcomingContests = async function(){
    try{
        var currTime = new Date().getTime() / 1000
        const [rows, fields] = await dbconfig.conn.query("SELECT cont.serial_id, (SELECT comp.company_name FROM companies comp WHERE comp.serial_id = cont.company_id) AS company_name, cont.name FROM contests cont WHERE cont.start_time > ?", [currTime])
        return rows
    }catch(err){
        console.log(err)
        return []
    }
}
model.getOngoingContests = async function(){
    try{
        var currTime = new Date().getTime() / 1000
        const [rows, fields] = await dbconfig.conn.query("SELECT cont.serial_id, (SELECT comp.company_name FROM companies comp WHERE comp.serial_id = cont.company_id) AS company_name, cont.name FROM contests cont WHERE cont.start_time <= ?", [currTime])
        return rows
    }catch(err){
        console.log(err)
        return []
    }
}
model.getContestDetails = async function({contestId}){
    try{
        const [rows, fields] = await dbconfig.conn.query("SELECT cont.serial_id, (SELECT comp.company_name FROM companies comp WHERE comp.serial_id = cont.company_id) AS company_name, cont.name, cont.start_time, cont.end_time, cont.required_time FROM contests cont WHERE cont.serial_id = ?", [contestId])
        return rows
    }catch(err){
        console.log(err)
        return []
    }
}

module.exports = model