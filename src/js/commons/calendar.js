"use strict";

export function calendar(newYear, newMonth) {
  // 1. 무슨 요일에 시작하는지 알아야 한다.
  const time = new Date(newYear, newMonth - 1, 1);
  // 2. 해당 월에 날이 며칠이나 있는지
  // const timeLength = 32 - new Data(newYear, newMonth - 1, 32).getDate();
  const timeLength = new Date(newYear, newMonth, 0).getDate();

  // 매달 1일을 구한 time 변수에 각각에 해당하는 연, 월, 일, 요일을 구해 변수에 넣는다.
  let year = time.getFullYear();
  let month = time.getMonth();
  let date = time.getDate();
  let day = time.getDay();

  const captionYear = document.querySelector(".year");
  const captionMonth = document.querySelector(".month");
  const timeEl = document.querySelector(".calendar time");
  const days = document.querySelectorAll("tr td");

  // 오늘날 배경 표시 초기가화 및 비어있는 날짜에 공백을 넣어 디자인을 맞춰줌
  for (let i = 0; i < days.length; i++) {
    days[i].classList.remove("today");
    days[i].innerHTML = "&nbsp";
  }

  for (let i = day; i < day + timeLength; i++) {
    if (
      year === new Date().getFullYear() &&
      month === new Date().getMonth() &&
      date === new Date().getDate()
    ) {
      days[i].classList.add("today");
    }
    days[i].textContent = date++;
  }

  captionYear.textContent = year;
  captionMonth.textContent = month + 1;
  timeEl.dateTime = `${year}-${month + 1}`;
}
