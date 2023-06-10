"use strict";
import _ from "lodash";
import { getCreatedAt } from "../commons/libray.js";

import "../../css/myDiary.css";

import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/setting/firebase_setting.js";
import { getSessionUser } from "../firebase/auth/firebase_auth.js";
const $sectionContents = document.querySelector(".section-contents");
const $diaryList = $sectionContents.querySelector(".diary-lists");
const $inputSearch = $sectionContents.querySelector(".input-search");
const $topBtn = $sectionContents.querySelector(".btn-top");
const $loadingModal = $sectionContents.querySelector(".loading-modal");

const userData = getSessionUser();
let lastpage;
let hasNextpage = false;
let keyword = "";
const fetch = async () => {
  $loadingModal.classList.add("active");
  return await FetchDiarys().then((res) => {
    $loadingModal.classList.remove("active");
    return res;
  });
};
const data = await fetch();
renderDiaryList(data);

async function FetchDiarys() {
  if (keyword.trim()) {
    const dirayList = collection(db, "diaryList");
    const q = query(
      dirayList,
      orderBy("title"),
      orderBy("createdAt", "desc"),
      where("auth", "==", userData.displayName),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      startAfter(lastpage),
      limit(5)
    );
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 5;
    $diaryList.innerHTML = "";
    return datas;
  } else {
    const diaryList = collection(db, "diaryList");
    const q = query(
      diaryList,
      where("auth", "==", userData.displayName),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const res = await getDocs(q);
    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 5;
    const datas = res.docs.map((el) => el.data());

    return datas;
  }
  
}

async function nextDiaryList() {
  if (keyword.trim()) {
    const dirayList = collection(db, "diaryList");
    const q = query(
      dirayList,
      orderBy("title"),
      orderBy("createdAt", "desc"),
      where("auth", "==", userData.displayName),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      startAfter(lastpage),
      limit(5)
    );
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 5;
    return datas;
  } else {
    const diaryList = collection(db, "diaryList");
    const q = query(
      diaryList,
      where("auth", "==", userData.displayName),
      orderBy("createdAt", "desc"),
      startAfter(lastpage),
      limit(5)
    );
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 5;
    return datas;
  }
}

function renderDiaryList(data) {
  if (data.length === 0) {
    $diaryList.innerHTML += `
    <li class="no-diary">
    현재 다이어리가 없어요.
  </li>
  `;
    return;
  }
  const $frag = document.createDocumentFragment();
  for (const item of data) {
    const $diaryItem = document.createElement("li");
    $diaryItem.setAttribute("class", "diary-item");
    $diaryItem.setAttribute("data-id", item.id);
  

    const $diaryLink = document.createElement("a");
    $diaryLink.setAttribute("href", `diary.html?id=${item.id}`);
    $diaryLink.setAttribute("class", "diaryItem-link");

    const $itemTitle = document.createElement("h3");
    $itemTitle.setAttribute("class", "item-title");
    $itemTitle.textContent = item.title;

    const $itemCreatedAt = document.createElement("time");
    $itemCreatedAt.setAttribute("class", "item-createdAt");
    $itemCreatedAt.setAttribute(
      "datetime",
      new Date(item.createdAt).toISOString()
    );
    $itemCreatedAt.textContent = getCreatedAt(item.createdAt);

    const $itemContents = document.createElement("p");
    $itemContents.setAttribute("class", "item-contents");
    $itemContents.textContent = item.contents;

    $diaryLink.appendChild($itemTitle);
    $diaryLink.appendChild($itemCreatedAt);
    $diaryLink.appendChild($itemContents);
    $diaryItem.appendChild($diaryLink);
    $frag.appendChild($diaryItem);
  }
  $diaryList.appendChild($frag);
}



// 무한스크롤 구현
let isLoading = false;
async function addItems() {
  isLoading = true; 
  const slicedData = await nextDiaryList();
  if(slicedData.length > 0){
    renderDiaryList(slicedData);
  }
  isLoading = false; 
}

function handleScroll() {
  // scrollTop 요소의 수직 스크롤 바의 현재 위치를 반환
  // clientHeight 현재 요소의 높이
  // scrollHeight 스크롤 가능한 전체 영역의 높이
  if ($sectionContents.scrollTop > 500) {
    $topBtn.classList.add("active");
    $topBtn.disabled = false;
  } else {
    $topBtn.classList.remove("active");
    $topBtn.disabled = true;
  }
  
  if (isLoading || !hasNextpage) return;
  if (
    $sectionContents.scrollTop + $sectionContents.clientHeight >=
    $sectionContents.scrollHeight - 20
  ) {
    addItems();
  }
}


$sectionContents.addEventListener("scroll", handleScroll);

$inputSearch.addEventListener("input", (e) => {
  // 첫 글자 스페이스 방지 => 검색 최적화 스페이스가 된다면 검색이 이루어져서 불필요한 데이터 요청 발생
  if (e.target.value.length === 1 && e.target.value[0] === " ") {
    e.target.value = ""; // 입력한 값을 빈 문자열로 대체하여 막음
    return;
  }
  debounceSearch(e);
});

// 검색 기능
const debounceSearch = _.debounce(async (e) => {
  keyword = e.target.value;
  lastpage = null; // 검색시 lastpage를 지워줘야 검색했을때 페이지를 정상적으로 불러옴
  if (!e.target.value) {
    $diaryList.innerHTML = "";
    const data = await FetchDiarys();
    renderDiaryList(data);
    return;
  }
  const data = await FetchDiarys();
  $diaryList.innerHTML = "";
  renderDiaryList(data);
}, 500);

$topBtn.addEventListener("click", () => {
  $sectionContents.scrollTo({ top: 0, behavior: "smooth" });
});