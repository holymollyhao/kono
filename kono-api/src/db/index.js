const mysql = require('mysql');
const dbconfig = require('../../config/dbconfig.js')

//local mysql db connection
const connection = mysql.createConnection(dbconfig);

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
