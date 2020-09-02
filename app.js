const express=require('express');
const morgan=require('morgan');
const app=express();
const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');

//read file sync
app.use(express.json())//this is the middleware which is used to add data to req obj.
//midlewares
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));
app.use((req,res,next)=>{
    console.log('Hello from the middleware');
    next();
});
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
});


////ROUTES
app.use('/api/v1/tours',tourRouter);   ///middleware for tour router
app.use('/api/v1/users',userRouter);    //middleware for user router

/////Start Server
module.exports=app;