const express=require('express');
const router=express.Router();
const tourController=require('../controllers/tourController');
router.param('id',tourController.checkID);

//create a checkbodymiddleware and check if it contains name and price propery
router
.route('/')
.get(tourController.getAllTours)
.post(tourController.checkBody,tourController.createTour);
router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);
module.exports=router;