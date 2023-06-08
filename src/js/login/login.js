import { login } from "../firebase/auth/firebase_auth.js";

import "../../css/login.css";

const $loginForm = document.querySelector(".login-form");
const $inputEmail = $loginForm.querySelector("#input-email");
const $inputPw = $loginForm.querySelector("#input-password");
const $loginBtn = $loginForm.querySelector(".btn-login");
const $loadingModal = document.querySelector(".loading-modal");
if (sessionStorage.getItem("userData")){
  alert("이미 로그인 되어있습니다!");
  location.href = '/';
}

$inputEmail.addEventListener("input", (e) => {
    e.target.value = e.target.value.trim();
  });
$inputPw.addEventListener("input", (e) => {
  e.target.value = e.target.value.trim();
});

$loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!$inputEmail.value) {
    alert("이메일을 입력해주세요!");
    return;
  }
  if (!$inputPw.value) {
    alert("비밀번호를 입력해주세요!");
    return;
  }
  // 로그인 확인 로직
  $loadingModal.classList.add("active");
  await login($inputEmail.value, $inputPw.value);
  $inputEmail.value = '';
  $inputPw.value = '';
  $loadingModal.classList.remove("active");
});
