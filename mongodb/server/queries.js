module.exports = function (app, conn) {

    var grocery_list = conn.collection('grocery_list');

    app.get("/api/products", function (req, res) {
        console.log("search Groceries");
        var whereCondition = "";
        var page = parseInt(req.query.page) || 1;
        var items = parseInt(req.query.items) || 10;
        var offset = (page - 1) * items;
        var limit = items;
        var sortBy = req.query.sortBy == 'ASC' ? 1 : -1;
        var order = 'name ' + sortBy;

        console.log(true && req.query.keyword);
        if (req.query.keyword) var where = null;
        else if (req.query.searchType) {
            var brand = req.query.searchType == 'Brand' ? "/" + req.query.keyword + "/" : "/";
            var name = req.query.searchType == 'Name' ? "/" + req.query.keyword + "/" : "/";
            var where = {
                $or: [
                    { brand: brand },
                    { name: name }
                ]
            }
        }

        /*
            "SELECT * FROM grocery_list WHERE brand like '%"
            + brand + "%' OR name like '%"
            + name + "%' " + " ORDER BY " + order + " LIMIT " + limit
            + ' OFFSET ' + offset;
        */

        grocery_list.find({ where })
            .limit(limit)
            .sort({ order: sortBy })
            .skip(offset)
            .toArray(function (err, result) {
                console.log(result ? result : err);
                if (err) res.status(400).json(err);
                res.status(200).json(result);
            });
    });

    app.get("/api/products/sum", function (req, res) {
        console.log("sum of all Groceries");

        grocery_list.count()
            .then(function (err, result) {
                console.log(result ? result : err);
                if (err) res.status(400).send(err);
                res.status(200).send(result);
            });
    });

    app.get("/api/products/exist/:upc12", function (req, res) {
        console.log(" is exist Grocery");

        grocery_list.findOne({ upc12: req.params.upc12 })
            .then(function (err, result) {
                console.log(result ? result : err);
                if (err) res.status(400).send(err);
                res.status(200).json(result);
            });
    });

    app.get("/api/products/:productId", function (req, res) {
        console.log(" get Grocery  ");

        grocery_list.findOne({ id: req.params.productId })
            .then(function (err, result) {
                console.log(result ? result : err);
                if (err) res.status(400).send(err);
                res.status(200).json(result);
            });
    });

    app.put("/api/products/:productId", function (req, res) {
        console.log(" update Grocery  ");

        grocery_list.updateOne(
            { id: req.params.productId },
            {
                $set: {
                    brand: req.body.brand,
                    name: req.body.name,
                    upc12: req.body.upc12
                }
                , $currentDate: { lastModified: true }
            })
            .then(function (err, result) {
                console.log(result ? result : err);
                if (err) res.status(400).send(err);
                res.status(200).json(result);
            });
    });

    app.post("/api/products/", function (req, res) {
        console.log(" add Grocery ");

        grocery_list.insertOne({
            name: req.body.name,
            brand: req.body.brand,
            upc12: parseInt(req.body.upc12)
        })
            .then(function (err, result) {
                console.log(result ? result : err);
                if (err) res.status(400).send(err);
                res.status(200).json(result);
            });
    });

    app.delete("/api/products/:productId", function (req, res) {
        console.log(" delete Grocery ");
        console.log(req.params.productId);

        db.collection('inventory').deleteOne({
            id: req.params.productId
        })
            .then(function (err, result) {
                console.log(result ? result : err);
                if (err) res.status(400).send(err);
                res.status(200).json(result);
            });
    });
}