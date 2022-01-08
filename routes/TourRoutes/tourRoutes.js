const express = require('express')
const router =express.Router()
const tourController =require('../../Controllers/ToursControllers/tourControllers')
const authController = require('../../Controllers/authControllers/authControllers')
 const reviewRouter =require('../ReviewsRoutes/ReviewsRoutes')




router.use('/:tourId/reviews',reviewRouter)
 
router
     .route('/tourstats')   
     .get(tourController.getAlltourStats)



     
router
   .route('/top-5-cheap-tour')
   .get(
         tourController.aliasTopTours,
         tourController.getAlltours
      )



router
   .route('/monthlyPlan/:year')   
   .get(
         authController.Protect,
         authController.resticrtTo('admin','lead-quide','quide'), 
         tourController.getMothlyPlan
      ) 

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin)
 
router
     .route('/distances/:latlng/unit/:unit')
     .get(tourController.getDistances);      

router
   .route('/')
   .get(tourController.getAlltours)
   .post(
         authController.Protect,
         authController.resticrtTo('admin','lead-quide'), 
         tourController.createNewTour
      )

router
   .route('/:id')
   .get(tourController.GetTour)
   .patch(
         authController.Protect,
         authController.resticrtTo('admin','lead-quide'),
         tourController.uploadTourImages,
         tourController.resizeTourImage,
         tourController.Updatetour
      )
   .delete(
       authController.Protect,
       authController.resticrtTo('admin','lead-quide'), 
      tourController.DeleteTour
      )

  

// router
//    .route('/:tourId/reviews')  
//    .post(
//       authController.Protect,
//       authController.resticrtTo('user'),
//       reviewsController.createReview
//    )       
    



 
module.exports =router  