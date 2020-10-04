const Tour=require('../models/tourModel');
const catchAsync = require("./catchAsync");

exports.getOverview=catchAsync(async(req,res,next)=>{
 //1.Get tour data from collection
 const tours=await Tour.find();
 res.status(200).render('overview',{
     title:'All Tours',
     tours:tours
 });
});
exports.getTour=catchAsync(async(req,res,next)=>{
 //1.Get the tour data fro the requested tour (including reviews and guides)
 const tour=await Tour.findOne({slug:req.params.slug}).populate({
  path:'reviews',
  fields:'review rating user'
 })
 //2.Build Template
 //3.Render Template using data
 res.status(200).render('tour',{
     title:`${tour.name} tour`,
     tour
 })
});
exports.getLoginForm=(req,res)=>{
 res.status(200).render('login',{
  title:'Log into your account'
 })
};