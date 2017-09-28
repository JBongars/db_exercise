#Sequelize

##Config

#MongoDB

##Config
1. Ensure that mongoDB community server is install on you computer (link: https://www.mongodb.com/download-center#community)
1. Open cmd.exe directed at the root folder and run the following command initiate database
    `mongod --dbpath "./database/mongodb/"`
2. Open second window of cmd.exe directed at the root folder and run the following command to import data into database.
    `mongoimport --db grocery_app --jsonArray --collection grocery_list --file ~/database/data.json` 
3. Navigate to `mongodb/` and run the following two commands `npm install`, `bower install`; this will install dependencies.
4. To view the application, run the following commands `nodemon` and navigate to `http://localhost:3000/`