const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const serverConfig = require('./config/server.config');
const db = require('./model');
const User = db.user;
const Url = db.url;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function init(){
    let userObjs = [
        {
            id : 1,
            username : "user01",
            email : "user01@gmail.com",
            password : bcrypt.hashSync("user@1234", 8)
        },
        {
            id : 2,
            username : "user02",
            email : "user02@gmail.com",
            password : bcrypt.hashSync("user@1234", 8)
        }
    ];

    const users = User.bulkCreate(userObjs).then((data)=>{
        console.log(`_____ Users data initialized successfully _____`);
    }).catch((err)=>{
        console.log(`Error while initializing the user data : ${err}`);
    })

}

db.sequelize.sync({force : false}).then(()=>{
    console.log(`Table drop and receated successfully`);
    init();
})

require('./routes/auth.routes')(app);
require('./routes/url.routes')(app);
app.listen(serverConfig.PORT, ()=>{
    console.log(`Server is Running on port ${serverConfig.PORT}`);
})