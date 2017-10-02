module.exports = function (app, conn) {

    var grocery_list = conn.collection('grocery_list');

    app.get("/api/products", function (req, res) {
        //console.log("search Groceries");
        var whereCondition = "";
        var page = parseInt(req.query.page) || 1;
        var items = parseInt(req.query.items) || 10;
        var offset = (page - 1) * items;
        var limit = items;
        var sortBy = req.query.sortBy == 'ASC' ? 1 : -1;
        var order = 'name ' + sortBy;
        var where = {}
        var query = (req.query.keyword).replace(new RegExp(' ', 'g'), '*');
        var searchType = req.query.searchType || ['Brand', 'Name'];

        console.log(query);

        //console.log("keyword: ", req.query.keyword);
        //console.log("!!!searchType: ", req.query.searchType);

        //if (req.query.keyword) var where = null;
        if (req.query.keyword == '' || req.query.searchType == '') var where = null;
        else {
            var or = {$or : []};
            if (searchType.includes('Brand')) or.$or.push({"brand" : new RegExp(query, 'i')});
            if (searchType.includes('Name')) or.$or.push({"name" : new RegExp(query, 'i')});
        }

        /*
            "SELECT * FROM grocery_list WHERE brand like '%"
            + brand + "%' OR name like '%"
            + name + "%' " + " ORDER BY " + order + " LIMIT " + limit
            + ' OFFSET ' + offset;
        */ 
        // db.getCollection('grocery_list').find( {$or : [{"name" : /Sally/}, {"brand" : /Sally/}]})       

        grocery_list.find(or)
            .limit(limit)
            .sort({ order: sortBy })
            .skip(offset)
            .toArray(function (err, result) {
                //console.log(result ? result : err);
                if (err) res.status(400).json(err);
                else if (result) res.status(200).json(result);
                else res.status(400).send("no records found...");
            });
    });

    app.get("/api/products/sum", function (req, res) {

        var query = (req.query.keyword).replace(new RegExp(' ', 'g'), '*');
        var searchType = req.query.searchType || ['Brand', 'Name'];
        //console.log("sum of all Groceries");
        //console.log("keyword: ", req.query.keyword);
        //console.log("!!!searchType: ", req.query.searchType);

        //if (req.query.keyword) var where = null;
        if (req.query.keyword == '' || req.query.searchType == '') var where = null;
        else {
            var or = {$or : []};
            if (searchType.includes('Brand')) or.$or.push({"brand" : new RegExp(query, 'i')});
            if (searchType.includes('Name')) or.$or.push({"name" : new RegExp(query, 'i')});
        }

        
        grocery_list.find(or).count()
            .then(function (result, err) {
                console.log(result ? result : err);
                if (err) res.status(400).json(err);
                else if (result) res.status(200).send(result.toString());
                else res.status(400).send("no records found...");
            });

        
    });

    app.get("/api/products/exist/:upc12", function (req, res) {
        console.log(" is exist Grocery");
        console.log("upc12: ", req.params.upc12)

        grocery_list.findOne({ upc12: parseInt(req.params.upc12) })
            .then(function (err, result) {
                //console.log(result ? result : err);
                if (err) res.status(400).send(err);
                else if (result) res.status(200).json(result);
                else res.status(400).send("no records found...");
            });
    });

    app.get("/api/products/:productId", function (req, res) {
        console.log(" is exist Grocery");
        console.log("id: ", req.params.productId)

        grocery_list.findOne({ 'id': parseInt(req.params.productId) })
            .then(function (result, err) {
                //console.log("error: ", err);
                //console.log("result: ", res);
                //console.log(result ? result : err);
                if (err) res.status(400).send(err);
                else if (result) res.status(200).json(result);
                else res.status(400).send("no records found...");
            });
    });

    app.put("/api/products/:productId", function (req, res) {
        //console.log(" update Grocery  ");

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
            .then(function (result, err) {
                //console.log(result ? result : err);
                if (err) res.status(400).send(err);
                else if (result) res.status(200).json(result);
                else res.status(400).send("no records found...");
            });
    });

    app.post("/api/products/", function (req, res) {
        //console.log(" add Grocery ");

        grocery_list.insertOne({
            name: req.body.name,
            brand: req.body.brand,
            upc12: parseInt(req.body.upc12)
        })
            .then(function (result, err) {
                //console.log(result ? result : err);
                if (err) res.status(400).send(err);
                else if (result) res.status(200).json(result);
                else res.status(400).send("no records found...");
            });
    });

    app.delete("/api/products/:productId", function (req, res) {
        //console.log(" delete Grocery ");
        //console.log(req.params.productId);

        db.collection('inventory').deleteOne({
            id: req.params.productId
        })
            .then(function (result, err) {
                //console.log(result ? result : err);
                if (err) res.status(400).send(err);
                else if (result) res.status(200).json(result);
                else res.status(400).send("no records found...");
            });
    });
}