module.exports=fn=>{                           //inorder to get rid of try catch blocks//
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>next(err));
    }
};