require("dotenv").config()
const express = require("express")
const authController = require("./controllers/auth.controller")
const contestController = require("./controllers/contest.controller")
const bodyParser = require("body-parser")
const auth = require("./misc/authorization")
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(bodyParser.raw())

app.post("/signup/:role", authController.signUp)
app.post("/login/:role", authController.login)
app.get("/contests/upcoming", contestController.getUpcomingContests)
app.get("/contests/ongoing", contestController.getOngoingContests)
app.get("/contest/:contestid", contestController.getContestDetails)
app.post("/contest/:contestid/register/:userid", auth.authorizeJWTUser, contestController.registerToContest)
app.post("/contest/add", auth.authorizeJWTCompany, contestController.addContest)

app.listen(4000, () => {
    console.log("Server Started")
})