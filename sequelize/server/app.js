//Load libraries
const path = require("path");
//const q = require("q");
const express = require("express");
//const mysql2 = require("mysql2");
var Sequelize = require("sequelize");
var bodyParser = require("body-parser");

//Create an instance of express
const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

const mysql_USERNAME = 'superadmin';
const mysql_PASSWORD = 'password';

var sequelize = new Sequelize(
	'grocery_list',
	mysql_USERNAME,
	mysql_PASSWORD,
	{
		host: 'localhost',         // default port    : 3306
		logging: console.log,
		dialect: 'mysql',
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		}
	}
);

var Groceries = require('./models/grocery_list')(sequelize, Sequelize);

const handleError = function (err, resp) {
	resp.status(500);
	resp.type("application/json");
	resp.json(err);
}

app.get("/api/products", function (req, resp) {
	console.log("search Groceries");
	var whereCondition = "";
	var page = parseInt(req.query.page) || 1;
	var items = parseInt(req.query.items) || 10;
	var offset = (page - 1) * items;
	var limit = items;
	var sortBy = req.query.sortBy || 'ASC';
	var order = 'name ' + sortBy;

	if (req.query.keyword == '') var where = {};
	else if (req.query.searchType) {
		or = [];
		if (req.query.searchType.includes('Brand')) or.push({ brand: { $like: "%" + req.query.keyword + "%" } });
		if (req.query.searchType.includes('Name')) or.push({ name: { $like: "%" + req.query.keyword + "%" } });
		var where = {
			$or: or
		}
	}

	console.log(where);

	/*
		"SELECT * FROM grocery_list WHERE brand like '%"
		+ brand + "%' OR name like '%"
		+ name + "%' " + " ORDER BY " + order + " LIMIT " + limit
		+ ' OFFSET ' + offset;
	*/

	Groceries
		// findAll asks sequelize to retrieve multiple records (all records if where clause not used, i.e., no filtering)
		.findAll({
			where: where
			// We add a limit since employees table is big
			, limit: limit
			, order: [['name', sortBy]]
			, offset: offset
		})
		.then(function (result) {
			resp.json(result);
		}).catch(function (error) {
			console.log(error);
		});

});

app.get("/api/products/sum", function (req, res) {
	console.log("sum of all Groceries");
	console.log("keyword: ", req.query.keyword);
	console.log("searchType: ", req.query.searchType);

	if (req.query.keyword == '') var where = null;
	else if (req.query.searchType) {
		or = [];
		if (req.query.searchType.includes('Brand')) or.push({ brand: { $like: "%" + req.query.keyword + "%" } });
		if (req.query.searchType.includes('Name')) or.push({ name: { $like: "%" + req.query.keyword + "%" } });
		var where = {
				$or: or
		}
	}

	console.log("where: ", JSON.stringify(where));

	Groceries.findAndCountAll({where: where})
		.then(function (result) {
			console.log(result.count);
			res.status(200).send(result.count.toString());
		}).catch(function (error) {
			//console.log(error);
			res.status(400).json(error);
		});
});

app.get("/api/products/exist/:upc12", function (req, res) {
	console.log(" is exist Grocery");

	Groceries
		// findAll asks sequelize to retrieve multiple records (all records if where clause not used, i.e., no filtering)
		.findAll({
			where: {
				brand: { upc12: parseInt(req.params.upc12) }
			}
			// We add a limit since employees table is big
			, attributes: [[sequelize.fn('COUNT', sequelize.col('id'))]]
		})
		.then(function (result) {
			console.log(result[0]);
			res.json(result.dataValues);
		}).catch(function (error) {
			console.log(error);
		});
});

app.get("/api/products/:productId", function (req, resp) {
	console.log(" get Grocery  ");
	console.log(req.params.productId)

	Groceries
		.findOne({
			where: { id: parseInt(req.params.productId) }
		})
		.then(function (result) {
			console.log(result[0]);
			resp.json(result.dataValues);
		}).catch(function (error) {
			console.log(error);
		});
});

app.put("/api/products/:productId", function (req, resp) {
	console.log(" update Grocery  ");
	console.log("id: ", parseInt(req.params.productId));

	Groceries
		.update(
		{
			upc12: parseInt(req.body.upc12),
			brand: req.body.brand,
			name: req.body.name
		},
		{
			where: { id: parseInt(req.params.productId) }
		}
		)
		.then(function (result) {
			console.log(result);
			resp.json(result.dataValues);
		}).catch(function (error) {
			console.log(error);
		});
});

app.post("/api/products/", function (req, resp) {
	console.log(" add Grocery ");

	Groceries.create({
		name: req.body.name,
		brand: req.body.brand,
		upc12: parseInt(req.body.upc12)
	})
		.then(function (result) {
			console.log(result);
			resp.json(result.dataValues);
		}).catch(function (error) {
			console.log(error);
		});

});

app.delete("/api/products/:productId", function (req, resp) {
	console.log(" delete Grocery ");
	console.log(req.params.productId);

	Groceries.destroy({
		where: {
			id: parseInt(req.params.productId)
		}
	})
		.then(function (result) {
			console.log(result);
			resp.json(result.dataValues);
		}).catch(function (error) {
			console.log(error);
		});

});

//Static routes
app.use(express.static(path.join(__dirname, "../client")));

//Configure the server
const port = process.env.APP_PORT || 3000;
app.listen(port, function () {
	console.info("Application started on port %d", port);
});
