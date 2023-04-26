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
