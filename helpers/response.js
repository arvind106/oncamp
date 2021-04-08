const config = require("../config/config");
const Logger = require('../services/logger_service')
const logger = new Logger('All_Issues')

module.exports={  
    error:function(res,msg,data,status){
        let resdata={
            type:"error",
            error:data,
            msg:msg,
        }
        status = status||config.SERVER_ERROR_STATUS_CODE;
        logger.error(msg);
        res.status(status).json(resdata);
    },
    success:function(res,msg,data=[]){
        let resdata={
            type:"success",
            msg:msg,
            data:data
        }
        res.status(200).json(resdata);
    },
    token:function(res,msg,token,data=[]){
        let resdata={
            type:"success",
            access_token:token,
            token_expiry:config.JWT_EXPIRY,
            msg:msg,
            data:data
        }
        res.status(200).json(resdata);
    }
}
