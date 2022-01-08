const express = require('express')
const reviewsControllers = require('../../Controllers/ReviewsConntrollers/reviewsControllers');
const authController  = require('../../Controllers/authControllers/authControllers')

const router =express.Router({mergeParams:true})

//Proctect All routes  After midleware
router.use(authController.Protect)

// user review routes
router
    .route('/')
    .get(reviewsControllers.getAllReviews)
    .post(
        authController.resticrtTo('user'),
        reviewsControllers.setTouUserId,
        reviewsControllers.createReview)

router
    .route('/:id')
    .get(reviewsControllers.getReviews)
    .patch(
        authController.resticrtTo('user','admin'),
        reviewsControllers.updateReview
        )
    .delete(
        authController.resticrtTo('user','admin'),
        reviewsControllers.DeleteReview
        )


module.exports=router