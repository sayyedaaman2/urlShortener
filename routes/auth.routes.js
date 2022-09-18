const authController = require('../controller/auth.controller')
const {verifySignUp} = require('../middleware')
module.exports = (app)=>{

    app.post("/urlshortner/api/v1/auth/signup",[verifySignUp.validateReqBodySignUp], authController.signUp);

    app.post("/urlshortner/api/v1/auth/signin",[verifySignUp.validateReqBodySignIn], authController.signIn);

}