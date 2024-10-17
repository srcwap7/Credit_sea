/*THIS FILE MAINTAINS THE ENDPOINTS FOR THE AUTHENTICATION PROTOCOLS*/

const authRoutes = require('express').Router();
const passport = require('passport');
const Token = require('../schema/token-model');
require("dotenv").config();


authRoutes.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}));



authRoutes.get("/googlesignin", passport.authenticate('google', { session: false }), (req,res,next) => {
    const user = req.user;
    if (user!=null){
        console.log("Authorization successfull");
        res.status(200).json(user.token);
    }
    else{
        console.log("Failed");
        res.status(401).send("Authorization Failed");
    }
});


module.exports=authRoutes