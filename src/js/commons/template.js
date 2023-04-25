"use strict";
import { updateTime } from "./clock.js";
import { calendar } from "./calendar.js";
import { changeLinks } from "./link.js";
const url = window.location.href;
const page = url.split('/').pop(); // 마지막 '/' 이후의 문자열을 추출합니다.
const pageName = page.split('.')[0]; // 파일 확장자를 제거하여 페이지 이름을 추출합니다.

$(document).ready(function () {
  const loadTemplate = () => {
    return new Promise(resolve => {
      $(".section-profile").load("./commons/section-profile.html", () => {
        resolve();
      });
    });
  }

  const loadLinks = () => {
    return new Promise(resolve => {
      $(".links").load("./commons/links.html", () => {
        resolve();
      });
    });
  }
 
  loadTemplate().then(() => {
    updateTime();
    calendar();
    setInterval(updateTime, 1000);
  });

  loadLinks().then(()=>{
    changeLinks();
  })
});