'use strict';
// dom에서 시간을 표시하는 요소를 가져옵니다.
const $time = document.querySelector(".time");
const fortune = localStorage.getItem('fortune');
function updateTime() {
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
  // 만약에 24시(00시00분00초)가 된다면 현재 달력을 새로 렌더링 해줌 => 달력 날짜 변경 및 날짜 표시 변경을 위해서
  if (now.getHours()+now.getMinutes()+now.getSeconds() === 0) {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    calendar(year, month);
  }
  // 하루가 지나면 운세보기 초기화
  if(fortune) {
    const fortuneCreatedAt = new Date(JSON.parse(fortune).createdAt);
    const currentDate = new Date();
    // 운세 데이터가 만들어진 날짜와 현재 날짜를 비교
    // 날짜 차이가 난다면 하루가 지난것 이므로 운세 데이터를 삭제
    if (currentDate.getDate() !== fortuneCreatedAt.getDate()) {
      localStorage.removeItem('fortune');
    }
  }
}
// 처음 화면에 출력될 때 1초후에 함수가 실행되기 때문에
// 1초 전 빈 화면이 나타나기 때문에 제일 처음 한 번 실행해 주어야 됩니다.
updateTime();
// 1초마다 updateTime() 함수 호출 1초 마다 시간을 갱신해줍니다.
setInterval(updateTime, 1000);
