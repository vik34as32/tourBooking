const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})



const db = process.env.DATABASE.replace(
            '<Password>',
            process.env.DATBASE_PASSWORD
     )
mongoose
    .connect(db,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useUnifiedTopology:false
           
        }
     )
  .then(()=> console.log('Database Connection Sucessfully...'))
  


 process.on('unhandledRejection',err=>{
     console.log(err.name,err.message)  
     console.log('unhandledRejection! *  Shutting Down.....')
         process.exit(1)
 })  


  
module.exports =mongoose  