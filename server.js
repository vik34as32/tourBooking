const dotenv = require('dotenv')
// process.on('uncaughtException',err=>{
//     console.log('unhandledRejection! *  Shutting Down.....')
//     console.log(err.name,err.message)  
//     process.exit(1)
// })
const app = require('./app')
//Error 

const db = require('./db/dbcon')

dotenv.config({path:'./config.env'})

// Server that can be start
const port  =process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})  



