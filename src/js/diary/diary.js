// 다이어리 기본 요소 셋팅

"use strict";
import { getCreatedAt } from "../commons/libray.js";
import { currentUser, FetchUserData } from "../firebase/auth/firebase_auth.js";

import {
  FetchDiary,
  deleteDiary,
  updateEmpathy,
} from "../firebase/diary/firebase_diary.js";


import { submitComment } from "./diaryComment/diaryComment.js";
import { uploadImg } from "./diaryEdit/diaryEdit.js";
import "../../css/commons.css";
import "../../css/main.css";
import "../../css/diary.css";
import "../../img/imgUpload.png";
import "../../img/comment-icon.png";  
import "../../img/sprite.png";
import "../../img/unheart.png";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const $sectionContents = document.querySelector(".section-contents");
const $diaryWrapper = $sectionContents.querySelector(".diary-wrapper");
const $editBtn = $diaryWrapper.querySelector(".btn-edit");
const $deleteBtn = $diaryWrapper.querySelector(".btn-del");
const $empathyBtn = $diaryWrapper.querySelector(".btn-empathy");
const $editForm = $sectionContents.querySelector(".edit-form");
const $loadingModal = $sectionContents.querySelector(".loading-modal");
const $backBtn = $sectionContents.querySelector(".btn-back");
const $diaryLink = document.querySelector(".diary-link");
const $allDiaryLink = document.querySelector(".allDiary-link");
const $commentForm = $sectionContents.querySelector(".comment-form");
const $commentInput = $commentForm.querySelector("#input-comment");
const $commentSubitBtn = $commentForm.querySelector(".btn-submit");

const previousPageUrl = document.referrer;

if (previousPageUrl.includes("myDiary")) {
  $diaryLink.classList.add("active");
  $backBtn.addEventListener("click", () => {
    location.href = "myDiary.html";
  });
} else {
  $allDiaryLink.classList.add("active");
  $backBtn.addEventListener("click", () => {
    location.href = "allDiary.html";
  });
}

// 게시글 데이터 가져오기
const fetchData = async () => {
  $loadingModal.classList.add("active");
  return await FetchDiary(id).then((res) => {
    $loadingModal.classList.remove("active");
    return res;
  });
};

// 게시글 데이터
export const data = (await fetchData()) || [];
renderdiary();

// 다이어리 렌더링 함수
async function renderdiary() {
  // 새로 렌더링 시 새로운 데이터를 가져옴
  const data = (await fetchData()) || [];

  const $diaryTitle = $diaryWrapper.querySelector(".diary-title");
  const $diaryText = $diaryWrapper.querySelector(".diary-text");
  const $diaryCreatedAt = $diaryWrapper.querySelector(".diary-createdAt");
  const $authInfo = $diaryWrapper.querySelector(".auth-info");
  const $diaryAuth = $diaryWrapper.querySelector(".diary-auth");
  const $diaryProfileImg = $diaryWrapper.querySelector(".diary-profileImg");
  const $empathyCount = $diaryWrapper.querySelector(".empathy-count");
  const $empathyBox = $diaryWrapper.querySelector(".empathy-box");
  const $authGrade = $sectionContents.querySelector(".auth-grade");

  if (data.length === 0) {
    $diaryTitle.textContent = "존재하지 않는 게시물";
    alert("현재 삭제되었거나 존재하지 않는 게시물 입니다!");
    location.replace("allDiary.html");
    return;
  }
  // 만약 작성자와 현재 로그인한 유저가 같지 않다면
  // 수정과 삭제버튼 없애기
  if (currentUser.displayName !== data.auth) {
    $editBtn.remove();
    $deleteBtn.remove();
  }
  const auth = await FetchUserData(data.auth);
  if (auth.grade === "우수") {
    $authGrade.classList.add("good");
  } else if (auth.grade === "프로") {
    $authGrade.classList.add("pro");
  } else if (auth.grade === "VIP") {
    $authGrade.classList.add("VIP");
  }
  $authGrade.textContent = auth.grade;
  $diaryAuth.textContent = data.auth;
  $diaryProfileImg.setAttribute(
    "src",
    auth.profileImgUrl || "./img/profile.png"
  );
  $diaryTitle.textContent = data.title;
  $diaryCreatedAt.textContent = getCreatedAt(data.createdAt);
  $diaryCreatedAt.setAttribute(
    "datetime",
    new Date(data.createdAt).toISOString()
  );
  $authInfo.classList.add("active");
  uploadImg.push(...data.imgURL);

  data.imgURL.forEach((el) => {
    const $postImg = document.createElement("img");
    $postImg.setAttribute("class", "diary-img");
    $postImg.setAttribute("src", "./img/placeholderImg.png");
    const actualImageURL = el;
    const dataImg = new Image();
    dataImg.src = actualImageURL;
    dataImg.addEventListener("load", () => {
      $postImg.src = actualImageURL;
    });
    $postImg.setAttribute("alt", "포스트 이미지");
    $diaryText.insertAdjacentElement("beforebegin", $postImg);
  });
  $empathyBox.classList.add("active");
  $diaryText.textContent = data.contents;
  $empathyCount.textContent = `공감 ${data.empathy}`;
  const user = await FetchUserData(currentUser.displayName);
  if (user.empathyList.includes(id)) {
    $empathyBtn.style.backgroundImage = "url(./img/heart.png)";
  }
}

$editBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const $inputTitle = $editForm.querySelector("#input-title");
  const $inputContents = $editForm.querySelector("#input-contents");
  const $previewImg = $sectionContents.querySelectorAll(".preview-img");

  $editForm.classList.toggle("active");
  $diaryWrapper.classList.toggle("inactive");
  $inputTitle.value = data.title;
  $inputContents.value = data.contents;
  $previewImg.forEach((el, idx) => {
    if (data.imgURL[idx]) {
      el.setAttribute("src", data.imgURL[idx]);
    }
  });
});
$deleteBtn.addEventListener("click", async () => {
  if (confirm("정말 삭제하시겠습니까?")) {
    $loadingModal.classList.add("active");
    await deleteDiary(id);
    previousPageUrl.includes("myDiary")
      ? (location.href = "myDiary.html")
      : (location.href = "allDiary.html");
    alert("삭제가 완료되었습니다.");
    $loadingModal.classList.remove("active");
  }
});
$empathyBtn.addEventListener("click", async () => {
  const checkdiary = await FetchDiary(id);
  if (!checkdiary) {
    alert("현재 삭제되었거나 존재하지 않는 게시글 입니다.");
    if (previousPageUrl.includes("myDiary")) {
      return (location.href = "myDiary.html");
    } else {
      return (location.href = "allDiary.html");
    }
  }
  const user = await FetchUserData(currentUser.displayName);
  if (user.empathyList.includes(id)) {
    updateEmpathy(id, -1, data.auth);
    data.empathy -= 1;
    // sessionStorage.setItem("diaryData", JSON.stringify(data));
    $empathyCount.textContent = `공감 ${data.empathy}`;
    $empathyBtn.style.backgroundImage = "url(./img/unheart.png)";
  } else {
    updateEmpathy(id, 1, data.auth);
    data.empathy += 1;
    // sessionStorage.setItem("diaryData", JSON.stringify(data));
    $empathyCount.textContent = `공감 ${data.empathy}`;
    $empathyBtn.style.backgroundImage = "url(./img/heart.png)";
  }
});

$commentSubitBtn.addEventListener("click", (e) => submitComment(e));
// 댓글 작성

// 엔터키 submit를 위한 키보드 이벤트
$commentInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 && e.shiftKey) {
    // 쉬프트 + 엔터키를 눌렀을 때
    e.preventDefault();
    $commentInput.value += "\n";
    return;
  } else if (e.keyCode === 13) {
    // 일반 엔터키를 눌렀을 때
    e.preventDefault();
    $commentSubitBtn.click();
  }
});
