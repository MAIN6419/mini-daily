"use strict";
import _ from 'https://cdn.skypack.dev/lodash-es';
import { getCreatedAt } from "../commons/libray.js";
import { userData } from "../commons/commons.js";
import { FetchDiary, db } from "../commons/firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  startAfter,
  startAt,
  endAt,
  limit,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
const $sectionContents = document.querySelector(".section-contents");
const $diaryList = $sectionContents.querySelector(".diary-lists"); 


const $inputSearch = $sectionContents.querySelector(".input-search");
const $loadingModal = $sectionContents.querySelector(".loading-modal");
let lastpage;
let hasNextpage = false;
let keyword = '';
const fetch = async ()=>{
  $loadingModal.classList.add("active");
  return await FetchDiarys().then((res)=>{
    $loadingModal.classList.remove("active");
    return res;
  })
};
const data = await fetch();
renderDiaryList(data);

async function FetchDiarys() {
  if (keyword.trim()) {
    console.log(keyword)
    const dirayList = collection(db, "diaryList")
    const q = query(
      dirayList,
      orderBy("title"),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      startAfter(lastpage),
      limit(4)
    );
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 4;
    $diaryList.innerHTML = '';
    return datas;
  } 
  else{
    const diaryList = collection(db, "diaryList");
    const q =  query(diaryList, where("auth","==", userData.nickname), orderBy("createdAt", "desc"), limit(4));
    const res = await getDocs(q);
    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 4;
    const datas =  res.docs.map((el) => el.data());
    return datas;
  }
  
}

async function nextDiaryList() {
  if (keyword.trim()) {
    const dirayList = collection(db, "diaryList")
    const q = query(
      dirayList,
      orderBy("title"),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      startAfter(lastpage),
      limit(4)
    );
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    lastpage = res.docs[res.docs.length - 1];
    hasNextpage = res.docs.length === 4;
    console.log(hasNextpage)
    return datas;
  } 
  else{
    const diaryList = collection(db, "diaryList");
    const q = query(diaryList, 
      where("auth","==", userData.nickname), 
      orderBy("createdAt", "desc"),
      startAfter(lastpage), limit(4));
    const res = await getDocs(q);
    lastpage = res.docs[res.docs.length - 1];
    const datas = res.docs.map((el) => el.data());
    hasNextpage = res.docs.length === 4;
    return datas;
  }
}

function renderDiaryList(data) {
  if (data.length === 0) {
    $diaryList.innerHTML += `
    <li class="none-item">
      현재 게시글이 없어요.
    </li>
    `;
    return;
  }
  const $frag = document.createDocumentFragment();
  for (const item of data) {
    const $diaryItem = document.createElement("li");
    $diaryItem.setAttribute("class", "diary-item");
    $diaryItem.setAttribute("data-id", item.id);
    $diaryItem.addEventListener("mouseover", ()=> getThorttle(item.id))

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

// 게시글 preload 과부하 방지
const getThorttle = _.throttle( async (id)=>{
  const diaryData = await FetchDiary(id)
  sessionStorage.setItem("diaryData", JSON.stringify(diaryData))
}, 500);

// 무한스크롤 구현
let slicedData;

async function addItems() {
  slicedData = await nextDiaryList(userData.nickname);
  if (slicedData.length === 0) return;
  renderDiaryList(slicedData);
  if (!hasNextpage) {
    $sectionContents.removeEventListener("scroll", handleScroll);
  }
}

function handleScroll() {
  // scrollTop 요소의 수직 스크롤 바의 현재 위치를 반환
  // clientHeight 현재 요소의 높이
  // scrollHeight 스크롤 가능한 전체 영역의 높이
  if (
    $sectionContents.scrollTop + $sectionContents.clientHeight >=
    $sectionContents.scrollHeight
  ) {
    addItems();
  }
}

// 스크롤이 끝까지 내려가면 다음 4개 요소를 출력
$sectionContents.addEventListener("scroll", handleScroll);

$inputSearch.addEventListener("input", (e) => {
  // 첫 글자 스페이스 방지 => 검색 최적화 스페이스가 된다면 검색이 이루어져서 불필요한 데이터 요청 발생
  if (e.target.value.length === 1 && e.target.value[0] === ' ') {
    e.target.value = ''; // 입력한 값을 빈 문자열로 대체하여 막음
    return;
  }
  debounceSearch(e)
});

// 검색 기능
const debounceSearch = _.debounce(async (e) => {
  keyword = e.target.value;
  lastpage = null; // 검색시 lastpage를 지워줘야 검색했을때 페이지를 정상적으로 불러옴
  if(!e.target.value){
    $diaryList.innerHTML = '';
    const data =  await FetchDiarys()
    renderDiaryList(data);
    return;
  }
  const data = await FetchDiarys();
  $diaryList.innerHTML = '';
  renderDiaryList(data);
}, 500);