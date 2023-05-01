import { login } from "../commons/firebase.js";
const $loginForm = document.querySelector(".login-form");
const $inputEmail = $loginForm.querySelector("#input-email");
const $inputPw = $loginForm.querySelector("#input-password");
const $loginBtn = $loginForm.querySelector(".btn-login");

if (sessionStorage.getItem("userData")){
  alert("이미 로그인 되어있습니다!");
  location.href = '/src/template/home.html';
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
  await login($inputEmail.value, $inputPw.value);
});
