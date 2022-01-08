const path = require('path')
const express = require('express')
const { json, urlencoded } = require('express')
const morgan = require('morgan')
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')

const AppError =require('./utils/AppError')
const GloBalErrorHandler =require('./Controllers/ErrorControllers/errorControllers')
const tourRouter = require('./routes/TourRoutes/tourRoutes')
const userRouter = require('./routes/UserRoutes/userRoutes')
const reviewRouter = require('./routes/ReviewsRoutes/ReviewsRoutes')
const viewRoutes = require('./routes/ViewRoutes/viewRoutes')
const bookingRouter = requier('./routes/BookingRoutes/bookingRoutes')

// Start express app
const app =  express()


app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//set Security for Http header
app.use(helmet())

// THis Are the GloBal Middleware

app.use(morgan('dev'))

//LIMIT request from same Api
const Limiter =rateLimit({
    max: 10, // limit each IP to 10 requests per windowMs
    windowMs:60*60*100,
    message:`To many request from this IP,please try again in on hours `
})

app.use('/ap1',Limiter)

// Body parser,rendering data body into req.body

app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:false,limit:'10kb'}))
app.use(cookieParser())


//data sanitization agaist no sql query injection
app.use(mongoSanitize())

//data sanitization agaist xss
app.use(xss())

//Prevent parameter pollution
app.use(hpp({
    whitelist:['duration']
}))

//Test middleware             
const logger =(req,res,next)=>{
    req.requestTime = new Date().toISOString()
    next()
}
app.use(logger)


 //Routes 
 app.use('/',viewRoutes)
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/bookings', bookingRouter);


app.all('*',(req,res,next)=>{
  
    // const err = new Error(`can't find ${req.originalUrl} on this server`)
    // err.status ="fail",
    // err.statusCode=404
    // next(err)
    next(new AppError(`can't find ${req.originalUrl} on this server`,404))
})


//GloBal Error Handling Middleware
app.use(GloBalErrorHandler)

module.exports=app