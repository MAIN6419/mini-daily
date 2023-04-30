import { findEmail, findPassword } from "../commons/firebase.js";

const $findEmailBtn = document.querySelector(".btn-findEmail");
const $findPWBtn = document.querySelector(".btn-findPw");
const $inputNickname = document.querySelector("#input-nickname");
const $inputPhone = document.querySelector("#input-phone");
const $findAccountBtn = document.querySelector(".btn-findAccount");

$inputNickname.addEventListener("input", (e)=>{
  e.target.value = e.target.value.trim();
})
$inputPhone.addEventListener("input", (e)=>{
  e.target.value = e.target.value.replace(/[^0-9]/g, '')
  .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
})

$findEmailBtn.addEventListener("click",()=>{
  $findPWBtn.classList.remove("active");
  $findEmailBtn.classList.add("active");
  $inputNickname.value = "";
  $inputPhone.value = "";
  $findAccountBtn.textContent = "이메일 찾기";
  $findAccountBtn.removeEventListener("click", ()=>findPassword($inputNickname.value, $inputPhone.value.replace(/-/g,"")));
  $findAccountBtn.addEventListener("click", ()=>findEmail($inputNickname.value, $inputPhone.value.replace(/-/g,"")));
})

$findPWBtn.addEventListener("click",()=>{
  $findEmailBtn.classList.remove("active");
  $findPWBtn.classList.add("active");
  $inputNickname.value = "";
  $inputPhone.value = "";
  $findAccountBtn.textContent = "비밀번호 찾기";
  $findAccountBtn.removeEventListener("click", ()=>findEmail($inputNickname.value, $inputPhone.value.replace(/-/g,"")));
  $findAccountBtn.addEventListener("click", ()=>findPassword($inputNickname.value, $inputPhone.value.replace(/-/g,"")));
})
