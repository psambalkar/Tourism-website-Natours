const crypto=require('crypto');

const {promisify}=require('util');
const jwt = require('jsonwebtoken');

const User=require('../models/usermodel');
const catchAsync = require('./catchAsync');
const AppError=require('../utils/appError');
const sendEmail=require('../utils/email');
const signToken=id=>{
      return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}
const createSendToken=(user,statusCode,res)=>{
    const token=signToken(user._id);
    const cookieOptions={
        expires:new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000  
        ),
        httpOnly:true
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt',token,cookieOptions);
    //remove password from the output
    user.password=undefined;
    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user
        }
    });
}
exports.signup=catchAsync(async(req,res,next)=>{
    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        role:req.body.role
    });
    createSendToken(newUser,201,res);
});
exports.login=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;
    // 1) Check if email and password exist
    if(!email || !password){
      return next(new AppError('Please provide email and password!',400))
    }
    //2) Check if the user exist and password is correct
    const user =await User.findOne({email}).select('+password');
    if(!user|| !(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password ',401));
    }
    //3) If everything is ok send token to client
    createSendToken(user,200,res);
    // const token= signToken(user._id);
    // res.status(200).json({
    //     status: 'success',
    //     token
    // })
});
exports.logout=(req,res)=>{
    res.cookie('jwt','loggedout',{
        expires:new Date(Date.now() + 10*1000),
        httpOnly:true
    });
    res.status(200).json({status:'success'})
};
exports.protect=catchAsync(async(req,res,next)=>{
    //1) getting the token and check if it exist
     let token;
     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
         token=req.headers.authorization.split(' ')[1];
     }else if(req.cookies.jwt){
         token=req.cookies.jwt;
     }
    //  console.log(token);
     if(!token){
         return next(new AppError('You are not logged in!please login to get access',401));
     }
    //2)verification token to check if no one modifies the payload that is the id
    const decoded =await promisify(jwt.verify)(token,process.env.JWT_SECRET)          ///will return a promise
    // console.log(decoded);
    //3)check if user still exists
    const freshUser=await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError('The user belonging to this token does no longer exist',401));
    }
    //4)Check if user change password after the JWT was issued
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recenlty changed password! Please login again',401))
    };

    //grant access to protected route
    req.user=freshUser;
    next();
});
exports.restrictTo=(...roles)=>{
    return (req,res,next)=>{
        //roles is an array ['admin' 'lead-guide']
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have access to perform this operation',403))
        }
        next();
    }
}
exports.forgotPassword=catchAsync( async(req,res,next)=>{
    //1)Get user based on posted email
     const user=await User.findOne({email:req.body.email})
     if(!user){
         return next(new AppError('There is no user with this email address',404))
     }

    //2)Generate the random reset token
     const resetToken=user.createPasswordResetToken();
     await user.save({validateBeforeSave:false});

    //3)Send it to users email
    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message=`Forget your password?submit patch request with your new password and passwordConfirm to :${resetURL}.`
    try{
        await sendEmail({
            email:user.email,
            subject:'your password reset token (valid for 10min)',
            message
        });
        res.status(200).json({
            status:'success',
            message:'Token sent to email'
        })
    }catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
     await user.save({validateBeforeSave:false});
     return next(new AppError('there was an eror sending mail try again later',500));

    }
    
});
exports.resetPassword=catchAsync( async(req,res,next)=>{
    //1)Get the user based on the token
    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user=await User.findOne({passwordResetToken:hashedToken,
    passwordResetExpires:  { $gt: Date.now()}});
    

    //2)If the token has not expired and there is user ,set the new password
    if(!user){
        return next(new AppError('Token is invalid or has expired',400));
    } 
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();


    //3)update changedPaswwordAt Property for the user
    
    //4)Log the user in,send JWT

    const token= signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
    next();
});
exports.updatePassword=catchAsync(async(req,res,next)=>{
    //1)Get the user from the collection
    const user=await User.findById(req.user.id).select('+password');
    //2)check if the password is correct or not
    if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
        return next(new AppError('Incorrect password ',401));
    }
    //3)If so update password
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();  //this method will not work if we use findbyidandupdate always use findbyid in case of passwrods

    //4)log in user in and send jwt.
    const token= signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
    next();


})
exports.isLoggedIn=catchAsync(async(req,res,next)=>{
    //1) getting the token and check if it exist
      if(req.cookies.jwt){
         
     
    //  console.log(token);
     
    //2)verification token to check if no one modifies the payload that is the id
    const decoded =await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)          ///will return a promise
    // console.log(decoded);
    //3)check if user still exists
    const CurrentUser=await User.findById(decoded.id);
    if(!CurrentUser){
        return next();
    }
    //4)Check if user change password after the JWT was issued
    if(CurrentUser.changedPasswordAfter(decoded.iat)){
        return next()
    };
    //There is a loggedin user
    res.locals.user = CurrentUser   //we put that user on res.locals to give access to pug tempalte
    return next();
}
next();
});