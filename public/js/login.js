import {showAlert} from './alerts';
import { async } from './bundle';
export const login=async(email,password)=>{
 console.log({email,password});
 try{
 const res=await axios({
  method: 'POST',
  url:'http://127.0.0.1:3000/api/v1/users/login',
  data:{
   email,
   password
  }
 });
 if(res.data.status === 'success'){
  showAlert('success',"Logged in Succesfully")
  window.setTimeout(()=>{
   location.assign('/');      //to redirect to homepage use location.assign
  }, 1500);
 }
 }catch(err){
  showAlert('error',err.response.data.message);
 }
}
export const logout =async()=>{
 try{
  const res= await axios({
   method:'GET',
   url:"http://127.0.0.1:3000/api/v1/users/logout"
  });
  if(res.data.status='success'){ location.reload('/');} //this will reload the server 
 }catch(err){
  showAlert('error','Error Logining out! Try again');
 }
}
// "eslint": "^7.8.1",
//     // "eslint-config-airbnb": "^18.2.0",
//     "eslint-config-prettier": "^6.11.0",
//     "eslint-plugin-import": "^2.22.0",
//     "eslint-plugin-jsx-a11y": "^6.3.1",
//     "eslint-plugin-node": "^11.1.0",
//     "eslint-plugin-prettier": "^3.1.4",
//     "eslint-plugin-react": "^7.20.6",
//     "ndb": "^1.1.5",