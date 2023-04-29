import { signup, duplication } from "../commons/firebase.js";

const $signupForm = document.querySelector(".signup-form");
const $inputNickname = $signupForm.querySelector("#input-nickname");
const $nicknameMsg = $signupForm.querySelector("#input-nickname+.input-msg");
const $inputEmail = $signupForm.querySelector("#input-email");
const $emailMsg = $signupForm.querySelector("#input-email+.input-msg");
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
const duplicated = {nickname: true, email: true}

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
  const password = $inputPw.value;
  const passwordChk = $inputPwChk.value;

  if (!nickname) showError($nicknameMsg, "닉네임을 입력해주세요!");
  if (!email) showError($emailMsg, "이메일을 입력해주세요!");
  if (!password) showError($passwordMsg, "비밀번호를 입력해주세요!");
  if (password !== passwordChk) showError($passwordChkMsg, "비밀번호가 일치하지 않습니다!");
  if (!passwordChk) showError($passwordChkMsg, "비밀번호 확인을 입력해주세요!");

  if (nicknameReg.test(nickname)&&emailReg.test(email)&&passwordReg.test(password)&&
  password===passwordChk&&!duplicated.nickname&&!duplicated.email) {
    $loadingModal.classList.add("active");
    signup($inputNickname.value, $inputEmail.value, $inputPw.value).then(()=>{
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


