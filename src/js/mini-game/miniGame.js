"use strict";
import {
  soundSetting,
  playSound,
  soundArray,
  soundArray2,
  soundArray3,
} from "./audio.js";
import { cardSetting, shuffle } from "./card.js";

const $sectionContents = document.querySelector(".section-contents");
const $gameWrapper = $sectionContents.querySelector(".game-wrapper");
const $timer = $sectionContents.querySelector(".timer-box span");
const $startBtn = $sectionContents.querySelector(".btn-start");
const $loadBtn = $sectionContents.querySelector(".btn-load");
const $modal = $sectionContents.querySelector(".modal-wrapper");
const $pauseBtn = $sectionContents.querySelector(".btn-pause");
const $resetBtn = $sectionContents.querySelector(".btn-reset");
const $bestRecord = $sectionContents.querySelector(".best-record");

const randomCardArray1 = [];
const randomCardArray2 = [];
const cardArray = [];
const completedCardArray = [];
let checked = false;
let totalCard = 12;
let timeInterval;
let startTime = 0;
let totalTime = 0;
let startPauseTime = 0;
let endPauseTime = 0;
let totalPauseTime = 0;

if (localStorage.getItem("gameRecord")) {
  $bestRecord.textContent = `최고기록 : ${localStorage.getItem(
    "gameRecord"
  )}초`;
} else {
  $bestRecord.textContent =
    "현재 게임 기록이 없습니다. 최고 기록에 도전해보세요!";
}

$startBtn.addEventListener("click", startGame);

async function startGame() {
  $modal.classList.toggle("active");
  shuffle(randomCardArray1);
  shuffle(randomCardArray2);
  soundSetting(soundArray, "../audio/card_effect.mp3");
  soundSetting(soundArray2, "../audio/card_effect2.mp3");
  soundSetting(soundArray3, "../audio/card_effect3.wav");
  await cardSetting();
  $gameWrapper.style.pointerEvents = "none";
  $pauseBtn.style.pointerEvents = "none";
  $resetBtn.style.pointerEvents = "none";
  const $card = document.querySelectorAll(".card");
  playSound(soundArray);
  for (let i = 0; i < $card.length; i++) {
    // 카드를 하나씩 뒤집히는 효과를 주기 위해 지연
    setTimeout(() => {
      $card[i].classList.add("flipped");
      playSound(soundArray);
    }, 1000 + 100 * i);
    // 카드가 모두 뒤집힌 뒤 카드를 1초 동안 보여주고 뒤집음
    setTimeout(() => {
      $card[i].classList.remove("flipped");
    }, 1000 + 1000 + 100 * totalCard);
  }
  setTimeout(() => {
    // 카드 뒤집기
    playSound(soundArray2);
    $gameWrapper.style.pointerEvents = "auto";
    $pauseBtn.style.pointerEvents = "auto";
    $resetBtn.style.pointerEvents = "auto";
    // 시작 시간 측정
    startTime = new Date().getTime();
    timeInterval = setInterval(() => {
      totalTime = ((new Date().getTime() - startTime) / 1000).toFixed(2);
      $timer.innerHTML = Math.floor(totalTime);
    }, 10);
  }, 1000 + 1000 + 100 * totalCard);
}

$loadBtn.addEventListener("click", () => {
  clearInterval(timeInterval);
  $modal.classList.remove("active");
  if (completedCardArray.length === totalCard) return;
  endPauseTime = new Date().getTime();
  totalPauseTime += endPauseTime - startPauseTime;
  timeInterval = setInterval(() => {
    totalTime = (
      (new Date().getTime() - startTime - totalPauseTime) /
      1000
    ).toFixed(2);
    if (totalTime < 0) totalTime = 0;
    $timer.innerHTML = Math.floor(totalTime);
  }, 10);
});

$pauseBtn.addEventListener("click", () => {
  clearInterval(timeInterval);
  $modal.classList.add("active");
  startPauseTime = new Date().getTime();
  $loadBtn.style.display = "inline-block";
  $startBtn.innerHTML = "다시하기";
  $startBtn.removeEventListener("click", startGame);
  $startBtn.addEventListener("click", resetGame);
});

$resetBtn.addEventListener("click", resetGame);
function resetGame() {
  cardArray.splice(0);
  completedCardArray.splice(0);
  randomCardArray1.splice(0);
  randomCardArray2.splice(0);
  totalTime = 0;
  totalPauseTime = 0;
  checked = false;
  clearInterval(timeInterval);
  $timer.innerHTML = 0;
  while ($gameWrapper.hasChildNodes()) {
    $gameWrapper.firstChild.remove();
  }
  startGame();
  $modal.classList.remove("active");
}

function setChecked(boolean) {
  checked = boolean
}

export {
  totalCard,
  randomCardArray1,
  randomCardArray2,
  completedCardArray,
  cardArray,
  timeInterval,
  startTime,
  totalTime,
  startPauseTime,
  endPauseTime,
  totalPauseTime,
  checked,
  setChecked
};
