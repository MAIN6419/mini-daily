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

import "../../css/diary.css";
import "../../img/imgUpload.png";
import "../../img/placeholderImg.png";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const $sectionContents = document.querySelector(".section-contents");
const $diaryWrapper = $sectionContents.querySelector(".diary-wrapper");
const $empathyBtn = $diaryWrapper.querySelector(".btn-empathy");
const $editForm = $sectionContents.querySelector(".edit-form");
const $loadingModal = $sectionContents.querySelector(".loading-modal");
const $backBtn = $sectionContents.querySelector(".btn-back");
const $myDiaryLink = document.querySelector(".myDiary-link");
const $allDiaryLink = document.querySelector(".allDiary-link");
const $homeLink = document.querySelector(".home-link");
const $commentForm = $sectionContents.querySelector(".comment-form");
const $commentInput = $commentForm.querySelector("#input-comment");
const $commentSubitBtn = $commentForm.querySelector(".btn-submit");

const previousPageUrl = document.referrer;

if (previousPageUrl.includes("myDiary")) {
  $myDiaryLink.classList.add("active");
  $backBtn.addEventListener("click", () => {
    location.href = "myDiary.html";
  });
} else if (previousPageUrl.includes("home")) {
  $homeLink.classList.add("active");
  $backBtn.addEventListener("click", () => {
    location.href = "home.html";
  });
} else {
  $allDiaryLink.classList.add("active");
  $backBtn.addEventListener("click", () => {
    location.href = "allDiary.html";
  });
}

// 게시글 데이터 가져오기
const fetchData = async () => {
  console.log('a')
  $loadingModal.classList.add("active");
  $sectionContents.style.overflow = "hidden";
  return await FetchDiary(id).then((res) => {
    $loadingModal.classList.remove("active");
    $sectionContents.style.overflow = "auto";
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
  const $diaryMood = $diaryWrapper.querySelector(".mood-box");
  const $diaryCreatedAt = $diaryWrapper.querySelector(".diary-createdAt");
  const $authInfo = $diaryWrapper.querySelector(".auth-info");
  const $diaryAuth = $diaryWrapper.querySelector(".diary-auth");
  const $diaryProfileImg = $diaryWrapper.querySelector(".diary-profileImg");
  const $empathyCount = $diaryWrapper.querySelector(".empathy-count");
  const $empathyBox = $diaryWrapper.querySelector(".empathy-box");
  const $authGrade = $sectionContents.querySelector(".auth-grade");
  const $diaryBtns = $sectionContents.querySelector(".diary-btns");
  if (data.length === 0) {
    $diaryTitle.textContent = "존재하지 않는 게시물";
    alert("현재 삭제되었거나 존재하지 않는 게시물 입니다!");
    location.replace("allDiary.html");
    return;
  }
  // 만약 작성자와 현재 로그인한 유저가 같지 않다면
  // 수정과 삭제버튼 없애기
  if (currentUser.displayName === data.auth) {
    const editBtn = document.createElement("button");
    editBtn.setAttribute("type", "button");
    editBtn.setAttribute("class", "btn-edit");
    const editBtnText = document.createElement("span");
    editBtnText.setAttribute("class", "a11y-hidden");
    editBtnText.textContent = "수정";
    editBtn.appendChild(editBtnText);
    $diaryBtns.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.setAttribute("type", "button");
    delBtn.setAttribute("class", "btn-del");
    const delBtnText = document.createElement("span");
    delBtnText.setAttribute("class", "a11y-hidden");
    delBtnText.textContent = "삭제";
    delBtn.appendChild(delBtnText);
    $diaryBtns.appendChild(delBtn);

    editBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const $articleComment =
        $sectionContents.querySelector(".article-comment");
      const $diaryDate = $editForm.querySelector(".diary-date");
      const $inputTitle = $editForm.querySelector("#input-title");
      const $inputContents = $editForm.querySelector("#input-contents");
      const $moodList = $editForm.querySelectorAll("input[name='mood']");
      const $previewImg = $sectionContents.querySelectorAll(".preview-img");
      $articleComment.classList.add("inactive");
      $editForm.classList.toggle("active");
      $diaryWrapper.classList.toggle("inactive");
      const diaryCreatedAt = new Date(data.createdAt);
      const year = diaryCreatedAt.getFullYear();
      const month = "0" + (diaryCreatedAt.getMonth() + 1);
      const date = "0" + diaryCreatedAt.getDate();
      const day = ["일", "월", "화", "수", "목", "금", "토"][
        diaryCreatedAt.getDay()
      ];
      $diaryDate.textContent = `${year}.${month.slice(-2)}.${date.slice(
        -2
      )}.(${day})`;
      $inputTitle.value = data.title;
      $inputContents.value = data.contents;
      $moodList.forEach((el) => {
        if (el.value === data.mood) {
          el.checked = true;
          return;
        }
      });
      $previewImg.forEach((el, idx) => {
        if (data.imgURL[idx]) {
          el.setAttribute("src", data.imgURL[idx]);
        }
      });
    });

    delBtn.addEventListener("click", async () => {
      if (confirm("정말 삭제하시겠습니까?")) {
        $loadingModal.classList.add("active");
        await deleteDiary(id);
        if (previousPageUrl.includes("write")) {
          alert("삭제가 완료되었습니다.");
          $loadingModal.classList.remove("active");
          location.replace("allDiary.html");
        } else {
          alert("삭제가 완료되었습니다.");
          $loadingModal.classList.remove("active");
          location.replace(previousPageUrl);
        }
      }
    });
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
  $diaryMood.classList.add(data.mood);

  $empathyBox.classList.add("active");
  $diaryText.textContent = data.contents;
  $empathyCount.textContent = `공감 ${data.empathy}`;
  const user = await FetchUserData(currentUser.displayName);
  if (user.empathyList.includes(id)) {
    $empathyBtn.style.background =
      "url(../img/icon-sprite.png)no-repeat -109px -301px / 410px 329px";
  }
}

$empathyBtn.addEventListener("click", async () => {
  const $empathyCount = $diaryWrapper.querySelector(".empathy-count");
  const checkdiary = await FetchDiary(id);
  if (!checkdiary) {
    alert("현재 삭제되었거나 존재하지 않는 게시글 입니다.");
    if (previousPageUrl.includes("myDiary")) {
      return (location.href = "myDiary.html");
    } else if (previousPageUrl.includes("home")) {
      return (location.href = "home.html");
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
    $empathyBtn.style.background =
      "url(../img/icon-sprite.png) no-repeat -75px -301px / 410px 329px";
  } else {
    updateEmpathy(id, 1, data.auth);
    data.empathy += 1;
    // sessionStorage.setItem("diaryData", JSON.stringify(data));
    $empathyCount.textContent = `공감 ${data.empathy}`;
    $empathyBtn.style.background =
      "url(../img/icon-sprite.png)no-repeat -109px -301px / 410px 329px";
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
