const express = require('express')
const viewControllers =require('../../Controllers/viewControllers/viewControllers')
const authControllers = require('../../Controllers/authControllers/authControllers')
const userContollers =require('../../Controllers/UserControllers/userControolers')
const bookingContollers = require('../../Controllers/BookingControllers/bookingControllers')
const router =express.Router()





router
    .route('/login') 
    .get(viewControllers.getLoginForm) 
    .post(authControllers.login) 

router
    .route('/')
    .get(
        bookingContollers.createBookingCheckout,
        authControllers.Protect,
        viewControllers.getOverviews
        )

router
    .route('/tour/:slug')
    .get(
        authControllers.Protect,
        viewControllers.getTour
        )    



    
router 
    .route('/me')   
    .get(
        authControllers.Protect,
        viewControllers.getAccount
        )


router 
.route('/my-tour')   
.get(
    authControllers.Protect,
    viewControllers.getMyTours
   )        

router
    .route('/submit-user-data')
    .post(
        authControllers.Protect,
        userContollers.uploadUserPhoto,
        userContollers.resizeUserPhoto,
        viewControllers.updateUserData
    )

module.exports =router