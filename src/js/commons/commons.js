"use strict";
import * as DOMPurify from "dompurify";
import { updateTime } from "./clock.js";
import { calendar } from "./calendar.js";
import { checkLogin, logout } from "../firebase/auth/firebase_auth.js";
import "../../css/main.css";
import "../../css/reset.css";
import "../../img/icon-sprite.png";
import "../../img/bg.png";
import "../../img/weather-loading.gif";
import "../../img/sunset-bg.png";
import "../../img/profile.png";
import "../../img/404.png";

import { askForCoords } from "./weather.js";
export let userData;
if (!sessionStorage.getItem("userData")) {
  location.replace(`/`);
  alert("로그인 후 이용가능합니다!");
} else {
  userData = JSON.parse(sessionStorage.getItem("userData"));
}
await checkLogin(userData.nickname);

(async function () {
  await loadTemplate();
  const $logoutBtn = document.querySelector(".btn-logout");
  $logoutBtn.addEventListener("click", () => {
    logout();
  });
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
  const $weatherReloadBtn = document.querySelector(".weather .btn-reload");
  $weatherReloadBtn.addEventListener("click", reloadWeather);
})();

async function loadTemplate() {
  if (!localStorage.getItem("weather")) {
    try {
      await askForCoords();
    } catch (error) {
      console.error(
        "위치 정보 동의를 받지 않아 날씨 정보를 가져올 수 없습니다.",
        error
      );
    }
  }
  const sectionProfile = document.querySelector(".section-profile");
  const weatherInfo = JSON.parse(localStorage.getItem("weather")) || "";
  const isSunset =
    weatherInfo.currentTime >= weatherInfo.sunset ||
    weatherInfo.currentTime < weatherInfo.sunrise;
  sectionProfile.innerHTML = `
          <article class="clock">
            <h2 class="a11y-hidden">clock</h2>
            <time class="time" datatime="2023"></time>
          </article>
          <article class="profile">
            <h2 class="a11y-hidden">유저 프로필</h2>
            <img
              class="profile-img"
              src=" ${userData.profileImgURL || "./img/profile.png"}"
              alt="유저 프로필 이미지"
            />
            <span class="profile-name">${userData.nickname}</span>
            <h3 class="introduce-title">자기소개</h3>
            <div class="introduce-box">
              <p class="profile-introduce">
                ${DOMPurify.sanitize(userData.introduce)}
              </p>
            </div>
          </article>
          <article class="weather ${isSunset ? "sunset" : ""}">
          <h2 class="a11y-hidden">현재 날씨</h2>
          <div class="weather-info">
          <figure>
          <img class="weather-icon" src="http://openweathermap.org/img/w/${
            weatherInfo.icon
          }.png" alt="날씨 아이콘">
          <span class="weather-text">${weatherInfo.weatherText}</span>
          </figure>
          <span class="weather-temp">${weatherInfo.temp}&#8451;</span>
          <span class="weather-humidity">습도 ${weatherInfo.humidity}%</span>
          </div>
          <div class="wether-reload">
          <button class="btn-reload" type="button">
          <span class="a11y-hidden">
            날씨 정보 새로고침 버튼
          </span>
          </button>
          <span class="weather-time">${weatherInfo.reloadTime}</span>
          </div>
        <span class="weather-location">${weatherInfo.place}</span>
        <article class="weather-loading">
          <h2 class="a11y-hidden">날씨 로딩창</h2>
          <img src="../img/weather-loading.gif" alt="로딩중 이미지" />
          <span>Loading...</span>
        </article>
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
  if (!weatherInfo)
    document.querySelector(".weather").innerHTML =
      "위치정보 수집에 동의하지 않아 현재 날씨 정보를 받아올 수 없습니다!";
  const links = document.querySelector(".links");
  links.innerHTML = `
    <a class="home-link"href="home.html">홈</a>
    <a class="allDiary-link"href="allDiary.html">전체다이어리</a>
    <a class="myDiary-link" href="myDiary.html">마이다이어리</a>
    <a class="write-link" href="write.html">다이어리작성</a>
    <a class="chattingRoom-link" href="chattingRoom.html">채팅방</a>
    <a class="fortune-link" href="fortune.html">운세보기</a>
    <a class="mypage-link" href="mypage.html">마이페이지</a>
  `;
}

async function reloadWeather() {
  const $weatherLoading = document.querySelector(".weather-loading");
  $weatherLoading.classList.add("active");

  try {
     await askForCoords();
    const weatherInfo = JSON.parse(localStorage.getItem("weather"));
    const $weather = document.querySelector(".weather");
    const $weatherIcon = $weather.querySelector(".weather-icon");
    const $weatherHumidity = $weather.querySelector(".weather-humidity");
    const $weatherTime = $weather.querySelector(".weather-time");
    const $weatherText = $weather.querySelector(".weather-text");
    $weatherText.textContent = weatherInfo.weatherText;

    const isSunset =
      weatherInfo.currentTime >= weatherInfo.sunset ||
      weatherInfo.currentTime < weatherInfo.sunrise;
    if (isSunset) {
      $weather.classList.add("sunset");
    } else {
      $weather.classList.remove("sunset");
    }
    $weatherIcon.setAttribute(
      "src",
      `http://openweathermap.org/img/w/${weatherInfo.icon}.png`
    );
    $weatherHumidity.textContent = `습도 ${weatherInfo.humidity}%`;
    $weatherTime.textContent = weatherInfo.reloadTime;
  } catch (error) {
    console.error("날씨 정보를 다시 불러오는 중에 오류가 발생했습니다.", error);
    document.querySelector(".weather").innerHTML =
      "위치정보 수집에 동의하지 않아 현재 날씨 정보를 받아올 수 없습니다!";
  } finally {
    $weatherLoading.classList.remove("active");
  }
}
