const multer =require('multer')
const sharp = require('sharp')
const Tour = require('../../Models/tourModel')
const APIFeatures =require('../../utils/APIFeature')
const AppError =require('../../utils/AppError')
const Factory = require('../HandleFactory/handleFactory')

const multerStorage =multer.memoryStorage()

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

 exports.uploadTourImages =upload.fields([
     {name:'imageCover',maxCount:1},
     {name:'images',maxCount:3}
 ])
//exports.upload =upload.single('images');
// upload.array('images',3);

exports.resizeTourImage =async(req,res,next)=>{
//    if (!req.files.imageCover || !req.files.images) return next();

     req.body.imageCoverFilename = `tour-${req.user.id}-${Date.now()}-cover.jpg`;
      //1) cover image
     const data =   await sharp(req.files.imageCover[0].buffer)
          .resize(2000, 1300)
          .toFormat('jpg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${req.body.imageCoverFilename}`);
       //2) Images
         req.body.images =[]
        await Promise.all(
         req.files.images.map(async(file,i)=>{
             const filename = `tour-${req.user.id}-${Date.now()}-${i + 1}.jpg`;
                await sharp(file.buffer)
                    .resize(2000, 1300)
                    .toFormat('jpg')
                    .jpeg({ quality: 90 })
                    .toFile(`public/img/tours/${filename}`);
                
                req.body.images.push(filename)         
         })
        )

   next();
}

exports.aliasTopTours =(req,res,next)  =>{
    req.query.limit ='5';
    req.query.sort ='-price,ratingsAverage'
    req.query.fields='name,duration,difficulty,price,ratingsAverage,summary'
    next()
}

exports.getAlltours = Factory.getAll(Tour)
exports.createNewTour = Factory.createOne(Tour)
exports.GetTour = Factory.getOne(Tour,{path:'reviews'})
exports.Updatetour =Factory.updateOne(Tour)
exports.DeleteTour   =Factory.deleteOne(Tour)

 exports.getAlltourStats =async(req,res)=>{ 
     try{
        const stats = await Tour.aggregate([
            { 
                $match: {ratingsAverage:{ $gte:4.5}  } 
            }, 
            {
                $group:{
                    _id: {$toUpper:'$difficulty'},
                    numtours:{$sum:1},
                    Avgratings:{$avg:'$ratingsAverage'},
                    AvgPrice:{$avg:'$price'},
                    minPrice:{$min:'$price'},
                    maxPrice:{$max:'$price'} 
                }
            },
            {
                $sort:{AvgPrice:1}}
            // },{
            //     $match:{_id:{$ne:'EASY'}}
            // }
        ])
        res
        .status(200)
        .json({
           status:"sucess",
            data:{
                stats
              },
            request:req.requestTime
          })
     }catch(err){
     res.send   ("ERRor")
     }
 } 


 exports.getMothlyPlan = async(req,res)=>{
        try{
            const year =req.params.year*1
            const plan = await Tour.aggregate([
                {
                     $unwind: '$startDates'
                },
                {
                    $match:{
                        startDates:{
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`),
                        }
                    }
                },
                 {
                     $group:{
                         _id:{ $month:'$startDates'},
                          numToursStarts:{$sum:1},
                          tours:{$push: '$name'  }

                     }
                 },
                 {
                     $addFields :{month:'$_id'}
                 },
                 {
                     $sort:{numToursStarts:-1}
                 },
                 {
                     $limit:6
                 }
            ])
            res
                .status(200)
                .json({
                status:"sucess",
                   result:plan.length,
                    data:{
                        plan
                    },
                    request:req.requestTime
                })
        }catch(err){
                 console.log(err)
        }
 }
// /tours-within?distance=233&center=-25.586913, 85.170294&unit=mi
// /tours-within/233/center/-40,45/unit/mi
exports.getToursWithin  =async(req,res,next)=>{
    try{
        const {distance,latlng,unit} =req.params
        const [lat,lng] =latlng.split(',')
      
        // const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
        const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
      
        if(!lat ||!lng){
            return next(
                new AppError("Please provide latitude or longitute in format lat,lng")
            )
        }
          const tours = await Tour.find({
              startlocation:{$geoWithin:{$centerSphere: [[lng, lat], radius]}}
          })
        res.status(200).json({
            status:"sucess",
            results: tours.length,
            data: {
              data: tours
            }
        })
    }catch(err){
        res.status(500).json({
            status:"fail",
            data: {
              data: err
            }
        })
    }
}

exports.getDistances  =async(req,res,next)=>{
       try{
        const {latlng,unit} =req.params
        const [lat,lng] =latlng.split(',')
      
        // const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
        const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
      
        if(!lat ||!lng){
            return next(
                new AppError("Please provide latitude or longitute in format lat,lng")
            )
        }
        const distances = await Tour.aggregate([
           {
            $geoNear:{
                near:{
                    type:'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField:'distance',
                distanceMultiplier: multiplier
            }
           },
           {
            $project: {
              distance: 1,
              name: 1
            }
          }
        ])
       }catch(err){
        res.status(500).json({
            status:"fail",
            data: {
              data: err
            }
        })
       } 
}