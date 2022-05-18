var contestsModel = require("../models/contests.model")
var contestsRegistrationsModel = require("../models/contestregistrations.model")
var controller = {}

controller.getUpcomingContests = async function(req, res){
    var result = await contestsModel.getUpcomingContests()
    res.status(200).send(result)
}
controller.getOngoingContests = async function(req, res){
    var result = await contestsModel.getOngoingContests()
    res.status(200).send(result)
}
controller.getContestDetails = async function(req, res){
    var contestId = req.params.contestid
    var result = await contestsModel.getContestDetails({contestId})
    var parsedResult = result.map((value) => {
        return {
            serial_id: value.serial_id, 
            company_name: value.company_name, 
            name: value.serial_id, 
            start_time: (() => {
                var date = new Date()
                date.setTime(value.start_time)
                return date.toISOString()
            })(), 
            end_time: (() => {
                var date = new Date()
                date.setTime(value.end_time)
                return date.toISOString()
            })(), 
            required_time: `${parseInt(value.required_time / 86400)} days ${parseInt(value.required_time % 86400) / 3600} hours`
        }
    })
    if(parsedResult.length == 0) return res.status(400).send()
    res.status(200).send(parsedResult[0])
}
controller.registerToContest = async function(req, res){
    var contestId = req.params.contestid
    var userId = req.params.userid
    var result = await contestsModel.getContestDetails({contestId})
    if(result.length == 0) return res.status(400).send()
    var contestData = result[0]
    var currTime = new Date().getTime() / 1000
    if(contestData.end_time < currTime + contestData.required_time) res.status(402).send()
    var result = await contestsRegistrationsModel.registerToContest({contestId, userId, registeredTime: currTime})
    if(result == undefined) return res.status(400).send()
    res.status(200).send()
}
controller.addContest = async function(req, res){
    var name = req.body.name
    var companyId = req.body.companyId
    var startTime = new Date().getTime() / 1000 + req.body.start_time
    var endTime = new Date().getTime() / 1000 + req.body.end_time
    var requiredTime = req.body.required_time
    var result = await contestsModel.addContest({companyId, name, startTime, endTime, requiredTime})
    if(result == undefined) return res.status(400).send()
    return res.status(200).send()
}

module.exports = controller