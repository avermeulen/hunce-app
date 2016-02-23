var mysql = require("mysql");

module.exports = mysql.createConnection({
	user : "hunchAdmin",
	password : "Coder_Hunch123",
	database : "hunchDB",
	host : "localhost",
	port: 3306
});