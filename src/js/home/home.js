'use strict';

import { getCreatedAt } from "../commons/libray.js";

const $sectionContents = document.querySelector(".section-contents")
const $recentDiaryLists = $sectionContents.querySelector(".recent-diaryLists");
const $fortuneContents = $sectionContents.querySelector(".fortune-cotents")
const data = JSON.parse(localStorage.getItem('diary')) || [];

rederRecentDiary();
renderFortune();
  function rederRecentDiary() {
    if(data.length===0){
      $recentDiaryLists.innerHTML+=`
      <li class="none-diary">현재 다이어리가 없어요~</li>
      `
      return;
    }
    const recentData = data.slice(0, 3);
    for(const item of recentData){
      const $diaryItem = document.createElement('li');
      const $recentLink = document.createElement('a');
      const $createdAt = document.createElement('time');

      $diaryItem.setAttribute('class', 'recent-item');

      $recentLink.textContent = item.title;
      $recentLink.setAttribute('href', `src/template/diary.html?id=${item.id}`);

      $createdAt.setAttribute("class", "createdAt");
      $createdAt.setAttribute("datetime", new Date(item.createdAt).toISOString());
      $createdAt.textContent = getCreatedAt(item.createdAt);

      $recentDiaryLists.appendChild($diaryItem);
      $diaryItem.appendChild($recentLink);
      $diaryItem.append($createdAt);
    }
  }

  function renderFortune(){
    if(localStorage.getItem('fortune')){
      $fortuneContents.textContent = JSON.parse(localStorage.getItem('fortune')).result;
    }
    else{
      $fortuneContents.textContent = '아직 운세를 보지 않았네요.'
    }
  }