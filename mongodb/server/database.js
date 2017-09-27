(function () {

    const MongoClient = require('mongodb').MongoClient,
        f = require('util').format,
        fs = require('fs');
    const q = require("q");

    // Connect validating the returned certificates from the server
    const getDB = function (callback) {
        MongoClient.connect("mongodb://localhost:27017/grocery_app?ssl=false", function (err, db) {
            if (err) {
                callback(err);
            } else {
                console.log('mongodb connected');
                callback(db);
            }
        });
    }

    module.exports = { getDB }

})();