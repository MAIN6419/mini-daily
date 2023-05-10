"use strict";
import _ from 'https://cdn.skypack.dev/lodash-es';
import { fetchAllDiarys, FetchDiary } from "../commons/firebase.js";
import { getCreatedAt } from "../commons/libray.js";
getCreatedAt
const $allDiaryList = document.querySelector(".allDiary-lists")
renderAllDiary();
async function renderAllDiary() {
  const frag = new DocumentFragment();
  const data = await fetchAllDiarys(renderAllDiary);
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

    const empathy = document.createElement("span");
    empathy.setAttribute("class", "diary-empathy");
    empathy.textContent = `❤ ${diary.empathy}`
    contentsDiv.appendChild(empathy);

    anchor.appendChild(contentsDiv);

    frag.appendChild(listItem);
  }
  $allDiaryList.appendChild(frag);
}

const getThorttle = _.throttle( async (id)=>{
  const diaryData = await FetchDiary(id)
  sessionStorage.setItem("diaryData", JSON.stringify(diaryData))
}, 500);