"use strict";

import { updateTime } from "./clock.js";
import { calendar } from "./calendar.js";
import { checkDeleteRoom, checkLogin, logout } from "./firebase.js";
export let userData;

const host = window.location.host;

let baseUrl = "";
if (host.includes("github.io")) {
  baseUrl = "/mini-diary";
}

if(!sessionStorage.getItem("userData")) {
  location.replace(`${baseUrl}/`);
  alert("로그인 후 이용가능합니다!");
}
else{
  userData = JSON.parse(sessionStorage.getItem("userData"));
}
  await checkLogin(userData.nickname);



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

// 채팅방 삭제 구독 => 전체 페이지에서 해주어야함 그래야 채팅방 페이지를 벗어나도 동작
// checkDeleteRoom()
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
    <a class="allDiary-link"href="${baseUrl}/src/template/allDiary.html">전체글</a>
    <a class="diary-link" href="${baseUrl}/src/template/diaryList.html">마이다이어리</a>
    <a class="write-link" href="${baseUrl}/src/template/write.html">글작성</a>
    <a class="chattingRoom-link" href="${baseUrl}/src/template/chattingRoom.html">채팅방</a>
    <a class="fortune-link" href="${baseUrl}/src/template/fortune.html">운세보기</a>
    <a class="mypage-link" href="${baseUrl}/src/template/mypage.html">마이페이지</a>
  `;
}
