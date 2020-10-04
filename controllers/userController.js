const User=require('../models/usermodel');
const catchAsync = require('./catchAsync');
const AppError=require('../utils/appError');
const factory=require('./handlerFactory');

const filterObj=(obj,...allowedFeilds)=>{
    const newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFeilds.includes(el)){
            newObj[el]=obj[el]
        }
    })
    return newObj;
}
exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}
exports.getAllUsers=factory.getAll(User);
// exports.getAllUsers=catchAsync(async(req,res,next)=>{
//     const users=await User.find();
//     res.status(200).json({
//         status:"success",
//         results:users.length,
//         data:{
//             users
//         } 
//     });  
// });
exports.updateMe=catchAsync(async(req,res,next)=>{
    //1)Create error if user POSTs password data
    if(req.body.password||req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates please use /updateMyPassword',400));
    }
    //2)Update user document
    //3)filter out unwanted fields
    const filteredBody=filterObj(req.body,'name','email');
    const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        status:"success",
        data:{
            user:updatedUser
        }
     
       })
});
exports.deleteMe=catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{
        active:false
    });
    res.status(204).json({
        status:"success",
        data:null
    });
    next();
});
exports.getUser=factory.getOne(User);
// exports.getUser=(req,res)=>{
//     res.status(500).json({
//      status:"error",
//      message:"This route is not yet defined"
//     })
// }
exports.createUser=(req,res)=>{
    res.status(500).json({
     status:"error",
     message:"This route is not yet defined!Please use Signup instead"
    })
}
//do not update passwords with this
exports.updateUser=factory.updateOne(User);
// exports.updateUser=(req,res)=>{
//     res.status(500).json({
//      status:"error",
//      message:"This route is not yet defined"
//     })
// }
exports.deleteUser=factory.deleteOne(User);
// exports.deleteUser=(req,res)=>{
//     res.status(500).json({
//      status:"error",
//      message:"This route is not yet defined"
//     })
// }