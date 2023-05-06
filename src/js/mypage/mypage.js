import { userData } from "../commons/commons.js";
import {
  editIntroduce,
  applyProfileImg,
  FetchUserData,
  changePassword,
  changeUserPassword,
} from "../commons/firebase.js";

const $sectionContents = document.querySelector(".section-contents");
const $changeIntroduceBtn = $sectionContents.querySelector(
  ".btn-changeIntroduce"
);
const $introduceModal = $sectionContents.querySelector(".introduce-modal");
const $introduceSubmitBtn = $introduceModal.querySelector(".btn-submit");
const $introduceCancleBtn = $introduceModal.querySelector(".btn-cancle");
const $inputIntroduce = $introduceModal.querySelector(".input-introduce");
const $textCounter = $introduceModal.querySelector(".text-counter");

const $changeProfileImgBtn = $sectionContents.querySelector(
  ".btn-changeProfileImg"
);
const $profileImgModal = $sectionContents.querySelector(".profileImg-modal");
const $profileImg = $sectionContents.querySelector(".profile-img");
const $profileImgSubmitBtn = $profileImgModal.querySelector(".btn-submit");
const $profileImgCancleBtn = $profileImgModal.querySelector(".btn-cancle");
const $customInput = $profileImgModal.querySelector(".custom-input");
const $inputProfileImg = $profileImgModal.querySelector(".input-profileImg");

const $userEmail = $sectionContents.querySelector(".user-email");
const $userNickname = $sectionContents.querySelector(".user-nickname");
const $userGrade = $sectionContents.querySelector(".user-grade");
const $diaryCount = $sectionContents.querySelector(".diary-count");
const $commentCount = $sectionContents.querySelector(".comment-count");
const $loadingModal = document.querySelector(".loading-modal");

let tempUrl;
let uploadFile;

const userInfo = await FetchUserData(userData.nickname);
$userEmail.textContent = `이메일 : ${userInfo.email} `;
$userNickname.textContent = `닉네임 : ${userInfo.nickname}`;
$userGrade.textContent = `등급 : ${userInfo.grade}`;
$profileImg.setAttribute("src", userData.profileImgURL);
$diaryCount.textContent = `${userInfo.diaryCount}개`;
$commentCount.textContent = `${userInfo.commentCount}개`;

const $passwordModal = $sectionContents.querySelector(".password-modal");
const $changePasswordBtn = $sectionContents.querySelector(
  ".btn-changePassword"
);
const $passwordSubmitBtn = $passwordModal.querySelector(".btn-submit");
const $passwordCancleBtn = $passwordModal.querySelector(".btn-cancle");

// 프로필 이미지 변경 모달창 관련
$changeProfileImgBtn.addEventListener("click", () => {
  $profileImgModal.classList.add("active");
});
$profileImgModal.addEventListener("click", (e) => {
  if (e.target === $profileImgModal || e.target === $profileImgCancleBtn) {
    $profileImgModal.classList.remove("active");
    $customInput.style.backgroundImage = `url(../img/imgUpload.png)`;
    $customInput.style.backgroundSize = "120px";
  }
});
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
  console.log(URL.createObjectURL(uploadFile));
  $customInput.style.backgroundImage = `url(${tempUrl})`;
  $customInput.style.backgroundSize = "contain";
});

$profileImgSubmitBtn.addEventListener("click", async () => {
  $loadingModal.classList.add("active");
  await applyProfileImg(uploadFile);
  $loadingModal.classList.remove("active");
});

// 소개글 수정 모달창 관련
$changeIntroduceBtn.addEventListener("click", () => {
  $inputIntroduce.value = userData.introduce;
  $textCounter.textContent = `${userData.introduce.length}/300`;
  $introduceModal.classList.add("active");
  $inputIntroduce.focus();
});

$introduceModal.addEventListener("click", (e) => {
  if (e.target === $introduceModal || e.target === $introduceCancleBtn)
    $introduceModal.classList.remove("active");
});

$introduceCancleBtn.addEventListener("keydown", (e) => {
  if (e.keyCode === 9 && e.shiftKey) {
    e.preventDefault(); // 기본 이벤트 취소
    $introduceSubmitBtn.focus(); // $introduceSubmitBtn에 포커스 이동
  } else if (e.keyCode === 9) {
    e.preventDefault();
    $inputIntroduce.focus();
  }
});

$inputIntroduce.addEventListener("input", (e) => {
  $textCounter.textContent = `${e.target.value.length}/300`;
});

$inputIntroduce.addEventListener("keydown", (e) => {
  if (e.keyCode === 9 && e.shiftKey) {
    e.preventDefault();
    $introduceCancleBtn.focus();
  }
});

$introduceSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!$inputIntroduce.value.trim()) {
    alert("입력된 내용이 없습니다!");
    return;
  }
  if ($inputIntroduce.value === userData.introduce) {
    alert("수정된 내용이 없습니다!");
    return;
  }
  // 데이터 전송로직
  await editIntroduce($inputIntroduce.value);
  userData.introduce = $inputIntroduce.value;
  sessionStorage.setItem("userData", JSON.stringify(userData));
  alert("수정이 완료되었습니다.");
  location.reload();
});

// 비밀번호 변경 모달창

$changePasswordBtn.addEventListener("click", () => {
  $passwordModal.classList.add("active");
});
$passwordModal.addEventListener("click", (e) => {
  if (e.target === $passwordModal || e.target === $passwordCancleBtn) {
    $passwordModal.classList.remove("active");
  }
});
