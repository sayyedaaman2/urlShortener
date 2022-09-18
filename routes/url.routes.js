const urlController = require('../controller/url.controller');
const {authJwt} = require('../middleware');
module.exports = (app)=>{

    app.post("/urlshortner/api/geturl",[authJwt.verifyToken],urlController.getUrl);
    app.get("/urlshortner/api/serach", urlController.serachUrl);
    app.get("/urlshortner/api/urls", [authJwt.verifyToken], urlController.getAllUlrs);
    app.delete("/urlshortner/api/urls", [authJwt.verifyToken], urlController.deleteUrl);

}