const fs=require('fs');
const express=require('express');
const { response } = require('express');
const app=express();
//read file sync
app.use(express.json())//this is the middleware which is used to add data to req obj.
const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// app.get('/',(req,res)=>{
// res.status(200).json({message:'Hello from the server side',app:'Natours'});
// });  //http method to get 
// app.post('/',(req,res)=>{
//     res.send('you can send to this endpoint');
// })

app.get('/api/v1/tours',(req,res)=>{
 res.status(200).json({
     status:"success",
     results:tours.length,
     data:{
         tours:tours   ///in ES6 if both key and value both are same wwe can just write a single tours
        }
 });   
})
app.get('/api/v1/tours/:id',(req,res)=>{
    console.log(req.params);
    const id=parseInt(req.params.id);
    if(id>tours.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid Id'
        });
    }
    const tour=tours.find(el=>el.id===id);
    res.status(200).json({
        status:"success",
         data:{
             tour:tour   ///in ES6 if both key and value both are same wwe can just write a single tours
            }
    });   
   })
app.post('/api/v1/tours',(req,res)=>{
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
})
const port =3000;
app.listen(port,()=>{
    console.log(`App running on port ${port}...`);
})