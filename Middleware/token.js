const jwt = require('jsonwebtoken');
// const fs = require('fs');
let publicKey = "9ccc4b4b-4439-4b07-9306-1b24b9694d10"

module.exports = function (req,res,next) {

    const token = req.header("x-auth-token");
        if(!token) return res.status(401).send("Forbidden Access Denied. No Token Found");
    try {
        var i = "filesharing";
        var s = "filesharing@gmail.com";
        var verifyOptions = {
            issuer: i,
            subject: s,
        };
        const decoded = jwt.verify(token, publicKey,verifyOptions,(err,result) =>
        {
            if(err){
                console.log("!!! Failed");
                return res.send({message : "Token has been expired"})
            }else{
                console.log("!!! Passed");
                req.user = result;
                next();
            }
        });
        
    } catch (error) {
        res.status(400).send("Invalid Token");
    }

}