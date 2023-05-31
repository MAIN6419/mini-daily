"use strict";
import { v4 as uuidv4 } from "uuid";
import { writeDiary, uploadFile } from "../firebase/diary/firebase_diary.js";

import "../../css/write.css";

import { getSessionUser } from "../firebase/auth/firebase_auth.js";
import { getKST } from "../commons/libray.js";
const data = JSON.parse(localStorage.getItem("diary")) || [];

const $sectionContents = document.querySelector(".section-contents");
const $diaryForm = $sectionContents.querySelector(".diary-form");
const $inputTitle = $diaryForm.querySelector("#input-title");
const $inputcontents = $diaryForm.querySelector("#input-contents");
const $submitBtn = $diaryForm.querySelector(".btn-submit");
const $inputUpload = $diaryForm.querySelector("#input-upload");
const $uploadBtn = $diaryForm.querySelectorAll(".btn-upload");
const $previewImg = $diaryForm.querySelectorAll(".preview-img");
const $resetBtn = $diaryForm.querySelectorAll(".btn-reset");
const $loadingModal = $sectionContents.querySelector(".loading-modal");
const $radioInputs = $diaryForm.querySelectorAll("input[name='mood']");

$radioInputs.forEach((el, idx) => {
    el.addEventListener("keydown", (e) => {
      if(e.keyCode === 9 && e.shiftKey && idx===0){
        e.preventDefault();
        $inputcontents.focus();
      } else if (e.keyCode === 9 && e.shiftKey && idx !== 0) {
        e.preventDefault();
        $radioInputs[idx - 1].focus();
      } else if (e.keyCode === 9 && idx!==4) {
        e.preventDefault();
        $radioInputs[idx + 1].focus();
      }
    });
});
$uploadBtn[0].addEventListener("keydown", (e)=>{
  if (e.keyCode === 9 && e.shiftKey) {
    e.preventDefault();
    $radioInputs[4].focus();
  } 
})
const userData = getSessionUser();
const uploadImg = ["", "", ""];
let imgIdx = "0";
(function setTodayDate() {
  const $todayDate = document.querySelector(".today-date");
  const year = getKST().getFullYear();
  const month = `0${getKST().getMonth() + 1}`;
  const date = `0${getKST().getDate()}`;
  const day = ["일", "월", "화", "수", "목", "금", "토"][getKST().getDay()];
  $todayDate.textContent = `${year}.${month.slice(-2)}.${date.slice(
    -2
  )}.(${day})`;
  $todayDate.setAttribute("datetime", getKST());
})();
$submitBtn.addEventListener("click", async () => {
  const $mood = $diaryForm.querySelector('input[name="mood"]:checked');
  // 유효성 검사
  if (!$inputTitle.value.trim()) {
    alert("제목을 입력해주세요!");
    return;
  }
  if (!$inputcontents.value.trim()) {
    alert("내용을 입력해주세요!");
    return;
  }
  if (!$mood) {
    alert("오늘의 기분을 선택해주세요!");
    return;
  }
  if (confirm("정말 작성하시겠습니까?")) {
    $loadingModal.classList.add("active");
    const fileInfo = await uploadFile(uploadImg);
    const id = uuidv4();
    const newDiary = {
      id,
      auth: userData.displayName,
      profileImg: userData.photoURL,
      title: $inputTitle.value,
      contents: $inputcontents.value,
      mood: $mood.value,
      imgURL: fileInfo.url || [],
      imgFileName: fileInfo.fileName || [],
      createdAt: getKST().getTime(),
      empathy: 0,
      accuse: 0,
    };

    await writeDiary(newDiary);
    sessionStorage.setItem("diaryData", JSON.stringify(newDiary));
    $inputTitle.value = "";
    $inputcontents.value = "";
    uploadImg.splice(0);
    $loadingModal.classList.remove("active");
  }
});

$uploadBtn.forEach((el, idx) => {
  el.addEventListener("click", () => {
    $inputUpload.click();
    imgIdx = idx;
  });
});

$resetBtn.forEach((el, idx) => {
  el.addEventListener("click", () => resetImg(idx));
});

function previewImg(e) {
  const file = e.currentTarget.files[0];
  const vaild = validataionImg(file);
  if (!vaild) return;
  const imageSrc = URL.createObjectURL(file);
  $previewImg[imgIdx].setAttribute("src", imageSrc);
  uploadImg[imgIdx] = file;
}
function resetImg(idx) {
  $previewImg[idx].setAttribute("src", "../img/imgUpload.png");
  uploadImg[idx] = "";
}
$inputUpload.addEventListener("change", (e) => previewImg(e));
function validataionImg(file) {
  if (!file.size) {
    alert("파일이 없습니다!");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("파일의 크기를 초과하였습니다.(최대 5MB)");
    return;
  }
  if (
    !file.name.includes("png") &&
    !file.name.includes("jpg") &&
    !file.name.includes("webp") &&
    !file.name.includes("avif")
  ) {
    alert("이미지 형식을 확인해주세요.(지원형식 : png, jpg, webp, avif)");
    return;
  }
  return true;
}
