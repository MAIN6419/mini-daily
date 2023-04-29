
import { login } from "../commons/firebase.js";
import { sessionUserData } from "../commons/firebase.js";
const $loginForm = document.querySelector(".login-form");
const $inputEmail = $loginForm.querySelector("#input-email");
const $inputPw = $loginForm.querySelector("#input-password");
const $loginBtn = $loginForm.querySelector(".btn-login");


$inputEmail.addEventListener("input",(e)=>{
  e.target.value = e.target.value.trim();
})
$inputPw.addEventListener("input",(e)=>{
  e.target.value = e.target.value.trim();
})

$loginBtn.addEventListener("click", async ()=>{
  if(!$inputEmail.value){
    alert("이메일을 입력해주세요!");
    return;
  }
  if(!$inputPw.value){
    alert("비밀번호를 입력해주세요!");
    return;
  }
  // 로그인 확인 로직
  await login($inputEmail.value, $inputPw.value).then(()=>{
    sessionStorage.setItem('user',JSON.parse(sessionUserData()).displayName)
    location.replace('/src/template/home.html');
   });
   
})