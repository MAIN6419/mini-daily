import { signup, duplication } from "../firebase/auth/firebase_auth.js";

import "../../css/signup.css";

const $signupForm = document.querySelector(".signup-form");
const $inputNickname = $signupForm.querySelector("#input-nickname");
const $nicknameMsg = $signupForm.querySelector("#input-nickname+.input-msg");
const $inputEmail = $signupForm.querySelector("#input-email");
const $emailMsg = $signupForm.querySelector("#input-email+.input-msg");
const $inputPhone = $signupForm.querySelector("#input-phone");
const $phoneMsg = $signupForm.querySelector("#input-phone+.input-msg");
const $inputPw = $signupForm.querySelector("#input-password");
const $passwordMsg = $signupForm.querySelector("#input-password+.input-msg");
const $inputPwChk = $signupForm.querySelector("#input-passwordChk");
const $passwordChkMsg = $signupForm.querySelector(
  "#input-passwordChk+.input-msg"
);
const $signupBtn = $signupForm.querySelector(".btn-signup");
const $loadingModal = document.querySelector(".loading-modal");


const emailReg = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const nicknameReg = /^[a-zA-z0-9]{4,12}$/;
const passwordReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
const phoneReg = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;
const duplicated = {nickname: true, email: true, phone: true}

$inputNickname.addEventListener("input", (e) =>
  vaildation(
    e,
    nicknameReg,
    $nicknameMsg,
    "4~12자 영문, 영문+숫자를 입력해주세요!"
  )
);
$inputNickname.addEventListener("blur", async (e)=>{
    const nickname = e.target.value;
    if (!nicknameReg.test(nickname)) return;
    duplicated.nickname = await duplication(nickname, "nickname");
    if(duplicated.nickname) {
      $nicknameMsg.classList.add("err");
      $nicknameMsg.textContent = '이미 사용중인 닉네임 입니다!';
    }
    else{
      $nicknameMsg.classList.add("vaild");
      $nicknameMsg.textContent = '사용 가능한 닉네임 입니다.';
    }
})

$inputEmail.addEventListener("input", (e) =>
  vaildation(e, emailReg, $emailMsg, "이메일 형식을 확인해주세요!")
);

$inputEmail.addEventListener("blur", async (e)=>{
  const email = e.target.value;
  if (!emailReg.test(email)) return;
  duplicated.email = await duplication(email, "email");
  if(duplicated.email) {
    $emailMsg.classList.add("err");
    $emailMsg.textContent = '이미 사용중인 이메일 입니다!';
  }
  else{
    $emailMsg.classList.add("vaild");
    $emailMsg.textContent = '사용 가능한 이메일 입니다.';
  }
})
$inputPw.addEventListener("input", (e) =>
  vaildation(
    e,
    passwordReg,
    $passwordMsg,
    "8~16자 영문, 숫자, 특수문자를 사용하세요."
  )
);
$inputPwChk.addEventListener("input", () => {
  if ($inputPw.value === $inputPwChk.value) {
    $passwordChkMsg.classList.remove("err");
    $passwordChkMsg.textContent = "";
  } else {
    $passwordChkMsg.classList.add("err");
    $passwordChkMsg.textContent = "비밀번호가 일치하지 않습니다!";
  }
});

$signupBtn.addEventListener("click", () => {
  const nickname = $inputNickname.value;
  const email = $inputEmail.value;
  const phone = $inputPhone.value;
  const password = $inputPw.value;
  const passwordChk = $inputPwChk.value;

  if (!nickname) showError($nicknameMsg, "닉네임을 입력해주세요!");
  if (!email) showError($emailMsg, "이메일을 입력해주세요!");
  if (!phone) showError($phoneMsg, "휴대폰 번호를 입력해주세요!");
  if (!password) showError($passwordMsg, "비밀번호를 입력해주세요!");
  if (password !== passwordChk) showError($passwordChkMsg, "비밀번호가 일치하지 않습니다!");
  if (!passwordChk) showError($passwordChkMsg, "비밀번호 확인을 입력해주세요!");

  if (nicknameReg.test(nickname)&&emailReg.test(email)&&passwordReg.test(password)&&phoneReg.test(phone)&&
  password===passwordChk&&!duplicated.nickname&&!duplicated.email&&!duplicated.phone) {
    $loadingModal.classList.add("active");
    const newUser = {
      nickname : $inputNickname.value,
      email : $inputEmail.value,
      phone: $inputPhone.value.replace(/-/g,""),
      password: $inputPw.value
    }
    signup(newUser).then(()=>{
      $loadingModal.classList.remove("active");
    })
  }
});

function showError(targetMsg, text) {
  targetMsg.classList.add("err");
  targetMsg.textContent = text;
}

function vaildation(e, reg, targetMsg, text) {
  targetMsg.classList.remove("vaild");
  if (reg.test(e.target.value)) {
    targetMsg.classList.remove("err");
    targetMsg.textContent = "";
  } else {
    targetMsg.classList.add("err");
    targetMsg.textContent = text;
  }
}

$signupBtn.addEventListener("mouseover", async(e)=>{
  e.currentTarget.focus();
})

$inputPhone.addEventListener("input", (e)=>{
  e.target.value = e.target.value.replace(/[^0-9]/g, '')
  .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  vaildation(e, phoneReg, $phoneMsg, "유효한 휴대폰 번호를 입력해주세요!")
})

$inputPhone.addEventListener("blur", async (e)=>{
  const phone = e.target.value;
  if (!phoneReg.test(phone)) return;
  duplicated.phone = await duplication(phone.replace(/-/g,""), "phone");
  if(duplicated.phone) {
    $phoneMsg.classList.add("err");
    $phoneMsg.textContent = '이미 사용중인 휴대폰 번호 입니다!';
  }
  else{
    $phoneMsg.classList.add("vaild");
    $phoneMsg.textContent = '사용 가능한 휴대폰 번호  입니다.';
  }
})

// 키보드 접근성 고려
$inputNickname.addEventListener("keydown", (e)=>{
  if(e.keyCode===9&&e.shiftKey){
    e.preventDefault();
    $signupBtn.focus();
  }
})
$signupBtn.addEventListener("keydown",(e)=>{
  if(e.keyCode===9&&e.shiftKey){
    e.preventDefault();
    $inputPwChk.focus();
  }
  else if(e.keyCode===9){
    e.preventDefault();
    $inputNickname.focus();
  }

})




