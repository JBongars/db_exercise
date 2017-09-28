#Sequelize


#MongoDB

##Config
1. Open cmd.exe directed at the root folder and run the following command `mongod --dbpath "./database/mongodb/"`
2. Open second window of cmd.exe directed at the root folder and run the following command `mongoimport --db grocery_app --jsonArray --collection grocery_list --file ~/database/data.json` this will import data into database.
3. Navigate to `mongodb/` and run the following two commands `npm install`, `bower install`; this will install dependencies.
4. To view the application, run the following command `nodemon` and run `chrome.exe http://localhost:3000/`