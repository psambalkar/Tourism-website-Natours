const express = require('express')
const morgan = require('morgan');
const rateLimit=require('express-rate-limit');
const app = express();
const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


//read file sync
app.use(express.json({limit: '10kb'}))//this is the middleware which is used to add data to req obj req.body.
//midlewares


//data santization agaisnt nosql quer injection and also 

//data sanitization agaist xss
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
const limiter=rateLimit({
    max:100,
    windowMs:60 * 60 * 1000,
    message:'to many request from this ip,please try again in an hour'
});
app.use('/api',limiter);
app.use(express.static(`${__dirname}/public`));
app.use((req,res,next)=>{
    console.log('Hello from the middleware');
    next();
});
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    console.log(req.headers);
    next();
});




////ROUTES
app.use('/api/v1/tours',tourRouter);   ///middleware for tour router
app.use('/api/v1/users',userRouter);    //middleware for user router

//handlingroute error
app.all('*',(req,res,next)=>{        //global error handling mechanism
    // res.status(404).json({
    //     status:'fail',
    //     message:`Can't finf ${req.originalUrl} on this server`
    // });
    // const err=new Error(`Can't finf ${req.originalUrl} on this server`);
    // err.status='fail';
    // err.statusCode=404;
    next(new AppError(`Can't find ${req.originalUrl} on this server`,400));
});
//globalerror
app.use(globalErrorHandler);
/////Start Server
module.exports=app;