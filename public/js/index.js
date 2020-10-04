
import '@babel/polyfill'
import {login} from './login';
import {logout} from './login';
import{displayMap} from './mapbox';
//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBTn=document.querySelector('.nav__el--logout');
//DELEGATION
if(mapBox){
 const locations=JSON.parse(mapBox.dataset.locations);
 displayMap(locations);
}
if(loginForm){
 loginForm.addEventListener('submit',e=>{
  e.preventDefault();
  //VALUES
const email=document.getElementById('email').value;
const password=document.getElementById('password').value;
  login(email,password);
 
 });
};

if(logoutBTn) {
 logoutBTn.addEventListener('click',logout)};