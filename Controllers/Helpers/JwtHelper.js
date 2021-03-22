const jwt = require('jsonwebtoken');
var read = require('read-file');
let approot = require('app-root-path');

let privateKEY = read.sync(approot+'/config/cert/myKey.pem', 'utf8');
let privateRefKEY = read.sync(approot+'/config/cert/myrefKey.pem', 'utf8');
let publicRefKEY = read.sync(approot+'/config/cert/myrefKey.pub', 'utf8');

let client = require('./redis.service');


exports.signingAccesToken = (payload) => {
    var i = "ExpenseTrack";
    var s = "expensetrack@gmail.com";
    var signOptions = {
        expiresIn: '60s',
        issuer: i,
        subject: s,
        algorithm: "RS256",
    };
    const token = jwt.sign({
        id: payload
    }, privateKEY, signOptions);
    return token;
}

exports.signingRefreshToken = (payload) => {
    var i = "ExpenseTrack";
    var s = "expensetrack@gmail.com";
    var signOptions = {
        expiresIn: '2592000s',
        issuer: i,
        subject: s,
        algorithm: "RS256",
    };
    const reftoken = jwt.sign({
        id: payload
    }, privateRefKEY, signOptions);
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
        var i = "ExpenseTrack";
        var s = "expensetrack@gmail.com";
        var verifyOptions = {
            issuer: i,
            subject: s,
            algorithm: "RS256",
        };
        const decoded = jwt.verify(RefToken, publicRefKEY, verifyOptions);
        return decoded
    } catch (error) {
        return "Invalid Token";
    }

}