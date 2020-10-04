const express=require('express');

const router=express.Router();
const tourController=require('../controllers/tourController');
const authController=require('../controllers/authController');
// const reviewController=require('../controllers/reviewController');
const reviewRouter =require('../routes/reviewRoutes');
// router.param('id',tourController.checkID);
//POST /tour/tourID/reviews
// router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview);
// module.exports=router;
router.use('/:tourId/reviews', reviewRouter);
//create a checkbodymiddleware and check if it contains name and price propery
router
.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours);
router
.route('/tour-stats').get(tourController.getTourStats);
router
.route('/monthly-plan/:year').get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),tourController.getMonthlyPlan);
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
.route('/')
.get(tourController.getAllTours)
.post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour);
router
.route('/:id')
.get(tourController.getTour)
.patch(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.updateTour)
.delete(authController.protect ,authController.restrictTo('admin','lead-guide')
,tourController.deleteTour);
// //POST /tour/tourID/reviews
// router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview);
 module.exports=router;