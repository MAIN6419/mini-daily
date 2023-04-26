"use strict";

import { getCreatedAt } from "../commons/libray.js";

const $sectionContents = document.querySelector(".section-contents");
const $diaryList = $sectionContents.querySelector(".diary-lists");
const data = JSON.parse(localStorage.getItem("diary")) || [];
const $inputSearch = document.querySelector(".input-search");

function renderDiaryList(data) {
  if (data.length === 0) {
    $diaryList.innerHTML += `
    <li class="none-item">
         현재 게시글이 없어요.
         게시글을 한 번 작성해보세요~
    </li>
    `;
    return;
  }
  const $frag = document.createDocumentFragment();
  for (const item of data) {
    const $diaryItem = document.createElement("li");
    $diaryItem.setAttribute("class", "diary-item");

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
  slicedData = slicedData.concat(data); // 이전 데이터와 합쳐줍니다.
}

// 무한스크롤 구현
const itemsPerPage = 4;
let startIndex = 0;
let endIndex = itemsPerPage;
let slicedData = data.slice(startIndex, endIndex);

function addItems() {
  startIndex += itemsPerPage;
  endIndex += itemsPerPage;
  const slicedDataForSearch = $inputSearch.value.trim() ? data.filter((el) => el.title.includes($inputSearch.value)) : data;
  const slicedData = slicedDataForSearch.slice(startIndex, endIndex);
  if (slicedData.length === 0) return;
  renderDiaryList(slicedData);
  if (endIndex >= slicedDataForSearch.length) {
    $sectionContents.removeEventListener("scroll", handleScroll);
  }
}

function handleScroll() {
  // scrollTop 요소의 수직 스크롤 바의 현재 위치를 반환
  // clientHeight 현재 요소의 높이
  // scrollHeight 스크롤 가능한 전체 영역의 높이
  if (
    $sectionContents.scrollTop + $sectionContents.clientHeight >=
    $sectionContents.scrollHeight - 20
  ) {
    addItems();
  }
}

// 초기에는 배열의 첫 번째 요소부터 세 개를 출력
renderDiaryList(slicedData);

// 스크롤이 끝까지 내려가면 다음 4개 요소를 출력
$sectionContents.addEventListener("scroll", handleScroll);

$inputSearch.addEventListener("input", (e) => debounceSearch(e));

// 검색 기능
function search(keyword) {
  if (keyword.trim()) {
    startIndex = 0;
    endIndex = itemsPerPage;
    slicedData = data.filter((el) => el.title.includes(keyword)).slice(startIndex, endIndex);
    if(slicedData.length===0) {
      $diaryList.innerHTML = `   
      <li class="none-item">
        현재 검색한 다이어리가 존재하지 않습니다.
      </li>`
      return;
    }
    $diaryList.innerHTML = "";
    renderDiaryList(slicedData);
    if (endIndex >= data.length) {
      $sectionContents.removeEventListener("scroll", handleScroll);
    } else {
      $sectionContents.addEventListener("scroll", handleScroll);
    }
  } else {
    startIndex = 0;
    endIndex = itemsPerPage;
    slicedData = data.slice(startIndex, endIndex);
    $diaryList.innerHTML = "";
    renderDiaryList(slicedData);
    $sectionContents.addEventListener("scroll", handleScroll);
  }
}
const debounceSearch = _.debounce((e) => {
  search(e.target.value);
}, 500);