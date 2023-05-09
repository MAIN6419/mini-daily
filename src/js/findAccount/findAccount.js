import { findEmail, changePassword } from "../commons/firebase.js";

const $emailFormBtn = document.querySelector(".btn-emailForm");
const $pwFormBtn = document.querySelector(".btn-pwForm");

const $findEmailForm = document.querySelector(".findEmail-form");
const $inputNicknameBox = $findEmailForm.querySelector(".input-nicknameBox");
const $inputNickname = $inputNicknameBox.querySelector("#input-nickname");
const $nicknameMsg = $inputNicknameBox.querySelector("#input-nickname+.input-msg");
const $inputPhoneBox = $findEmailForm.querySelector(".input-phoneBox");
const $inputPhone = $inputPhoneBox.querySelector("#input-phone");
const $phoneMsg = $inputPhoneBox.querySelector("#input-phone+.input-msg");
const $findEmailBtn = $findEmailForm.querySelector(".btn-findEmail");
const $findResult = $findEmailForm.querySelector(".find-result");

const $changePwForm = document.querySelector(".changePw-form");
const $inputEmailBox = $changePwForm.querySelector(".input-emailBox");
const $inputEmail = $inputEmailBox.querySelector("#input-email");
const $emailMsg = $inputEmailBox.querySelector("#input-email+.input-msg");
const $pwInputPhoneBox = $changePwForm.querySelector(".input-phoneBox");
const $pwInputPhone = $pwInputPhoneBox.querySelector("#input-phone");
const $pwPhoneMsg = $pwInputPhoneBox.querySelector("#input-phone+.input-msg");
const $changePwBtn = $changePwForm.querySelector(".btn-changePw");
const $changeResult = $changePwForm.querySelector(".change-result");

const emailReg = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const nicknameReg = /^[a-zA-z0-9]{4,12}$/;
const phoneReg = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;

// 인풋 메세지 출력 함수
function showError(targetMsg, text) {
  targetMsg.classList.add("active");
  targetMsg.textContent = text;
}

// 유효성 검사 함수
function vaildation(e, reg, targetMsg, text) {
  if (reg.test(e.target.value)) {
    targetMsg.classList.remove("active");
    targetMsg.textContent = "";
  } else {
    targetMsg.classList.add("active");
    targetMsg.textContent = text;
  }
}

// 폼 초기화 함수들
function clearInputs(...input) {
  for (const i in input) {
    input[i].value = "";
  }
}
function toggleInputBoxes(...inputBox){
  for (const i in inputBox) {
    inputBox[i].classList.toggle("active");
  }
}
function toggleForms(...form) {
  for (const i in form) {
    form[i].classList.toggle("active");
  }
}
function toggleBtn(...btn) {
  for (const i in btn) {
    btn[i].classList.toggle("active");
  }
}
function clearMsg(...msg) {
  for (const i in msg) {
    msg[i].classList.remove("active");
    msg[i].textContent = "";
  }
}
function toggleResult(text, ...result) {
  for (const i in result) {
    result[i].classList.add("active");
    result[i].textContent = text;
  }
}

//  폼 초기화 함수들 합친 함수
function initalForm(e) {
  // 폼과 버튼 활성화/비활성화
  toggleBtn($emailFormBtn, $pwFormBtn);
  toggleForms($findEmailForm, $changePwForm);
  // 현재 폼에 맞는 인풋 활성화, 인풋 메세지 초기화
  if (e.currentTarget === $emailFormBtn) {
    clearInputs($inputNickname, $inputPhone);
    clearMsg($nicknameMsg, $phoneMsg);
  } else if (e.currentTarget === $pwFormBtn) {
    clearInputs($inputEmail, $pwInputPhone);
    clearMsg($emailMsg, $pwPhoneMsg);
  }
}

// 폼 변경 버튼
$emailFormBtn.addEventListener("click", (e) => initalForm(e));
$pwFormBtn.addEventListener("click", (e) => initalForm(e));

