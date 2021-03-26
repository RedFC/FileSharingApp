const Winston = require('winston');
module.exports = function (err,req,res,next) {
    Winston.error(err.message,err);
    res.status(400).send("Something Went Wrong");
}