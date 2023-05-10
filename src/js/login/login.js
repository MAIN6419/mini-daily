import { login } from "../commons/firebase.js";
if (window.navigator.msSaveOrOpenBlob) {
  alert("이 기능은 인터넷 익스플로러에서 지원되지 않습니다. 다른 브라우저를 사용해주세요.");
}
const $loginForm = document.querySelector(".login-form");
const $inputEmail = $loginForm.querySelector("#input-email");
const $inputPw = $loginForm.querySelector("#input-password");
const $loginBtn = $loginForm.querySelector(".btn-login");
const $loadingModal = document.querySelector(".loading-modal");
const $signUpLink = document.querySelector(".signup-link");
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
$inputEmail.addEventListener("keydown", (e) => {
  if(e.keyCode===9&&e.shiftKey){
    e.preventDefault();
    $signUpLink.focus();
  }
});
$signUpLink.addEventListener("keydown",(e)=>{
  if(e.keyCode===9){
    e.preventDefault();
    $inputEmail.focus();
  }
  if(e.keyCode===9&&e.shiftKey){
    e.preventDefault();
    $loginBtn.focus();
  }
})
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
