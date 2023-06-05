"use strict";
import _ from "lodash";

import { getCreatedAt } from "../commons/libray.js";
import { getAuthImg } from "../firebase/auth/firebase_auth.js";

import "../../css/mypage.css";
import "../../img/no-image.png";
import { fetchEmpathyDiarys } from "../firebase/diary/firebase_diary.js";
import { userData } from "../commons/commons.js";
const $sectionContents = document.querySelector(".section-contents");
const $empathyBox = $sectionContents.querySelector(".empathy-box")
const $empathyLists = $empathyBox.querySelector(".swiper-wrapper");
const $loadingModal = $sectionContents.querySelector(".loading-modal");
const data = await fetchEmpathyDiarys(userData.nickname);

renderAllDiary(data);
async function renderAllDiary(data) {
  if (data.length === 0) {
    $empathyLists.innerHTML = `
    <li class="no-diary">
      현재 공감한 다이어리가 없어요.
    </li>
    `;
    return;
  }
  const frag = new DocumentFragment();

  for (const diary of data) {
    const listItem = document.createElement("li");
    listItem.classList.add("swiper-slide");

    const anchor = document.createElement("a");
    anchor.href = `diary.html?id=${diary.id}`;
    listItem.appendChild(anchor);

    const img = document.createElement("img");
    img.classList.add("diary-img");
    img.src = diary.imgURL[0] || "./img/no-image.png";
    img.alt = "다이어리 이미지";
    anchor.appendChild(img);

    const contentsDiv = document.createElement("div");
    contentsDiv.classList.add("diary-contents");

    const title = document.createElement("h3");
    title.classList.add("diary-title");
    title.textContent = diary.title;
    contentsDiv.appendChild(title);

    const text = document.createElement("p");
    text.classList.add("diary-text");
    text.textContent = diary.contents;
    contentsDiv.appendChild(text);

    const bottomDiv = document.createElement("div");
    bottomDiv.classList.add("diary-bottom");

    const profileImg = document.createElement("img");
    profileImg.classList.add("diary-profileImg");

    profileImg.src = "./img/placeholderImg.png";
    profileImg.alt = "";
    bottomDiv.appendChild(profileImg);

    const auth = document.createElement("span");
    auth.classList.add("diary-auth");
    auth.textContent = diary.auth;
    bottomDiv.appendChild(auth);

    const createdAt = document.createElement("time");
    createdAt.classList.add("diary-createdAt");
    createdAt.datetime = new Date(diary.createdAt).toISOString();
    createdAt.textContent = getCreatedAt(diary.createdAt);
    bottomDiv.appendChild(createdAt);

    contentsDiv.appendChild(bottomDiv);

    const empathy = document.createElement("span");
    empathy.setAttribute("class", "diary-empathy");
    empathy.textContent = `${diary.empathy}`;
    contentsDiv.appendChild(empathy);

    anchor.appendChild(contentsDiv);

    frag.appendChild(listItem);
    fetchAuthImg(profileImg, diary);
  }

  $empathyLists.appendChild(frag);
}

// 다이어리 작성자 이미지를 불러오는 함수 => placeholderImg 교체
async function fetchAuthImg(profileImg, data) {
  profileImg.src = (await getAuthImg(data.auth)) || "./img/profile.png";
  $loadingModal.classList.remove("active");
}


