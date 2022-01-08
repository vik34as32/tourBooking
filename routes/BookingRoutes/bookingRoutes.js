const express =require('express')
const bookingController = require('../../Controllers/BookingControllers/bookingControllers')
const authController = require('../../Controllers/authControllers/authControllers')

const router =express.Router()

router.use(authController.Protect)

router
    .route('/checkout_session/:tourId')  
    .get(
        bookingController.getCheckoutSession
      )

router.use(authController.resticrtTo('admin','lead-quide'))
router
    .route('/') 
    .get(bookingController.getAllBooking)
    .post(bookingController.createBooking)



router
    .route('/:id')  
    .get(bookingController.getBooking)  
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking)


