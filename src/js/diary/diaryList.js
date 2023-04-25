'use strict';
import { getCreatedAt } from "../commons/libray.js";
const $diaryList = document.querySelector('.diary-lists');
const $sectionContents = document.querySelector(".section-contents");
let data = [];
if (localStorage.getItem('diary')) {
  data = JSON.parse(localStorage.getItem('diary'));
}

function renderDiaryList(data) {
  if (data.length === 0) {
    $diaryList.innerHTML += `
    <li class="none-item">
         현재 게시글이 없어요.
         게시글을 한 번 작성해보세요~
    </li>
    `;
    return; // 더 이상 출력할 요소가 없으면 함수를 종료합니다.
  }
  for (const item of data) {
    const $diaryItem = document.createElement("li");
    $diaryItem.setAttribute("class", "diary-item");

    const $diaryLink = document.createElement("a");
    $diaryLink.setAttribute("href", `diary.html?id=${item.id}`);
    $diaryLink.setAttribute("class", "diary-link");

    const $itemTitle = document.createElement("h3");
    $itemTitle.setAttribute("class", "item-title");
    $itemTitle.textContent = item.title;

    const $itemCreatedAt = document.createElement("time");
    $itemCreatedAt.setAttribute("class", "item-createdAt");
    $itemCreatedAt.setAttribute("datetime", new Date(item.createdAt).toISOString());
    $itemCreatedAt.textContent = getCreatedAt(item.createdAt);

    const $itemContents = document.createElement("p");
    $itemContents.setAttribute("class", "item-contents");
    $itemContents.textContent = item.contents;

    $diaryLink.appendChild($itemTitle);
    $diaryLink.appendChild($itemCreatedAt);
    $diaryLink.appendChild($itemContents);
    $diaryItem.appendChild($diaryLink);
    $diaryList.appendChild($diaryItem);
  }
}


const itemsPerPage = 4;
let startIndex = 0;
let endIndex = itemsPerPage;
const slicedData = data.slice(startIndex, endIndex);

function addItems() {
  startIndex += itemsPerPage;
  endIndex += itemsPerPage;
  const slicedData = data.slice(startIndex, endIndex);
  if(slicedData.length===0) return;
  renderDiaryList(slicedData);
  // 데이터가 없을 경우 스크롤 함수를 실행하지 않음
  // 현재 데이터가 4개 이하인 경우
  if (endIndex >= data.length) {
    $sectionContents.removeEventListener('scroll', handleScroll);
  }
}

function handleScroll() {
  // scrollTop 요소의 수직 스크롤 바의 현재 위치를 반환
  // clientHeight 현재 요소의 높이 
  // scrollHeight 스크롤 가능한 전체 영역의 높이
  if ($sectionContents.scrollTop + $sectionContents.clientHeight >= $sectionContents.scrollHeight - 20) {
    addItems();
  }
}

// 초기에는 배열의 첫 번째 요소부터 세 개를 출력
renderDiaryList(slicedData);

// 스크롤이 끝까지 내려가면 다음 3개 요소를 출력
$sectionContents.addEventListener('scroll', handleScroll);
