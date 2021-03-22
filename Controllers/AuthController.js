const users = require('../server/models').users;
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {signingAccesToken,signingRefreshToken,verifyRefreshToken} = require('./Helpers/JwtHelper');
const Joi = require('joi')

class AuthController {


    createUser = async (req,res) => {

        try {
            
            let schema = _.pick(req.body,['userName','email','password']);
            schema.emailVerified = 0;
            schema.emailVerified = 1;
            schema.isDeleted = 0;

            let Users = await users.findOne({
                where: [
                  {
                    email: req.body.email,
                  },
                  {
                    emailVerified: true,
                  },
                ],
              });

            if(Users){
                res.status(200).send({ message: "User Already Exist!." });
            }
            
            const salt = await bcrypt.genSalt(10);
            schema.password = await bcrypt.hash(schema.password, salt);

            let createUser = await users.create(schema);
            if(createUser){
                res.send({message : "User Created Succesfully",data : createUser});
            }

        } catch (error) {
            res.status(500).send({message : "Bad Request",error : error.message})
        }

    }

    refreshToken = async (req,res) => {

        try {
            let {token} = req.body;
            if(!token) return res.send("Token Not Found");
            let get = await verifyRefreshToken(token);
            client.GET(get.id,(err,reply) =>{
                if(err){
                    winston.error(err)
                    res.send({message : err})
                }else{
                    if(token == reply){
                        let Token = signingAccesToken(get.id);
                        let refToken = signingRefreshToken(get.id);
                        res.send({accessToken : Token,refreshToken:refToken})
                    }else{
                        return res.send("Invalid Token Forbiden Access");
                    }
                }
            })
            

        } catch (error) {
            res.send({message : error.message})
        }
        
    }

    Auth = async (req,res) => {

        const {error} = validation(req.body);
        if(error) return res.status(400).send(error.details[0].message);
    
        let user = await users.findOne({email : req.body.email,where : {emailVerified : true}});
        if(!user) return res.status(400).send({message:"Invalid Email Or Password"});
    
        let password = await bcrypt.compare(req.body.password,user.password);
        if(!password) return res.status(400).send({message:"Invalid Email Or Password"});
    
        let Token = signingAccesToken(user._id);
        let refToken = signingRefreshToken(user._id);

        res.header("x-auth-token",Token).send({message : "user Logged In Successfully",data : user,accessToken : Token,refreshToken : refToken});
    }

}

function validation(request) {

    const schema = {
        email : Joi.string().required().email(),
        password : Joi.string().required()
    }

    return Joi.validate(request,schema);
}


module.exports = AuthController;