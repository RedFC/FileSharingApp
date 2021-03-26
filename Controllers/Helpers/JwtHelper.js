const jwt = require('jsonwebtoken');
// var read = require('read-file');
// let approot = require('app-root-path');

let publiceKEY = "9ccc4b4b-4439-4b07-9306-1b24b9694d10"
let publicRefKEY = "0a8b106e-8beb-11eb-8dcd-0242ac130003";

let client = require('./redis.service');

exports.signingAccesToken = (payload) => {
    console.log(payload);
    var i = "filesharing";
    var s = "filesharing@gmail.com";
    var signOptions = {
        expiresIn: '4000s',
        issuer: i,
        subject: s,
        
    };
    const token = jwt.sign({
        id: payload
    }, publiceKEY, signOptions);
    return token;
}

exports.signingRefreshToken = (payload) => {
    var i = "filesharing";
    var s = "filesharing@gmail.com";
    var signOptions = {
        expiresIn: '2592000s',
        issuer: i,
        subject: s,
        
    };
    const reftoken = jwt.sign({
        id: payload
    }, publicRefKEY, signOptions);
    client.set(String(payload), String(reftoken), 'EX', 365 * 24 * 60 * 60, (err, reply) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log(reply);
        }
    })
    return reftoken;
}

exports.verifyRefreshToken = (RefToken) => {

    if (!RefToken) return "Forbidden Access Denied. No Token Found";

    try {
        var i = "filesharing";
        var s = "filesharing@gmail.com";
        var verifyOptions = {
            issuer: i,
            subject: s,
            
        };
        const decoded = jwt.verify(RefToken, publicRefKEY, verifyOptions);
        return decoded
    } catch (error) {
        return "Invalid Token";
    }

}