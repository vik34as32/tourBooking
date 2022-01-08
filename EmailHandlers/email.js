const nodemailer  = require('nodemailer');
const pug =require('pug')
const htmlToText = require('html-to-text');
// new Email(user,url).sendWelcome()

module.exports = class Email {
    constructor(user,url){
       this.to =user.email
       this.firstName =user.name.split(' ')[0]
       this.url =url
       this.from =`vikas <${process.env.EMAIL_FROM}>`
    }

    // Create different transports for different environments
    newTransport(){
        if(process.env.NODE_ENV==='production'){
            return nodemailer.createTransport(
                {  
                  service:'SendGrid',
                  auth:{
                          user:process.env.USER_EMAIL,
                          Password:process.env.USER_PASSWORD
                        }
                }
            )
        }
        return nodemailer.createTransport(
            {
                host:process.env.EMAIL_HOST,
                port:process.env.EMAIL_PORT,
                auth:{
                        user:process.env.USER_EMAIL,
                        Password:process.env.USER_PASSWORD
                    }
            }   
        )
    }
    //send Actuall email
    async send(template,subject){
        //1) Render the HTML base pug template
         const html  = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,
                {
                    firstName:this.firstName,
                    url:this.url,
                    subject
                }
            ) 
        //2) define The email options
          const mailoption={
                from: this.from,
                to:this.to,
                Subject:subject,
                html,
                text:htmlToText.fromString(html)
            }
    }
        
    // 3) Create a transport and send email
    // await this.newTransport().sendMail(mailOption)
  
   async sendWelcome(){
      await  this.send('Welcome',`Welcome to the Natours Family!`)
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset', 
            'Your password reset token (valid for only 10 minutes)'
            );
  }

}


// const sendEmail =async(options)=>{
    

//     //1) create A transpoter
//     const transpoter = nodemailer.createTransport({
//         host:process.env.EMAIL_HOST,
//         port:process.env.EMAIL_PORT,
//         auth:{
//             user:process.env.USER_EMAIL,
//             Password:process.env.USER_PASSWORD
//         }
//     })

//     //2) Define the Email options
//     const mailoption={
//         from:`Vikas Kumar <vik23641@gmail.com>`,
//         to:options.email,
//         Subject:options.subject,
//         text:options.message 
//     }
//     console.log(mailoption,"noght")

//     //3)Actually Send the email
//    transpoter.sendMail(mailoption,(error,info)=>{
//     if(error){   
//         console.log(error)
//     }else{
//         connsole.log(`message secussfully sent ${info}`)
//     }
//    })
  
// }

// module.exports=sendEmail