// 이메일 찾기 폼 이벤트들
$inputNickname.addEventListener("input", (e) => {
  e.target.value = e.target.value.trim();
  vaildation(e, nicknameReg, $nicknameMsg,"닉네임은 4-12자 영문, 영문+숫자 입니다!");
});

$inputPhone.addEventListener("input", (e) => {
  e.target.value = e.target.value
    .replace(/[^0-9]/g, "")
    .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    vaildation(e, phoneReg, $phoneMsg, "유효한 휴대폰 번호를 입력해주세요!");
});
const findEmailEvent = () => {
  if (!$inputNickname.value) {
    showError($nicknameMsg, "닉네임을 입력해주세요!");
  }
  if (!$inputPhone.value) {
    showError($phoneMsg, "휴대폰 번호를 입력해주세요!");
    return;
  }
  if (
    nicknameReg.test($inputNickname.value) &&
    phoneReg.test($inputPhone.value)
  ) {
    findEmail($inputNickname.value, $inputPhone.value.replace(/-/g, "")).then(
      (res) => {
        if (res) {
          toggleInputBoxes($inputNicknameBox, $inputPhoneBox);
          toggleResult(`찾으시는 이메일은 ${res} 입니다.`, $findResult)
          $findEmailBtn.removeEventListener("click", findEmailEvent);
          $findEmailBtn.addEventListener("click", () =>
            location.replace("../../")
          );
          $findEmailBtn.textContent = "로그인하러 가기";
        } else {
          clearInputs($inputNickname, $inputPhone);
        }
      }
    );
  }
};
$findEmailBtn.addEventListener("click", findEmailEvent);

// 비밀번호 변경 폼 이벤트들
$inputEmail.addEventListener("input", (e) => {
  e.target.value = e.target.value.trim();
  vaildation(e, emailReg, $emailMsg, "이메일 형식이 올바르지 않습니다!");
});
$pwInputPhone.addEventListener("input", (e) => {
  e.target.value = e.target.value
    .replace(/[^0-9]/g, "")
    .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  vaildation(e, phoneReg, $pwPhoneMsg, "유효한 휴대폰 번호를 입력해주세요!");
});

const findPwEvent = () => {
  if (!$inputEmail.value) {
    showError($emailMsg, "이메일을 입력해주세요!");
  }
  if (!$pwInputPhone.value) {
    showError($pwPhoneMsg, "휴대폰 번호를 입력해주세요!");
  }
  if (emailReg.test($inputEmail.value) && phoneReg.test($pwInputPhone.value)) {
    changePassword(
      $inputEmail.value,
      $pwInputPhone.value.replace(/-/g, "")
    ).then((res) => {
      if (res) {
        toggleInputBoxes($inputEmailBox, $pwInputPhoneBox);
        toggleResult('가입된 메일로 비밀번호 변경 메일을 발송하였습니다.\n메일이 없을 경우 스팸 메일함을 확인해주세요.',$changeResult)
        $changePwBtn.removeEventListener("click", findPwEvent);
        $changePwBtn.addEventListener("click", () =>
          location.replace("../../")
        );
        $changePwBtn.textContent = "로그인하러 가기";
      } else {
        clearInputs($inputEmail, $pwInputPhone);
      }
    });
  }
};
$changePwBtn.addEventListener("click", findPwEvent);

// 키보드 접근성 고려
$emailFormBtn.addEventListener("keydown",(e)=>{
  if(e.keyCode===9&&e.shiftKey){
    e.preventDefault();
    $findEmailBtn.focus();
  }
})
$findEmailBtn.addEventListener("keydown", (e)=>{
  if(e.keyCode===9&&e.shiftKey){
    e.preventDefault();
    $inputPhone.focus();
  }
  else if(e.keyCode===9){
    e.preventDefault();
    $emailFormBtn.focus();
  }
})
