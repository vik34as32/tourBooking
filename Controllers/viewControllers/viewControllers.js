const Tour = require('../../Models/tourModel')
const User =require('../../Models/UserModels')
const Booking =require('../../Models/bookingModel')
const AppError = require('../../utils/AppError')

exports.getOverviews =async(req,res)=>{
     // 1) Get tour data from collection
     console.log("User:",req.user)
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
   console.log(tours)
  res.status(200).render('overview', {
    title:'All Tours',
    tours,
    user:req.user
  });
}

exports.getTour = async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
}


exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};


exports.getAccount = (req, res) => {
  console.log(req.user)
  res.status(200).render('account', {
    title: 'Your account',
    user:req.user
  });
};

exports.getMyTours =async(req,res,next)=>{
  console.log(req.user.id)
    //1) find all Booking
      const  bookings =await Booking.find({user:req.user.id})
    //2) find tours with reurn ids
    const tourIDs  = bookings.map(el=>el.tour)
    const tours   =await Tour.find({_id:{$in:tourIDs}})

    res.status(200).render('overview', {
      title: 'My Tours',
      user:req.user
    });
}


exports.updateUserData=async (req,res,next)=>{
  console.log("vikas",req.body),
  console.log(req.file)
  const userUpdateData = await User.findByIdAndUpdate(
    req.user.id,
    {
    name:req.body.name,
    email:req.body.email,
    photo:`user-${req.user.id}-${req.file.originalname}`
    },
    {
        new:true,
        runValidators:true
    }
  ) 
  console.log(userUpdateData)
   res.status(200).render('account',{
      status:"success",
      user:userUpdateData,
      title: 'Your account'
   })
}
