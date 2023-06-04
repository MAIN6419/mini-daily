import "../../css/mypage.css";
import {
  FetchUserData,
  applyProfileImg,
  changeUserPassword,
  currentUser,
  editIntroduce,
  getSessionUser,
} from "../firebase/auth/firebase_auth.js";
import "../../img/profile.png";
import { keyBoardFocutOPT } from "../commons/libray";
const $sectionContents = document.querySelector(".section-contents");
const $changeIntroduceBtn = $sectionContents.querySelector(
  ".btn-changeIntroduce"
);
const $introduceModal = $sectionContents.querySelector(".introduce-modal");
const $introduceDim = $introduceModal.querySelector(".dim");
const $introduceSubmitBtn = $introduceModal.querySelector(".btn-submit");
const $introduceCancelBtn = $introduceModal.querySelector(".btn-cancel");
const $inputIntroduce = $introduceModal.querySelector(".input-introduce");
const $textCounter = $introduceModal.querySelector(".text-counter");

const $changeProfileImgBtn = $sectionContents.querySelector(
  ".btn-changeProfileImg"
);
const $profileImgModal = $sectionContents.querySelector(".profileImg-modal");
const $profileImglDim = $profileImgModal.querySelector(".dim");
const $profileImg = $sectionContents.querySelector(".profile-img");
const $profileImgSubmitBtn = $profileImgModal.querySelector(".btn-submit");
const $profileImgCancelBtn = $profileImgModal.querySelector(".btn-cancel");
const $customInput = $profileImgModal.querySelector(".custom-input");
const $inputProfileImg = $profileImgModal.querySelector(".input-profileImg");

const $userEmail = $sectionContents.querySelector(".user-email");
const $userNickname = $sectionContents.querySelector(".user-nickname");
const $userGrade = $sectionContents.querySelector(".user-grade");
const $userPoint = $sectionContents.querySelector(".user-point");
const $userDiary = $sectionContents.querySelector(".user-diary");
const $userComment = $sectionContents.querySelector(".user-Comment");

const $gradeInfoBtn = $sectionContents.querySelector(".btn-gradeInfo");
const $gradeModalCloseBtn = $sectionContents.querySelector(".btn-close");
const $gradeModal = $sectionContents.querySelector(".grade-modal");
const $gradeModalDim = $gradeModal.querySelector(".dim");
const $currentGrade = $gradeModal.querySelector(".current-grade");
const $nextLevelPoint = $gradeModal.querySelector(".next-levelpoint");

const $loadingModal = document.querySelector(".loading-modal");

const userData = getSessionUser();
let tempUrl;
let uploadFile;
const host = window.location.host;
let baseUrl = "";
if (host.includes("github.io")) {
  baseUrl = "/mini-diary";
}

(async function renderMypage() {
  $loadingModal.classList.add("active");
  const userInfo = await FetchUserData(userData.displayName);
  $userEmail.textContent = `이메일 : ${userInfo.email} `;
  $userNickname.textContent = `닉네임 : ${userInfo.nickname}`;
  $userGrade.textContent = `등급 : ${userInfo.grade}`;
  $userPoint.textContent = `포인트 : ${userInfo.point}점`;
  $profileImg.setAttribute("src", userData.photoURL || `./img/profile.png`);
  $userDiary.textContent = `다이어리 : ${userInfo.diaryCount}개`;
  $userComment.textContent = `댓글 : ${userInfo.commentCount}개`;
  $currentGrade.textContent = `나의 현재 등급 : ${userInfo.grade}`;
  let nextLevelPoint;
  if(userInfo.grade==="VIP") {
    nextLevelPoint = '0';
  } else if(userInfo.grade==="프로") {
    nextLevelPoint = 1000 - userInfo.point;
  } else if(userInfo.grade==="우수") {
    nextLevelPoint = 500 - userInfo.point;
  } else {
    nextLevelPoint = 100 - userInfo.point;
  }
 $nextLevelPoint.textContent = `등업까지 남은 포인트 : ${nextLevelPoint} point`
  $loadingModal.classList.remove("active");
})();

const $passwordModal = $sectionContents.querySelector(".password-modal");
const $passwordModalDim = $passwordModal.querySelector(".dim");
const $changePasswordBtn = $sectionContents.querySelector(
  ".btn-changePassword"
);
const $inputCurrentPw = $passwordModal.querySelector("#input-currentPw");
const $inputNewPw = $passwordModal.querySelector("#input-newPw");
const $inputChkNewPw = $passwordModal.querySelector("#input-chkNewPw");
const $passwordSubmitBtn = $passwordModal.querySelector(".btn-submit");
const $passwordCancelBtn = $passwordModal.querySelector(".btn-cancel");
const passwordReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

// 프로필 이미지 변경 모달창 관련
$changeProfileImgBtn.addEventListener("click", () => {
  $profileImgModal.classList.add("active");
  $customInput.focus();
});
$profileImgCancelBtn.addEventListener("click", (e) => {
    $profileImgModal.classList.remove("active");
    $customInput.style.backgroundImage = `url(./img/imgUpload.png)`;
    $customInput.style.backgroundSize = "120px";
});
$profileImglDim.addEventListener("click",()=>{
  $profileImgCancelBtn.click();
})
$customInput.addEventListener("click", () => {
  $inputProfileImg.click();
});

