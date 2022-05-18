const dbconfig = require("../dbconfig")
var model = {}

model.registerToContest = async function({contestId, userId, registeredTime}){
    try{
        const response = await dbconfig.conn.query("INSERT INTO contest_registrations (contest_id, user_id, registered_time) VALUES (?, ?, ?)", [contestId, userId, registeredTime])
        return response[0].insertId
    }catch(err){
        console.log(err)
        return undefined
    }
}

module.exports = model