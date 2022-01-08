const path = require('path')
const multer =require('multer')
const sharp = require('sharp')
const User = require('../../Models/UserModels');
const AppError = require('../../utils/AppError')
const Factory = require('../HandleFactory/handleFactory')

//  const multerStorage = multer.diskStorage({
//    destination: (req, file, cb) => {
//      cb(null, 'public/img/users');
//    },
//    filename: (req, file, cb) => {
//       //user-80980d0s9089d-333232325689.jpeg
//      const ext = file.mimetype.split('/')[1];
//      cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//    }
//  });

 const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

 exports.resizeUserPhoto = async (req, res, next) => {
   if (!req.file) return next();

   req.file.filename = `user-${req.user.id}-${req.file.originalname}`;

   await sharp(req.file.buffer)
     .resize(500, 500)
     .toFormat('jpeg')
     .jpeg({ quality: 90 })
     .toFile(`public/img/users/${req.file.filename}`);

   next();
 }

 

const filterObj =(obj,...allowedFields)=>{
    const newObj ={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el]=obj[el]
    })
    return newObj
}


 exports.getme =(req,res,next)=>{
     req.params.id =req.user.id;
     next()
 }

exports.Updateme = async(req,res,next)=>{ 
    console.log(req.body)
    console.log(req.file)
    //1) Create error if user Posts password data
      if(req.body.Password || req.body.PasswordCofirm){
          return next(
                new AppError('This route is not for Password updates!.  please use / updateMypassword',400)
          )
      }

    //2)Update user data
    const filterdBody = filterObj(req.body,'name','email')
    const updateuser = await User.findByIdAndUpdate(req.user.id,filterdBody,{
        new:true,
        runValidators:true
     })

    res.status(200).json({
        status:'sucess',
        data:{
            user:updateuser 
        }
    })
}    

exports.deleteMe = async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
  
    res.status(204).json({
      status: 'success',
      data: null
    });
  }

exports.CreateUser =(req,res)=>{
    res
        .status(500)
        .json({
            status:"Error",
            message:'This route is not yet defined! 😒 Please use /signup instead',
            request:req.requestTime,
        })       
}
exports.getAllUser =Factory.getAll(User)
exports.getUser =Factory.getOne(User)
exports.UpdateUser =Factory.updateOne(User)
exports.DeleteUser = Factory.deleteOne(User)