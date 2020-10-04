const fs=require('fs');
const Tour=require('../models/tourModel');
const catchAsync = require('./catchAsync');
const AppError=require('../utils/appError');
const factory=require('./handlerFactory');

// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.aliasTopTours=(req,res,next)=>{
req.query.limit='5';
req.query.sort='-ratingsAverage,price';
req.query.fields='name,price,ratingsAverage,summary,difficulty';
next();
}
exports.getAllTours=factory.getAll(Tour);
// exports.getAllTours=catchAsync(async(req,res,next)=>{
    
//     //EXECUTE QUERY               //.where(difficulty).equals(2),where(DURATION).EQUALS(23)
//     const features=new APIFeatures(Tour.find(),req.query)
//                        .filter()
//                        .sort()
//                        .limitFields()
//                        .paginate();
//     const tours=await features.query;
//     res.status(200).json({
//         status:"success",
//         results:tours.length,
//         data:{
//             tours
//         } 
//     });   
//    })
   exports.getTour=factory.getOne(Tour,{path:'reviews'});
//    exports.getTour=catchAsync(async(req,res,next)=>{
    
//     const tour=await Tour.findById(req.params.id).populate('reviews')  //Tour.findOne({_id:req.params.id})
//     if(!tour){
//     return next(new AppError("No tour find with that id",404));
//     }
//     res.status(200).json({
//         status:"success",
//         data:{
//             tour
//         }     
//     });   
//    });
 exports.createTour=factory.createOne(Tour);  
//    exports.createTour=catchAsync(async(req,res,next)=>{
//     //   const newTour=new Tour({});
//     //   newTour.save()    another method is direct;y use Tour.create(req.body);
//        const newTour=await Tour.create(req.body);
//        res.status(201).json({
//            status:"success",
//            data:{
//                tour:newTour
//            }
//        })
    
//   });
  exports.updateTour=factory.updateOne(Tour);
//   exports.updateTour=catchAsync(async(req,res,next)=>{
//           const tour=await Tour.findByIdAndUpdate(req.params.id,req.body,{
//               new:true,
//               runValidators:true
//           });
//           if(!tour){
//             return next(new AppError("No tour find with that id",404));
//             };
//           res.status(200).json(
//             {
//                 status:'success',
//                 data:{
//                     tour:tour
//                 }
//             })
//     });
exports.deleteTour=factory.deleteOne(Tour);
// exports.deleteTour=catchAsync(async(req,res,next)=>{

//    const tour= await Tour.findByIdAndDelete(req.params.id);
//     if(!tour){
//         return next(new AppError("No tour find with that id",404));
//         };
//     res.status(204).json(               //204 is status for no content
//         {
//             status:'success',
//             data:null
//         }
//     );
// });
exports.getTourStats=catchAsync(async(req,res,next)=>{
    
     const stats=await Tour.aggregate([
         {
    $match:{ratingsAverage:{$gte:4.5}}
     },
    {$group:{
        // _id:'$ratingsAverage',
        _id:{$toUpper:'$difficulty'},
        // _id:null,
        numTours:{$sum:1},                   //to add 1 to each tour
        numratings:{$sum:'$ratingsQuantity'},
        avgRating:{$avg:'$ratingsAverage'},
        avgPrice:{$avg:'$price'},
        minPrice:{$min:'$price'},
        maxPrice:{$max:'$price'}
    }},
     {$sort:{avgRating:1}}
    //  ,
    // {$match:{_id:{$ne:'EASY'}}}
]);
    res.status(200).json(
        {
            status:'success',
            data:{
                stats
            }
        });
    
});
exports.getMonthlyPlan=catchAsync(async(req,res,next)=>{
    
      const year=req.params.year*1;
      const plan = await Tour.aggregate([
          {
              $unwind:'$startDates'
          },
          {
              $match:{
                  startDates:{
                      $gte:new Date(`${year}-01-01`),
                      $lte:new Date(`${year}-12-31`)
                  }
              }
          },
          {
              $group:{
                  _id:{$month:'$startDates'},
                  numToursStart:{$sum:1},
                  tours:{$push:'$name'}
              }
          },
          {
              $addFields:{month:'$_id'}
          },
          {
              $project:{
                  _id:0
              }
          },
          {
              $sort:{numToursStart:-1}
          }
          
      ]);
      res.status(200).json(
        {
            status:'success',
            results:plan.length,
            data:{
                plan
            }
        });
   
});
exports.getToursWithin=catchAsync(async(req,res,next)=>{
    ///tours-within/:distance/center/:latlng/unit/:unit
    const {distance,latlng,unit}=req.params;
    const [lat ,lng]=latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2  : distance /6378.1;
    if(!lat || !lng){
        next(new AppError('Please Provide lattitude and longitude in the format  lat,lng.',400));
    }
    const tours=await Tour.find({
        startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}    //geospatial query to get tours which are within certain specified distance
    });
    console.log(distance,lat,lng,unit);
    res.status(200).json({
        status:'success',
        results:tours.length,
        data:{
            data:tours
        }
    })
});
exports.getDistances=catchAsync(async(req,res,next)=>{
    const {latlng,unit}=req.params;
    const [lat ,lng]=latlng.split(',');
    const multiplier= unit === 'mi'?0.000621371 : 0.001;
    if(!lat || !lng){
        next(new AppError('Please Provide lattitude and longitude in the format  lat,lng.',400));
    } 
    const distances = await Tour.aggregate([
        {
            $geoNear:{
                near:{
                    type:'Point',
                    coordinates:[lng * 1,lat * 1]
                },
                distanceField:'distance',
                distanceMultiplier:multiplier
            }
        },
        {
            $project:{
                distance:1,
                name:1
            }
        }

    ]) 
    res.status(200).json({
        status:'success',
        data:{
            data:distances
        }
    });
})