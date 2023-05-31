"use strict";
export function getCreatedAt(unixTime) {
  const date = new Date(parseInt(unixTime));
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`;
  const day = `0${date.getDate()}`;
  const hour = `0${date.getHours()}`;
  const minute = `0${date.getMinutes()}`;
  // const second = `0${date.getSeconds()}`;
  return `${year}.${month.slice(-2)}.${day.slice(-2)} ${hour.slice(
    -2
  )}:${minute.slice(-2)}`;
}

// 한국 표준시간으로 일치시키기
export function getKST() {
  const now = new Date(); // 현재 시간
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000; // 현재 시간을 utc로 변환한 밀리세컨드값
  const koreaTimeDiff = 9 * 60 * 60 * 1000; // 한국 시간은 UTC보다 9시간 빠름(9시간의 밀리세컨드 표현)
  const koreaNow = new Date(utcNow + koreaTimeDiff); // utc로 변환된 값을 한국 시간으로 변환시키기 위해 9시간(밀리세컨드)를 더함
  return koreaNow;
}

