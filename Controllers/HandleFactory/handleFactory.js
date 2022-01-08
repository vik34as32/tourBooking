const AppError =require('../../utils/AppError')
const APIFeatures = require('../../utils/APIFeature')

exports.createOne  = Model=>{
     return async(req,res)=>{
      try{
                  
            const newDoc  = new Model(req.body)
             newDoc.save()
          
          res
            .status(201)
            .json({
                 status:"Sucess",
                 request:req.requestTime,
                 data:{
                   tour:newDoc 
                  }
              })
      }catch(err){
          res
              .status(400)
              .json({
                  status:"fail",
                  message:'Invalid data sent',
                  request:req.requestTime
              })
      }
  }
}
exports.getAll =Model=>{
      return async(req,res)=>{
        try{
           console.log(Model)
            const feature =new APIFeatures(Model.find(),req.query)
                .filter()
                .sort()
                .limitFields()
                .Pagination()
               const Doc = await feature.query
               console.log(Doc)
               
            res
             .status(201)
             .json({
                status:"Sucess",
                request:req.requestTime,
                Items:Doc.length,
                data :{
                    tour:Doc
                }
            })
        }catch(err){
            console.log(err)
            res
                .status(500)
                .json({
                status:"fail",
                message:err,
                request:req.requestTime
            })
        }
    }
}

exports.getOne =(Model,popOptions)=>{
  
  return  async(req,res,next)=>{
    try{
          let data = await Model.findById(req.params.id)
             if(popOptions){
                data = data.populate(popOptions)
             }
              const Doc  =await data

                 if(!Doc){
                    return next(
                        new AppError('No document is find with that id',404)
                    )
                  }
          
          
            res
                .status(200)
                .json({
                  status:"Sucess",
                  request:req.requestTime,
                  data:{
                    Doc
                      }
                })
        }catch(err){
              res
                .status(500)
                .json({
                    status:"fail",
                    message:"Invalid Id ",
                    request:req.requestTime
                })
        }
  }  

}


exports.updateOne = Model=>{
  return async(req,res)=>{
        try{
                 console.log(req.file,"akash")
          const Doc  = await Model.findByIdAndUpdate(req.params.id,req.body,{
              new:true,
              runValidators:true
          })
              if(!Doc){
                return next(
                    new AppError('No document is find with that id',404)
                )
              }
         
          res
            .status(200)
            .json({
                status:"sucess",
                data:{
                    Doc
                  },
                request:req.requestTime
              })
        }catch(err){
              res
                .status(500)
                .json({
                    status:"fail",
                    message:err,
                    request:req.requestTime
                  })
          }
   }
}

 exports.deleteOne = Model=>{
    return async(req,res)=>{
         try{
            const Doc= await Model.findOneAndDelete(req.params.id)

               if(!Doc){
                 return next(
                     new AppError('No document is find with that id',404)
                 )
               }
                   res
                     .status(204)
                     .json({
                         status:"sucess",
                         request:req.requestTime,
                         data:null
                       })
         }catch(err){
                 res
                   .status(500)
                   .json({
                         status:"fail",
                         message:err,
                       request:req.requestTime
                   })
           }
    }
 }





