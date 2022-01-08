import axios from 'axios'
// import { showAlert } from './alerts';



export const login =async (email,Password)=>{
  console.log(email,Password)
    try {
            const res = await axios({
              method: 'POST',
              url: 'http://localhost:7700/api/v1/users/login',
              data: {
                email,
                Password
              }
            });
            
            if(res.data.status==="success"){
              alert('success Logged in successfully!')
              window.setTimeout(()=>{
                location.assign('http://localhost:7700/')
            },1000)
            }
          
      }catch (err) {
        alert('error', err.response.data.message);
      }
}

export const userSignup =async(name,email,photo,Password,Confirmpassword)=>{
  console.log(name,email,photo,Password,Confirmpassword)
    try{
      if(Password===Confirmpassword){
        const res = await axios({
          method:'POST',
          url: 'http://localhost:7700/api/v1/users//signup',
          data:{
              name,
              email,
              photo,
              Password,
              Confirmpassword
          }
        })
    if(res.data.status==="success"){
      alert('User Registerd  in successfully!')
      window.setTimeout(()=>{
        location.assign('http://localhost:7700/api/v1/users/login')
    },100)
    }

      }else{
        alert('Password and Confirmpassword are not match')
      }
    }catch(err){
      alert(err)
    }

}

export const logout =async()=>{
     console.log("i am the click")
   try{
         const res = await axios({
           method:'GET',
           url:'http:localhost:7700/api/v1/users/logout'
         })
         console.log(res.data.status)
         if(res.data.status==="success"){
           alert('success Logout in successfully!')
           location.reload(true)
         }
   }catch(err){
     alert('error LOGOUT  Error! TRY AGAIN');
   }
 }