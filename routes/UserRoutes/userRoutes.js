const express = require('express')
const userControllers = require('../../Controllers/UserControllers/userControolers')
const authController = require('../../Controllers/authControllers/authControllers')
const router =express.Router()    
    


     
//This are the Sigup Route
router
    .route('/signup')
    .post(
        authController.signup,
        userControllers.uploadUserPhoto 
        )

// This are Login Route    
router
    .route('/login')   
    .post(authController.login) 

router
    .route('/logout ')   
    .get(authController.logout )     

//This are the forgotPassword Route  
router
   .route('/forgotPassword')
   .post(authController.forgotPassword) 


// This are the resetPassword Password Route
router
   .route('/resetPassword/:token')
   .patch(authController.resetPassword) 

// This are the updatePassword Password Route
router
   .route('/updatePassword')
   .patch(
       authController.Protect,
       authController.updatePassword
       )  
       
router
     .route('/Updateme')  
     .patch(
         authController.Protect,
         userControllers.uploadUserPhoto,
         userControllers.Updateme 
        )     

       
router
    .route('/deleteMe')  
    .delete(
        authController.Protect,
        userControllers.deleteMe 
        ) 


router
    .route('/me')
    .get( 
        authController.Protect,
        userControllers.getme,
        userControllers.getUser
    )
//Proctect All routes  After midleware
 router.use(authController.Protect)
// //only can acess the Routes Ad min 
router.use(authController.resticrtTo('admin'))
    
router
    .route('/')
    .get(userControllers.getAllUser)
    .post(userControllers.CreateUser)
router
    .route('/:id')
    .get(userControllers.getUser)
    .patch(userControllers.UpdateUser)
    .delete(userControllers.DeleteUser)     

module.exports =router;
 