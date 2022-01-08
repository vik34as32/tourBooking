import '@babel/polyfill'
import {login,logout,userSignup} from './Login'
import {updateData} from './updateSetting'



const LoginForm =document.querySelector('.form--login')
const loOutBtn = document.querySelector('.nav__el--logout')
// const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm =document.querySelector('.form-user-password')
const bookbtn =document.getElementById('book-tour')
const SignForm = document.querySelector('.form--SignUp')



if(LoginForm){
    LoginForm.addEventListener('submit',e=>{
        e.preventDefault()
        const email =document.getElementById('email').value
        const Password =document.getElementById('password').value
        login(email,Password) 
    })
}

if(loOutBtn){
    loOutBtn.addEventListener('click',logout)
}


// if(userDataForm){
//     userDataForm.addEventListener('submit',e=>{
//         e.preventDefault()
//         const name =document.getElementById('name').value
//         const email =document.getElementById('email').value
//         const photo = document.getElementById('photo').files[0]
//         console.log(photo)

//         updateData({name,email,photo},'data')
//     })
// }

if(SignForm){
    SignForm.addEventListener('submit',(event)=>{
        event.preventDefault()
        const name =document.getElementById('name').value
        const email =document.getElementById('email').value
        const photo = document.getElementById('photo').files[0]
        const Password =document.getElementById('password').value
        const ConfirmPassword =document.getElementById('ConfirmPassword').value
        userSignup(name,email,photo,Password,ConfirmPassword)
    })
}


 if(userPasswordForm){
     userPasswordForm.addEventListener('submit',e=>{
         e.preventDefault()
         const password_current =  document.getElementById('password_current').value
         const password = document.getElementById('password').value
         const password_confirm = document.getElementById('password_confirm').value
         updateData(password_current,password,password_confirm )
     })
 }


 if(bookbtn){
    bookbtn.addEventListener('click',e=>{
        e.target.textContent ='Processing...'
        const tourId =e.target.dataset
        bookTour(tourId)
    })
 }