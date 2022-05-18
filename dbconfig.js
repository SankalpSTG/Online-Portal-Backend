const mysql = require('mysql2')


var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "online_portal"
}).promise()

module.exports = {conn}