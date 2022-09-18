const {Op} = require("sequelize")
const db = require('../model')
const User = db.user;
const Url = db.url;



function getHash() {   
    var text = '';    
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < 5; i++)        
    text += possible.charAt(Math.floor(Math.random() * possible.length));    
    return text;
}
async function uniqueUrl(){
    let shortenedUrl;
    while(true){
        shortenedUrl = getHash();
        let result = await Url.findOne({
            where : {shortenedUrl : shortenedUrl }
        });
        if(result == null){
            break
        }
    }
    return shortenedUrl;

}



exports.getUrl = async (req, res, next)=>{
    try{
        let urlObj = {
            url  : req.query.url,
            shortenedUrl : await uniqueUrl(),
            UserId : req.userId
        }
        const url = await Url.findAll({
            where : {
                [Op.and] : {url : req.query.url, userId : req.userId}
            }
        })
        console.log('url',url);
        if(url.length>0 && url){
            res.status(400).send({
                message : "shortUrl Already Exists"
            });
            return;
        }

        let shortenedUrl = await Url.create(urlObj);

        res.status(201).send({
            message : "Successfully shortenedUrl created",
            shortenedUrl : `http://localhost:7000/urlshortner/api/serach?shortenedUrl=${shortenedUrl.shortenedUrl}`
        })

    }catch(err){
        console.log(err);
        res.status(500).send({
            message : "Some Internal Server Error"
        })
    }
}

exports.serachUrl = async (req, res)=>{
    try{
        console.log("shortenedUrl", req.query.shortenedUrl);
        let url = await Url.findOne({
            where : {shortenedUrl : req.query.shortenedUrl}
        });
        if(url == null){
            res.status(404).send({
                message : "there is no longer a valid URL"
            })
            return;
        };
        console.log(url.url);
        res.redirect(url.url);

    }catch(err){
        console.log(err);
        res.status(500).send({
            message : "Some Internal Server Error"
        })
    }
}

exports.getAllUlrs = async (req, res) =>{
    try{
        let urls = await Url.findAll({
            where : {UserId : req.userId}
        });
        res.status(200).send({
            message : "Successfully retrieved all urls",
            total : urls.length,
            urls : urls
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            message : "Some Internal Server Error"
        })
    }
}

exports.deleteUrl = async (req, res) =>{
    try{
        let url = await Url.destroy({
            where : {
                [Op.and] : {UserId : req.userId , shortenedUrl : req.query.shortenedUrl}
            }
        });
        res.status(200).send({
            message : `Successfully deleted Url : ${url}`
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            message : "Some Internal Server Error"
        })
    }
}