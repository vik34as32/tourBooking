const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcrypt');


const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Please Provide your email'],
        trim:true,
        unique:[true,'This Email is Already registerd && Please fill to an another Email '],
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:{ 
        type:String,
        default:'default.jpg'
    },
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    Password:{
        type:String,
        required:[true,'Please provide a  password'],
        minlength:8,
        select:false
    },
    PasswordCofirm:{
        type:String,
        required:[true,'Please confirm your password'],
        minlength:8,
        validate:{
            validator:function(Cpassword){
                return Cpassword===this.Password
            },
            message:"Password are not the same "
        } 
    },
    PasswordChangedAt:Date,
    PasswordResetToken:String,
    PasswordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }

}) 


userSchema.pre("save", async function(next){
    //Only run this function if the password was actually modified
    if(!this.isModified("Password"))return next()
   
    // hash the password with cost of 10
      this.Password  = await bcrypt.hash(this.Password,10)
   
      // Delete password  with PasswordCofirm filed  
      this.PasswordCofirm = undefined
    
    next()
})
 
userSchema.pre("save", async function(next){
    if(!this.isModified("Password")||this.isNew)return next()
    this.PasswordChangedAt =Date.now()-1000
    next()
})


//Compase the Password
userSchema.methods.correctPassword = async function(
    candidatePassword,userpassword
    ){
    return await bcrypt.compare(candidatePassword,userpassword)
}

userSchema.methods.changePasswordAfter =function(JWTTimestamp){
    if(this.PasswordChangedAt){
        const ChangeTimestamp =parseInt(this.PasswordChangedAt.getTime()  /100000,10)
        console.log(ChangeTimestamp,JWTTimestamp)
        return JWTTimestamp<ChangeTimestamp;  //100<200
    }
    //flase mean not changed
    return false
}

userSchema.methods.createPasswordResetToken = function(){
  const resetToken =crypto.randomBytes(32).toString('hex')
    console.log(resetToken,"vikas")
   this.PasswordResetToken = crypto
   .createHash('sha256')
   .update(resetToken)
   .digest('hex');
   console.log({resetToken},this.PasswordResetToken)
   
    this.PasswordResetExpires = Date.now()+10*60*1000

    return resetToken
}

const User =new mongoose.model('User',userSchema)

module.exports =User