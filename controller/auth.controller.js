const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.config');

const db = require('../model');
const User = db.user;

// SignUp functionality

exports.signUp = (req,res)=>{
    
    const userObj = {
        username : req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 8)
    }

    User.create(userObj)
    .then((user)=>{
        console.log(`user created successfully : ${user}`);
        const response = {
            id : user.id,
            username : user.username,
            email : user.email,
            createAt : user.createAt,
            updateAt : user.updateAt
        }
        res.status(201).send({
            message : "Successfully created User",
            user : response
        })
    })
    
}

exports.signIn = (req, res)=>{
    User.findOne({
        where : {
            username : req.body.username
        }
    }).then(user=>{
        if(!user){
            res.status(404).send({
                message : "User not found"
            })
            return;
        }
        var isValidPassword = bcrypt.compareSync(req.body.password, user.password);

        if(!isValidPassword){
            res.status(404).send({
                message : "Invalid Password"
            })
            return;
        }

        var token = jwt.sign({ id : user.id}, authConfig.secret, {
            expiresIn : 600
        })

        res.status(200).send({
            id : user.id,
            username : user.username,
            email : user.email,
            accessToken : token
        })
    }).catch(err =>{
        res.status(500).send({message : err.message});
    })
}
