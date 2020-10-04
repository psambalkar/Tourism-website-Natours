const catchAsync =require('./catchAsync');
const AppError=require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne=Model=>catchAsync(async(req,res,next)=>{

    const doc= await Model.findByIdAndDelete(req.params.id);
     if(!doc){
         return next(new AppError("No document found with that id",404));
         };
     res.status(204).json(               //204 is status for no content
         {
             status:'success',
             data:null
         }
     );
 });
 exports.updateOne=Model=>catchAsync(async(req,res,next)=>{
    const doc=await Model.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    if(!doc){
      return next(new AppError("No document find with that id",404));
      };
    res.status(200).json(
      {
          status:'success',
          data:{
              data:doc
          }
      })
});
exports.createOne=Model=>catchAsync(async(req,res,next)=>{
    //   const doc=new Tour({});
    //   newTour.save()    another method is direct;y use Tour.create(req.body);
       const doc=await Model.create(req.body);
       res.status(201).json({
           status:"success",
           data:{
               data:doc
           }
       })
    
  });
  exports.getOne=(Model,popOptions)=>catchAsync(async(req,res,next)=>{
            let query=Model.findById(req.params.id)
            if(popOptions) query=query.populate(popOptions);
            const doc=await query ; //Tour.findOne({_id:req.params.id})
        if(!doc){
        return next(new AppError("No tour find with that id",404));
        }
        res.status(200).json({
            status:"success",
            data:{
                doc
            }     
        });   
       });
exports.getAll=Model=>catchAsync(async(req,res,next)=>{
    let filter={};                                     //to allow nested GET reviews on tour
    if(req.params.tourId) filter={tour:req.params.tourId}
    //EXECUTE QUERY               //.where(difficulty).equals(2),where(DURATION).EQUALS(23)
    const features=new APIFeatures(Model.find(filter),req.query)
                       .filter()
                       .sort()
                       .limitFields()
                       .paginate();
    // const doc=await features.query.explain();  ///to analyize data
    const doc=await features.query;

    res.status(200).json({
        status:"success",
        results:doc.length,
        data:{
            data:doc
        } 
    });   
   })
// exports.deleteTour=catchAsync(async(req,res,next)=>{

//     const tour= await Tour.findByIdAndDelete(req.params.id);
//      if(!tour){
//          return next(new AppError("No tour find with that id",404));
//          };
//      res.status(204).json(               //204 is status for no content
//          {
//              status:'success',
//              data:null
//          }
//      );
//  });