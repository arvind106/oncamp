const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userSchema = require("../models/userSchema");

function jwtverify(req,res,next){
    if(!req.headers.authorization){
        return res.error("Authorization header not found.",'')
    }
    else{
        auth = req.headers.authorization.split("Bearer ")
        if(auth.length<2){
            return res.error("Authorization token not found.",'')
        }else{
            token = auth[1];
            jwt.verify(token,config.JWT_SECRET, async (err,decoded)=>{
                if(err){
                    return res.error(err.message,'')
                }
                if(!decoded.id){
                    return res.error("Invalid token.",'')
                }
                userSchema.findOne({_id:decoded.id,status:"Active"},(err, user)=>{
                    if(err || !user) return res.error("User is not associate with this token.",'',config.UNAUTHORIZED_STATUS_CODE);
                    req.user = user;
                    next();
                })
            });
        }
    }
}

module.exports = jwtverify;
