"use strict";
import {v4 as uuidv4} from 'uuid';
import { writeDiary, uploadFile } from "../firebase/diary/firebase_diary.js";
import "../../css/commons.css";
import "../../css/main.css";
import "../../css/write.css";
import "../../img/imgUpload.png";
import "../../img/loading.gif";
import { getSessionUser } from "../firebase/auth/firebase_auth.js";
const data = JSON.parse(localStorage.getItem("diary")) || [];

const $inputTitle = document.querySelector("#input-title");
const $inputcontents = document.querySelector("#input-contents");
const $submitBtn = document.querySelector(".btn-submit");
const $inputUpload = document.querySelector("#input-upload");
const $btnUpload = document.querySelectorAll(".btn-upload");
const $previewImg = document.querySelectorAll(".preview-img");
const $resetBtn = document.querySelectorAll(".btn-reset");
const $loadingModal = document.querySelector(".loading-modal");

const userData = getSessionUser();
const uploadImg = ["", "", ""];
let imgIdx = "0";

$submitBtn.addEventListener("click", async () => {
  // 유효성 검사
  if (!$inputTitle.value.trim()) {
    alert("제목을 입력해주세요!");
    return;
  }
  if (!$inputcontents.value.trim()) {
    alert("내용을 입력해주세요!");
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
      imgURL: fileInfo.url || [],
      imgFileName: fileInfo.fileName || [],
      createdAt: new Date().getTime(),
      empathy: 0,
      accuse: 0,
    };

    const res = await writeDiary(newDiary);
    sessionStorage.setItem("diaryData", JSON.stringify(newDiary));
    $inputTitle.value = "";
    $inputcontents.value = "";
    uploadImg.splice(0);
    $loadingModal.classList.remove("active");
  }
});

$btnUpload.forEach((el, idx) => {
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
  $previewImg[imgIdx].style.width = "100%";
  $previewImg[imgIdx].style.height = "100%";
  uploadImg[imgIdx] = file;
}
function resetImg(idx) {
  $previewImg[idx].setAttribute("src", "./imgUpload.png");
  $previewImg[idx].style.width = "70px";
  $previewImg[idx].style.height = "70px";
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
  return true;
}
