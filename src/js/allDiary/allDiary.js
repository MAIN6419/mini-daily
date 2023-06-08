"use strict";
import _ from "lodash";

import { getCreatedAt } from "../commons/libray.js";
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
import { getAuthImg } from "../firebase/auth/firebase_auth.js";

import "../../css/allDiary.css";
import "../../img/no-image.png";

const $allDiaryList = document.querySelector(".allDiary-lists");
let lastpage;
let hasNextpage = false;
let keyword = "";
let isfirstLoding = false;

const $sectionContents = document.querySelector(".section-contents");
const $inputSearch = $sectionContents.querySelector(".input-search");
const $topBtn = $sectionContents.querySelector(".btn-top");
const $loadingModal = $sectionContents.querySelector(".loading-modal");

const fetch = async () => {
  $loadingModal.classList.add("active");
  return await FetchDiarys().then((res) => {
    $loadingModal.classList.remove("active");
    return res;
  });
};
const data = await fetch();

async function FetchDiarys() {
  if (keyword.trim()) {
    const dirayList = collection(db, "diaryList");
    const q = query(
      dirayList,
      orderBy("title"),
      orderBy("createdAt", "desc"),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      startAfter(lastpage),
      limit(8)
    );
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 8;
    $allDiaryList.innerHTML = "";
    return datas;
  } else {
    const diaryList = collection(db, "diaryList");
    const q = query(diaryList, orderBy("createdAt", "desc"), limit(8));
    const res = await getDocs(q);
    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 8;
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
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      startAfter(lastpage),
      limit(8)
    );
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());

    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 8;
    return datas;
  } else {
    const diaryList = collection(db, "diaryList");
    const q = query(
      diaryList,
      orderBy("createdAt", "desc"),
      startAfter(lastpage),
      limit(8)
    );
    const res = await getDocs(q);
    lastpage = res.docs[res.docs.length - 1];
    const datas = res.docs.map((el) => el.data());
    hasNextpage = res.docs.length === 8;
    return datas;
  }
}

renderAllDiary(data);
async function renderAllDiary(data) {
  if (data.length === 0) {
    $allDiaryList.innerHTML = `
    <li class="no-diary">
      현재 다이어리가 없어요.
    </li>
    `;
    return;
  } 
  // 최초로딩시에만 로딩화면을 보여주기 위해서
  if (!isfirstLoding) $loadingModal.classList.add("active");
  const frag = new DocumentFragment();

  for (const diary of data) {
    const listItem = document.createElement("li");
    listItem.classList.add("diary");
    // listItem.addEventListener("mouseover", ()=> getThorttle(diary.id))

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
    // 초기 유저 이미지의 경우 임시 이미지 사용 => 렌더링이 완료된후 유저 이미지를 불러옴
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

  $allDiaryList.appendChild(frag);
  if (!isfirstLoding) $loadingModal.classList.remove("active");
  isfirstLoding = true;
}

// 다이어리 작성자 이미지를 불러오는 함수 => placeholderImg 교체
async function fetchAuthImg(profileImg, data) {
  profileImg.src = (await getAuthImg(data.auth)) || "./img/profile.png";
}
// 스크롤이 빠르게 일어날시 마지막 데이터가 중복됨
// 이 문제를 해결하기 위해 isloading 변수을 사용해 현재 로딩 중임을 체크하고 로딩중이 아닐때만 데이터가 추가 되도록 함
let isLoading = false;
async function addItems() {
  isLoading = true; 
  const slicedData = await nextDiaryList();
  if(slicedData.length > 0){
    renderAllDiary(slicedData);
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
    $allDiaryList.innerHTML = "";
    const data = await FetchDiarys();
    renderAllDiary(data);
    return;
  }
  const data = await FetchDiarys();
  $allDiaryList.innerHTML = "";
  renderAllDiary(data);
}, 500);

$topBtn.addEventListener("click", () => {
  $sectionContents.scrollTo({ top: 0, behavior: "smooth" });
});
