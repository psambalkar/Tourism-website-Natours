const fs=require('fs');

const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.checkID=(req,res,next,val)=>{                  //param middleware has acces to val 
    console.log(`Tour id is : ${val}`);
    if(req.params.id * 1>tours.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid Id'
        })
}
next();
}
exports.checkBody=(req,res,next)=>{                          //check middleware for body
if(!req.body.name || !req.body.price) return res.status(400).json({
    status:"fail",
    message:"Missing name or price"
})
next();
}
exports.getAllTours=(req,res)=>{
    console.log(req.requestTime);
    res.status(200).json({
        status:"success",
        requestedAt:req.requestTime,
        results:tours.length,
        data:{
            tours:tours   ///in ES6 if both key and value both are same we can just write a single tours
           }
    });   
   }
   exports.getTour=(req,res)=>{
    console.log(req.params);
    const id=parseInt(req.params.id);
    const tour=tours.find(el=>el.id===id);
    res.status(200).json({
        status:"success",
         data:{
             tour:tour   ///in ES6 if both key and value both are same wwe can just write a single tours
            }
    });   
   };
   exports.createTour=(req,res)=>{
    //  console.log(req.body);
     const newId=tours[tours.length - 1].id + 1;
     const newTour=Object.assign({  id: newId }, req.body);
     tours.push(newTour);
     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
       res.status(201).json({
           status:"success",
           data:{
               tour:newTour
           }
       });
     })
  };
  exports.updateTour=(req,res)=>{  
    res.status(200).json(
        {
            status:'success',
            data:{
                tour:'<Updated tour>'
            }
        }
    )};
exports.deleteTour=(req,res)=>{
    res.status(204).json(               //204 is status for no content
        {
            status:'success',
            data:null
        }
    );
};