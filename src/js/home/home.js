"use strict";
import _ from 'https://cdn.skypack.dev/lodash-es';
import { getCreatedAt } from "../commons/libray.js";
import { userData } from "../commons/commons.js";
import { FetchDiary, FetchDiarys, FetchUserData, fetchBestDiarys, setFortune } from "../commons/firebase.js";

const $sectionContents = document.querySelector(".section-contents");
const $recentDiaryLists = $sectionContents.querySelector(".recent-diaryLists");
const $fortuneContents = $sectionContents.querySelector(".fortune-cotents");
const $diaryLists = $sectionContents.querySelector(".diary-lists")
const data = await fetchBestDiarys() || [];
const fortune = await fetchFortuneData();

rederRecentDiary();
renderFortune();
renderBestDiary();

function rederRecentDiary() {
  $recentDiaryLists.innerHTML = "";
  if (data.length === 0) {
    $recentDiaryLists.innerHTML += `
      <li class="none-diary">현재 다이어리가 없어요~</li>
      `;
    return;
  }

  const frag = document.createDocumentFragment();
  for (const item of data) {
    const $diaryItem = document.createElement("li");
    const $recentLink = document.createElement("a");
    const $createdAt = document.createElement("time");

    $diaryItem.setAttribute("class", "recent-item");

    $recentLink.textContent = item.title;
    $recentLink.setAttribute("href", `src/template/diary.html?id=${item.id}`);

    $createdAt.setAttribute("class", "createdAt");
    $createdAt.setAttribute("datetime", new Date(item.createdAt).toISOString());
    $createdAt.textContent = getCreatedAt(item.createdAt);

    frag.appendChild($diaryItem);
    $diaryItem.appendChild($recentLink);
    $diaryItem.appendChild($createdAt);
  }
  $recentDiaryLists.appendChild(frag);
}

function renderFortune() {
  if (fortune) {
    $fortuneContents.textContent = fortune.result;
  } else {
    $fortuneContents.textContent = "아직 운세를 보지 않았네요.";
  }
}

async function fetchFortuneData() {
  // 운세 데이터 불러오기
   let fortune =  (await FetchUserData(userData.nickname)).fortune; 
  // 하루가 지나면 운세보기 초기화
  if (fortune) {
    const fortuneCreatedAt = new Date(fortune.createdAt);
    const currentDate = new Date();
    // 운세 데이터가 만들어진 날짜와 현재 날짜를 비교
    // 날짜 차이가 난다면 하루가 지난것 이므로 운세 데이터를 삭제
    if (currentDate.getDate() !== fortuneCreatedAt.getDate()) {
      setFortune(userData.nickname, "");
      // 운세 데이터 초기화
      fortune = "";
    }
  }
  return fortune;
}

async function renderBestDiary() {
  const frag = new DocumentFragment();
  const data = await fetchBestDiarys();
  for(const diary of data) {
    const listItem = document.createElement('li');
    listItem.classList.add('diary');
    listItem.addEventListener("mouseover", ()=> getThorttle(diary.id))

    const anchor = document.createElement('a');
    anchor.href = `diary.html?id=${diary.id}`;
    listItem.appendChild(anchor);

    const img = document.createElement('img');
    img.classList.add('diary-img');
    img.src = diary.imgURL[0] || '../img/no-image.png';
    img.alt = '다이어리 이미지';
    anchor.appendChild(img);

    const contentsDiv = document.createElement('div');
    contentsDiv.classList.add('diary-contents');

    const title = document.createElement('h3');
    title.classList.add('diary-title');
    title.textContent = diary.title;
    contentsDiv.appendChild(title);

    const text = document.createElement('p');
    text.classList.add('diary-text');
    text.textContent = diary.contents;
    contentsDiv.appendChild(text);

    const bottomDiv = document.createElement('div');
    bottomDiv.classList.add('diary-bottom');

    const profileImg = document.createElement('img');
    profileImg.classList.add('diary-profileImg');
    profileImg.src = diary.profileImg||'../img/profile.png';
    profileImg.alt = '';
    bottomDiv.appendChild(profileImg);

    const auth = document.createElement('span');
    auth.classList.add('diary-auth');
    auth.textContent = diary.auth;
    bottomDiv.appendChild(auth);

    const createdAt = document.createElement('time');
    createdAt.classList.add('diary-createdAt');
    createdAt.datetime = new Date(diary.createdAt).toISOString();
    createdAt.textContent = getCreatedAt(diary.createdAt);
    bottomDiv.appendChild(createdAt);

    contentsDiv.appendChild(bottomDiv);
    anchor.appendChild(contentsDiv);

    

    const empathy = document.createElement("span");
    empathy.setAttribute("class", "diary-empathy");
    empathy.textContent = `${diary.empathy}`
    contentsDiv.appendChild(empathy);

    const empathyImg = document.createElement("img");
    empathyImg.setAttribute("class", "empathy-img");
    empathyImg.setAttribute("src", "../img/heart.png");
    empathyImg.setAttribute("alt", "공감 아이콘");
    empathy.insertAdjacentElement("afterbegin",empathyImg);

    $diaryLists.appendChild(listItem);
  }
  $diaryLists.appendChild(frag);
}

const getThorttle = _.throttle( async (id)=>{
  const diaryData = await FetchDiary(id)
  sessionStorage.setItem("diaryData", JSON.stringify(diaryData))
}, 500);

