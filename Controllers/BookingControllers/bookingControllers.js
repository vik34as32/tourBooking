const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Booking =require('../../Models/bookingModel')
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Factory = require('../HandleFactory/handleFactory')

exports.getCheckoutSession =async (req,res,next)=>{
    //1)Get the Currently book tour
    const tour = await Tour.findById(req.params.tourId)

    const session =await stripe.checkout.session.create({
        payment_method_types : ['card'],
        success_url : `
        ${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url :   `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
        customer_email :  req.user.email,
        client_reference_id: req.params.tourId,
        line_items:[
            {
                name : `${tour.name} Tour`,
                description:tour.summary,
                images : [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1  
            }
        ]
    })
     // 3) Create session as response
        res.status(200).json({
            status: 'success',
            session 
        });
}


exports.createBookingCheckout =async(req,res,next)=>{
    const {tour,user,price} = req.query
 
    if(!tour && !user && !price) return next()

    await Booking.create({tour,user,price})
    res.redirect(req.OrignalUrl.split('?')[0])
}


exports.createBooking =Factory.createOne(Booking)
exports.getBooking =   Factory.getOne(Booking)
exports.getAllBooking = Factory.getAll(Booking)
exports.updateBooking = Factory.updateOne(Booking)
exports.deleteBooking = Factory.deleteOne(Booking)
