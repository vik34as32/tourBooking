  import axios from 'axios';
const stripe =require('pk_live_51JnGFcSEfwHPERsWOWsUYlxy0pV2FxnOjI1g7S8xSfjNe0vW3pJuBSlmrTsBaZ6AX7Ur2LdnfvjBYeNFYWtKFf1h00QRZ43ZeD');

export const bookTour =tourId=>{
   try{
        //1)get check out sessio from API
        const session =await axios(
            `http://localhost:7700/api/v1/bookings/checkout_session/${tourId}`
            )
        //2)create checkout from + charge credit card
         await stripe.redirectToCheckout({
            sessionId : session.data.session.id
         })        
   }catch(err){
       console.log(err)
   }
}
