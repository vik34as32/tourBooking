const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const User = require('../../Models/UserModels');
const AppError = require('../../utils/AppError')
const Email = require('../../EmailHandlers/email')

const signToken = id=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:60*60*60
    });
}

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
  
      res.cookie('jwt', token, {
     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true, // cookie cannot be accessed or modified in any way by the browser
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
   };



exports.signup = async(req,res,next)=>{
    try{ 
           const { name, email, Password , PasswordCofirm } = req.body
           const image =req.file
            const newUser  = new User({name, email, Password, PasswordCofirm})
            newUser.save(newUser,url).sendWelcome()
            const url =`${req.protocol}://${req.get('host')}/`
            await new Email(newUser,url).sendWelcome()
                res.status(201).json({
                    status:"Sucess",
                    HowToCreateUsreSignup:req.requestTime,
                    data:{   
                        user:newUser
                    }
                })
    }catch(err){
             res
                 .status(500)
                 .json({
                 status:"fail",
                 message:err,
                 HowToCreateUsreSignup:req.requestTime
             })
    }
}

exports.login = async(req,res,next)=>{
     try{
        const {email,Password}=req.body
        console.log("Email:",email,'\nPassword:',Password)
        if(!email || !Password){
            return next(new AppError('please provide the email && password',400))
        }
       
        const user = await User.findOne({email}).select('+Password')
        console.log(user._id)
        const correct = await user.correctPassword(Password,user.Password)

        if(!email||!correct){
            return next(new AppError('Incorrect the email && password',401))
        }
        createSendToken(user,200,req,res)

     }catch(err){
        res.status(400).json({
            status:"fail",
            HowToCreateUsreSignup:req.requestTime,
            data:{
               err
             }
        })
     }

}


exports.logout =(req,res)=>{
  console.log(req)
  // res.cookies('jwt',"loggedOut",{
  //   expires: new Date(Date.now()+10*1000),
  //   httpOnly: true, 
  // })
  res.clearCookie("jwt")
  res.status(200).json({status:"sucess"})
}

exports.Protect =async(req,res,next)=>{
    //1)  Getting token and check of it's there
       let token
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
           token =req.headers.authorization.split(' ')[1]
      }else if(req.cookies.jwt){
        token=req.cookies.jwt
    }
      if(!token){
        return next(new AppError('You are not logged in! Please log in to get acesses',401))
      }
      //2) Verify toekn
      const Decode = await jwt.verify(token,process.env.JWT_SECRET)
      console.log(Decode)
      
      //3) check if user still exits
      const currentUser = await  User.findById(Decode.id)
        console.log(currentUser)
        if(!currentUser){
            return next(new AppError('The User belonging  to this toekn user  no longer exist',401))
        }
      //4) Check if User password after the Jwt was issued
      if(currentUser.changePasswordAfter(Decode.iat)){
        return next(new AppError('User Recenty chnnge password! pleaselogin again!',401))
      }

    //Grant Access to Procted routed
    req.user = currentUser;
    next()
}

  



exports.isLoggedIn = async (req, res, next) => {
  console.log(req.cookies.jwt,"nandni ka nand lala brij ka ")
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
       console.log(decoded,"nikhil kA nando")
       console.log(decoded.id,"nandu sbka bandu")
      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      console.log(currentUser,'mera naam h japani mere patlum englistani')
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};


exports.resticrtTo =(...role)=>{
    
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            return next(new AppError('You do not have permission to peform this Action',403))
        }
        next()
    }
}



exports.forgotPassword  =async(req,rea,next)=>{
    //Get user Based on Posted email
    const user =await User.findOne({email:req.body.email})
    if(!user){
        return next(new AppError('The user is not exits ',404))
    }

    //2)Generate The random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave:false})


    //send it to User's email
    console.log(req.get('host'),req.protocol,"i am the bady boy")
    const resetUrl= `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message =`Forgot your password? Submit a PATCH request your new password and PasswordConfirm to: ${resetUrl}.\n if you didn't forget your Password, Please ignore this email `

      try{
          await new Email(user, resetUrl).sendPasswordReset()
          res.status(200).json({
              status:"sucess",
              message:"token Sent your email"
          })
        }catch(err){
          user.PasswordResetToken=undefined
          user.PasswordResetExpires=undefined
          await user.save({validateBeforeSave:false})
          
          return next(
            new AppError('There was an error sending the email!. please try again',500)
          )
      }

}



exports.resetPassword  =async(req,rea,next)=>{
    //1) get the User bases on token
       const hashedToken = crypto
       .createHash('sha256')
       .update(req.params.token)
       .digest('hex')
       const user = await User.findOne({
           PasswordResetToken:hashedToken,
           PasswordResetExpires:{$gt:Date.now()}
        }) 
    //if token has not expied, and there is user, set the new password
      if(!user){
          next(
              new AppError('Token is invalid or has = expired ',400)
          )
      }
      user.Password =req.body.Password
      user.PasswordCofirm=req.body.PasswordCofirm
      user.PasswordResetToken=undefined
      user.PasswordResetExpires=undefined
      await user.save()
    //3)update changepassword property for user
    
 
    //4)log the user in,send Jwt
    const token =signToken(user._id)
    res.status(200).json({
        status:"Sucess",
        token
    })
}

exports.updatePassword =async(req,res,next)=>{
     try{
       console.log(req.body)
      //get user from collection
       const user = await User.findById(req.user.id).select('+Password')
      
       user.Password =req.body.password
       user.PasswordCofirm =req.body.password_confirm
       await user.save()
       //4)log the user in,send Jwt
       createSendToken(user,200,req,res)
     }catch(err){
        res.status(400).json({
          status:"fail",
          HowToCreateUsreSignup:req.requestTime,
          data:{
            err
          }
     })
    }
}