$inputProfileImg.addEventListener("change", (e) => {
  // 이미지 유효성 검사 및 임시 이미지 적용
  const currentUploadFile = e.target.files?.[0];
  if (!currentUploadFile) return;
  if (
    !currentUploadFile?.type.includes("jpeg") &&
    !currentUploadFile?.type.includes("png") &&
    !currentUploadFile?.type.includes("jpg")
  ) {
    alert("파일 형식을 확인해주세요!");
    return;
  }
  if (currentUploadFile.size > 5 * 1024 * 1024) {
    alert("파일의 크기가 큽니다. (제한: 5MB)");
    return;
  }
  uploadFile = currentUploadFile;
  tempUrl = URL.createObjectURL(uploadFile);
  $customInput.style.backgroundImage = `url(${tempUrl})`;
  $customInput.style.backgroundSize = "contain";
});

$profileImgSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  $loadingModal.classList.add("active");
  await applyProfileImg(uploadFile);
  $loadingModal.classList.remove("active");
});

// 키보드 focus 접근성 고려
$customInput.addEventListener("keydown", (e) =>
  keyBoardFocutOPT(e, $profileImgCancelBtn)
);
$profileImgCancelBtn.addEventListener("keydown", (e) =>
  keyBoardFocutOPT(e, $profileImgSubmitBtn, $customInput)
);

// 소개글 수정 모달창 관련
$changeIntroduceBtn.addEventListener("click", () => {
  const introduce = JSON.parse(sessionStorage.getItem("userData")).introduce;
  $inputIntroduce.value = introduce;
  $textCounter.textContent = `${introduce.length}/150`;
  $introduceModal.classList.add("active");
  $inputIntroduce.focus();
});

$introduceCancelBtn.addEventListener("click", (e) => {
    $introduceModal.classList.remove("active");
});
$introduceDim.addEventListener("click",()=>{
  $introduceModal.classList.remove("active");
})
$inputIntroduce.addEventListener("input", (e) => {
  $textCounter.textContent = `${e.target.value.length}/150`;
});

$introduceSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  if (!$inputIntroduce.value.trim()) {
    alert("입력된 내용이 없습니다!");
    return;
  }
  if ($inputIntroduce.value === userData.introduce) {
    alert("수정된 내용이 없습니다!");
    return;
  }
  if (confirm("정말 수정하시겠습니까?")) {
    // 데이터 전송로직
    await editIntroduce($inputIntroduce.value);
    userData.introduce = $inputIntroduce.value;
    sessionStorage.setItem("userData", JSON.stringify(userData));
    alert("수정이 완료되었습니다.");
    location.reload();
  }
});

// 키보드 focus 접근성 고려
$introduceCancelBtn.addEventListener("keydown", (e) =>
  keyBoardFocutOPT(e, $introduceSubmitBtn, $inputIntroduce)
);

$inputIntroduce.addEventListener("keydown", (e) =>
  keyBoardFocutOPT(e, $introduceCancelBtn)
);

// 비밀번호 변경 모달창

$changePasswordBtn.addEventListener("click", () => {
  $passwordModal.classList.add("active");
  $inputCurrentPw.focus();
});
$passwordCancelBtn.addEventListener("click", (e) => {
    $passwordModal.classList.remove("active");
    $inputCurrentPw.value = "";
    $inputNewPw.value = "";
    $inputChkNewPw.value = "";
});
$passwordModalDim.addEventListener("click",()=>{
  $passwordCancelBtn.click();
})

$passwordSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!$inputCurrentPw.value) {
    alert("현재 비밀번호를 입력해주세요!");
    return;
  }
  if (!$inputNewPw.value) {
    alert("새 비밀번호를 입력해주세요!");
    return;
  }
  if (!$inputChkNewPw.value) {
    alert("새 비밀번호 확인을 입력해주세요!");
    return;
  }
  if (
    !passwordReg.test($inputCurrentPw.value) &&
    !passwordReg.test($inputNewPw.value)
  ) {
    alert("비밀번호는 8~16자 영문, 숫자, 특수문자를 사용하세요.");
    return;
  }
  if ($inputNewPw.value !== $inputChkNewPw.value) {
    alert("비밀번호가 일치하지 않습니다!");
    return;
  }
  // 비밀번호 변경로직
  $loadingModal.classList.add("active");
  const res = await changeUserPassword(
    $inputCurrentPw.value,
    $inputNewPw.value
  );
  $loadingModal.classList.remove("active");
  $passwordModal.classList.remove("active");
  if (!res) {
    $inputCurrentPw.value = "";
    $inputNewPw.value = "";
    $inputChkNewPw.value = "";
  }
});

// 키보드 focus 접근성 고려
$inputCurrentPw.addEventListener("keydown", (e) =>
  keyBoardFocutOPT(e, $passwordCancelBtn)
);
$passwordCancelBtn.addEventListener("keydown", (e) =>
  keyBoardFocutOPT(e, $introduceSubmitBtn, $introduceCancelBtn)
);

// 등업 정보 모달창 관련



$gradeInfoBtn.addEventListener("click",()=>{
  $gradeModal.classList.add("active");
})
$gradeModalCloseBtn .addEventListener("click",()=>{
  $gradeModal.classList.remove("active");
})
$gradeModalDim.addEventListener("click",()=>{
  $gradeModal.classList.remove("active");
})

$gradeModalCloseBtn.addEventListener("keydown", (e)=>{
  if(e.keyCode===9){
    e.preventDefault();
  }
})