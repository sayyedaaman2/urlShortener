const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config.json');

const env = 'development';
const dbSettings = dbConfig[env];

const sequelize = new Sequelize(
    dbSettings.database,
    dbSettings.username,
    dbSettings.password,
    dbSettings.dialectInformation,
    dbSettings.pool
)

sequelize.authenticate().then(()=>{
    console.log("Connection established successfully.");
}).catch((err)=>{
    console.error("Unable to connect to database : ", err);
});

const db = { Sequelize, sequelize };
db.user = require('./user.model')(sequelize, Sequelize);
db.url = require('./url.model')(sequelize, Sequelize);

//One User can have multiple urls : One to Many Relationship
db.user.hasMany(db.url);

module.exports = db;