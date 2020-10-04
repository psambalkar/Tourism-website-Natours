const express=require('express');

const {getAllUsers,createUser,getUser,updateUser,deleteUser, updateMe, deleteMe,getMe}=require('../controllers/userController');
const authController=require('../controllers/authController');
const reviewController=require('../controllers/reviewController');
const router=express.Router();
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
router.use(authController.protect)  //protect all routes after this
router.patch('/updateMyPassword',authController.updatePassword);
router.get('/me',getMe,getUser);
router.patch('/updateMe',updateMe);
router.delete('/deleteMe',deleteMe);

router.use(authController.restrictTo('admin')); ///to make all request for admin after this
router.
route('/')
.get(getAllUsers)
.post(createUser)
router.
route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser)

module.exports=router;