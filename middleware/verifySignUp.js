const db = require('../model')
const User = db.user;

const validateReqBodySignUp = (req, res, next)=>{

    if(!req.body.username){
        res.status(400).send({
            message : 'Username is not provided !'
        });
        return;
    }

    User.findOne({
        where : {
            username : req.body.username
        }
    }).then(user=>{
        if(user != null){
            res.status(400).send({
                message : 'Username is already taken !'
            });
            return;
        }
        if(!req.body.email){
            res.status(400).send({
                message : 'email is not provided !'
            });
            return;
        }
        User.findOne({
            where : { email : req.body.email}
        }).then(data=>{
            console.log("data", data);
            if(data != null){
                res.status(400).send({
                    message : 'email is already taken !'
                });
                return;
            }
            if(!req.body.password){
                res.status(400).send({
                    message : 'password is not provided !'
                });
                return;
            }
            next();
        })
        
    })
    
}

const validateReqBodySignIn = (req, res, next) => {

    if(!req.body.username){
        res.status(400).send({
            message : 'Username is not provided !'
        });
        return;
    }
    User.findOne({
        where : {
            username : req.body.username
        }
    }).then(user=>{
        if(user == null){
            res.status(400).send({
                message : 'Username is not exists !'
            });
            return;
        }
        if(!req.body.password){
            res.status(400).send({
                message : 'password is not provided !'
            });
            return;
        }
        next();
    })
}


const validateReqBodies = {
    validateReqBodySignUp,
    validateReqBodySignIn
}

module.exports = validateReqBodies;