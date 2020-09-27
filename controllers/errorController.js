const AppError = require("../utils/appError");

const handleCastErrorDB=err=>{
    const message=`Invalid ${err.path}: ${err.value}.`
    return new AppError(message,400);
}
const handleDuplicateFieldsDB=err=>{
    const value=err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message=`Duplicate field value: ${value}.please use another value`;
    return new AppError(message,400);

}
const handleValidationError=err=>{
    const errors=Object.values(err.errors).map(el=>el.message);
    const message=`Invalid input data.${errors.join('. ')}`;
    return new AppError(message,400);
}
const handleJWTError=err=>new AppError('Invalid Token .Please Login again',401);

const sendErrorForDev=(res,err)=>{
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    });
}
const TokenExpiredError=err=>new AppError('Your Token has expired !please log in again', 401);
const senderrorForProd=(res,err)=>{
    //Operational errror trusted error:send message to the client
    if(isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        }); 
    }
    //Programming or other unknown error;dont leak error details
    else{ 
        //1)Log eror
        console.error('error',err);   
        //2)send generic error         
        res.status(500).json({
            status:'error',
            message:'Something went very wrong'
        })
    }
    
}

module.exports=((err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error';
    if(process.env.NODE_ENV ==='development'){
        sendErrorForDev(res,err);
    }else if(process.env.NODE_ENV ==='production'){
        let error={...err};
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error=handleDuplicateFieldsDB(error);
        if(error.name === "ValidatorError") error=handleValidationError(error);
        if(error.name === "JsonWebTokenError") error=handleJWTError(error);
        if(error.name === "TokenExpiredError") error=TokenExpiredError(error);


       senderrorForProd(res,error);
    }
    next(err);
   
});