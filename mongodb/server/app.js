//Load libraries
const path = require("path");
const express = require("express");
var bodyParser = require("body-parser");

//Create an instance of express
const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));


const handleError = function (err, resp) {
	resp.status(500);
	resp.type("application/json");
	resp.json(err);
}

//database
const db = require('./database');

//queries
db.getDB(function(conn) {
	require('./queries')(app, conn);
	//conn.close();
})

//Static routes
app.use(express.static(path.join(__dirname, "../client")));

//Configure the server
const port = process.env.APP_PORT || 3000;
app.listen(port, function () {
	console.info("Application started on port %d", port);
});
