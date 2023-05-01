"use strict";
import {calendar} from "./calendar.js";
import { userData } from "./commons.js";
import { setFortune } from "./firebase.js";

export function updateTime() {
  // dom에서 시간을 표시하는 요소를 가져옵니다.
  const $time = document.querySelector(".time");
  // 현재 날짜 정보를 가져온다.
  const now = new Date();
  // 현재 hour을 가져온다.
  let hours = now.getHours();
  // 현재 minute을 가져온다.
  const minutes = now.getMinutes();
  // 현재 second을 가져온다.
  const seconds = now.getSeconds();
  // hour이 12 보다 작으면 AM 크다면 PM를 넣어준다.
  let ampm = now.getHours() < 12 ? "AM" : "PM";
  // 12시을 나눈 나머지를 넣는다. 만약 나머지가 0인 경우는 12시로 시간을 변경한다.
  hours = now.getHours() % 12 || 12;
  // 시간 자릿수 표현을 위해 값이 10보다 작다면 minutes 앞 seconds앞에 0를 붙인다.
  // 10보다 크다면 0를 생략한다.
  $time.textContent = `${ampm} ${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
  // 만약에 24시(00시00분00초)가 된다면 현재 달력을 새로 렌더링 해줌
  if (now.getHours() + now.getMinutes() + now.getSeconds() === 0) {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    calendar(year, month);
  }
}
