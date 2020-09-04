const fs=require('fs');
const Tour=require('../models/tourModel');

// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));



// exports.checkID=(req,res,next,val)=>{                  //param middleware has acces to val 
//     console.log(`Tour id is : ${val}`);
//     if(req.params.id * 1>tours.length){
//         return res.status(404).json({
//             status:'fail',
//             message:'Invalid Id'
//         })
// }

// exports.checkBody=(req,res,next)=>{                          //check middleware for body
// if(!req.body.name || !req.body.price) return res.status(400).json({
//     status:"fail",
//     message:"Missing name or price"
// })
// next();
// }
exports.getAllTours=async(req,res)=>{
    try{
    console.log(req.query);
    // const tours=await Tour.find({
    //     duration:parseInt(req.query.duration),
    //     difficulty:req.query.difficulty
    // })
    const tours=await Tour.find()
                      .where('duration')
                      .equals(5)
                      .where('difficulty')
                      .equals('easy');
    res.status(200).json({
        status:"success",
        results:tours.length,
        data:{
            tours
        } 
    });   
   }catch(err){
    res.status(400).json({
        status:'fail',
        message:err
    })
   }}
   exports.getTour=async(req,res)=>{
    try{
    const tour=await Tour.findById(req.params.id);  //Tour.findOne({_id:req.params.id})
    res.status(200).json({
        status:"success",
        data:{
            tour
        }     
    });   
    }  catch(err){
        res.status(400).json({
            message:err
        })
    }
    
   };
   exports.createTour=async(req,res)=>{
    //   const newTour=new Tour({});
    //   newTour.save()    another method is direct;y use Tour.create(req.body);
    try{
       const newTour=await Tour.create(req.body);
       res.status(201).json({
           status:"success",
           data:{
               tour:newTour
           }
       });}catch(err){
           res.status(400).json({
               message:"Invalid data sent!"
           })
       }
    
  };
  exports.updateTour=async(req,res)=>{
      try{
          const tour=await Tour.findByIdAndUpdate(req.params.id,req.body,{
              new:true,
              runValidators:true
          });
          res.status(200).json(
            {
                status:'success',
                data:{
                    tour:tour
                }
            })
      }catch(err){
          res.status(400).json({
            status:'fail',
            message:err 
          })
      }  
  
    };
exports.deleteTour=async(req,res)=>{
    try{
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json(               //204 is status for no content
        {
            status:'success',
            data:null
        }
    );
}catch(err){
    res.status(400).json({
        status:'fail',
        message:err
    })
}
}