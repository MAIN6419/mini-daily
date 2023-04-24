'use strict';
 function getCreatedAt(unixTime) {
  // new Date(유닉스 타임)을 해주면 현재 표준시를 구할 수 있습니다.
  const date = new Date(parseInt(unixTime));
  // 구한 표준시에서 연도를 구합니다.
  const year = date.getFullYear();
  // 구한 표준시에서 월을 구합니다.
  const month = `0${date.getMonth() + 1}`;
  // 구한 표준시에서 일을 구합니다.
  const day = `0${date.getDate()}`;
  // 구한 표준시에서 시간을 구합니다.
  const hour = `0${date.getHours()}`;
  // 구한 표준시에서 분을 구합니다.
  const minute = `0${date.getMinutes()}`;
  // const second = `0${date.getSeconds()}`; => 초가 까지 구하려면 사용하시면 됩니다.
  // 원하는 형식으로 날짜 형식으로 반환 해줍니다.
  return `${year}.${month.slice(-2)}.${day.slice(-2)} ${hour.slice(
    -2
  )}:${minute.slice(-2)}`;
}

