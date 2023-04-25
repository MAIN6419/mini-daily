"use strict";
import { updateTime } from "./clock.js";
import { calendar } from "./calendar.js";


loadTemplates();

async function loadTemplates() {
  // section-profile 템플릿을 받아옴
  const response1 = await fetch("/src/template/commons/section-profile.html");
  // 파싱
  const profileTemplate = await response1.text();
  // 템플릿을 넣을 기준요소
  const sectionProfile = document.querySelector(".section-profile");
  // 부모요소 안에 템플릿을 넣음
  sectionProfile.innerHTML += profileTemplate;

  // 위와 동일 => links 템플릿 불러오기
  const response2 = await fetch("/src/template/commons/links.html");
  const linksTemplate = await response2.text();
  const links = document.querySelector(".links");
  links.innerHTML += linksTemplate;

  updateTime();
  calendar();
  setInterval(updateTime, 1000);
}
