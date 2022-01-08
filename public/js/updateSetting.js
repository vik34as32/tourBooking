  import axios from "axios"

  export const updateData =async(password_current,password,password_confirm)=>{
    
         console.log(password_current,password,password_confirm)
         try{
             const res = await axios({
                 method:'PATCH',
                 url:'http:localhost:7700/api/v1/users/updatePassword',
                 data:{
                    password_current:password_current,
                    password:password,
                    password_confirm:password_confirm
                 }
             });
             if(res.data.status==="success"){
                alert("data is updated SucessFully")
                  window.setTimeout(()=>{
                  location.assign('http:localhost:7700/me')
                  },2000)
             }
         }catch(err){
             alert("Error Data is NoteUpdated ")
         }
  }