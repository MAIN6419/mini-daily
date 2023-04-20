const $links = document.querySelectorAll(".links a");
const url = window.location.href;
const page = url.split('/').pop(); // 마지막 '/' 이후의 문자열을 추출합니다.
const pageName = page.split('.')[0]; // 파일 확장자를 제거하여 페이지 이름을 추출합니다.
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

}
