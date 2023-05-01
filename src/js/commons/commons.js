"use strict";

import { updateTime } from "./clock.js";
import { calendar } from "./calendar.js";
import { getSessionUser, logout } from "./firebase.js";
export let userData;

if(!sessionStorage.getItem("userData")) {
  location.replace("/");
  alert("로그인 후 이용가능합니다!");
}
else{
  userData = JSON.parse(sessionStorage.getItem("userData"));
}

const host = window.location.host;

let baseUrl = "";
if (host.includes("github.io")) {
  baseUrl = "/mini-diary";
}

(async function () {
  await loadTemplate();
  const $logoutBtn = document.querySelector(".btn-logout");
  $logoutBtn.addEventListener("click", ()=>{
    logout();
  })
  // clock
  updateTime();
  setInterval(updateTime, 1000);

  // calendar
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  calendar(year, month);
  const btns = document.querySelectorAll(".calendar button");
  btns.forEach((item) =>
    item.addEventListener("click", () => {
      if (item.classList.contains("prev")) {
        calendar(year, --month);
      } else {
        calendar(year, ++month);
      }
    })
  );
})();

async function loadTemplate() {
  const sectionProfile = document.querySelector(".section-profile");
  sectionProfile.innerHTML = `
          <article class="clock">
            <h2 class="a11y-hidden">clock</h2>
            <span class="time"></span>
          </article>
          <article class="profile">
            <h2 class="a11y-hidden">유저 프로필</h2>
            <img
              class="profile-img"
              src=" ${userData.profileImgURL || baseUrl+'/src/img/profile.png'}"
              alt="유저 프로필 이미지"
            />
            <span class="profile-name">${userData.nickname}</span>
            <div class="introduce-box">
              <p class="profile-introduce">
                ${userData.introduce}
              </p>
            </div>
          </article>
          <article class="calendar">
            <h2 class="a11y-hidden">달력</h2>
            <table>
              <caption>
                <time datetime="2023-04">
                  <span class="year">2023</span>년
                  <span class="month">4</span>월
                </time>
              </caption>
              <tbody>
                <tr>
                  <th scope="col">일</th>
                  <th scope="col">월</th>
                  <th scope="col">화</th>
                  <th scope="col">수</th>
                  <th scope="col">목</th>
                  <th scope="col">금</th>
                  <th scope="col">토</th>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <button type="button" class="prev">
              <span class="a11y-hidden">이전달</span>&#60;
            </button>
            <button type="button" class="next">
              <span class="a11y-hidden">다음달</span>&#62;
            </button>
          </article>
          <button class="btn-logout" type="button">logout</button>
  `;
  const links = document.querySelector(".links");
  links.innerHTML = `
    <a class="home-link"href="${baseUrl}/src/template/home.html">홈</a>
    <a class="diary-link" href="${baseUrl}/src/template/diaryList.html">다이어리</a>
    <a class="write-link" href="${baseUrl}/src/template/write.html">글작성</a>
    <a class="chatting-link" href="${baseUrl}/src/template/chatting.html">채팅방</a>
    <a class="game-link" href="${baseUrl}/src/template/miniGame.html">미니게임</a>
    <a class="photoAlbum-link" href="${baseUrl}/src/template/photoAlbum.html">사진첩</a>
    <a class="fortune-link" href="${baseUrl}/src/template/fortune.html">운세보기</a>
  `;
}
