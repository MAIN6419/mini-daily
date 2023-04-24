'use strict';
const $links = document.querySelectorAll(".links a");
const url = window.location.href;
const page = url.split('/').pop(); // 마지막 '/' 이후의 문자열을 추출합니다.
const pageName = page.split('.')[0]; // 파일 확장자를 제거하여 페이지 이름을 추출합니다.
const $dailyLinks = document.querySelectorAll(".daily-link");

changeLinks();
function changeLinks(){
  $links.forEach(el=>el.classList.remove("active"));
  if(pageName===''){
    $links[0].classList.add("active");
  }
  else if(pageName==='dailyList'||pageName==='daily'){
    $links[1].classList.add("active");
  }
  else if(pageName==='write'){
    $links[2].classList.add("active");
  }
  else if(pageName==='miniGame'){
    $links[3].classList.add("active");
    $links[3].style.backgroundColor = 'aliceblue';
  }
  else if(pageName==='photoAlbum'){
    $links[4].classList.add("active");
    $links[4].style.backgroundColor = '#bdbdbd';
  }
  else{
    $links[5].classList.add("active");
    $links[5].style.backgroundColor = '#0b0b0d';
    $links[5].style.color = '#fff';
  }
}




