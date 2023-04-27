"use strict";
import {
  playSound,
  resetSound,
  soundArray,
  soundArray2,
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

const randomCardArray = [];
const cardArray = [];
const completedCardArray = [];
const variables = { 
  checked : false, 
  totalCard : 12, 
  timeInterval : null, 
  totalTime: 0, 
  startTime: 0, 
  startPauseTime:0 ,
  endPauseTime: 0,
  totalPauseTime: 0,
  startFlipTime: 0,
  stopFlipTime:0,
  cardFliptimer: null
}


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
  shuffle();
  await cardSetting(); 
  $gameWrapper.style.pointerEvents = "none";
  $pauseBtn.style.pointerEvents = "none";
  $resetBtn.style.pointerEvents = "none";
  const $card = document.querySelectorAll(".card");
  
  for (let i = 0; i < $card.length; i++) {
    // 카드를 하나씩 뒤집히는 효과를 주기 위해 지연
    setTimeout(() => {
      $card[i].classList.add("flipped");
      playSound(soundArray);
    }, 1000 + 120 * i);
    // 카드가 모두 뒤집힌 뒤 카드를 0.5초 동안 보여주고 뒤집음
    setTimeout(() => {
      $card[i].classList.remove("flipped");
    }, 1000 + 500 + 120 * variables.totalCard);
    //  초기 딜레이 + 카드를 보여줄 시간 + 카드가 총 뒤집어지는 시간
  }
  setTimeout(() => {
    // 카드 뒤집기
    playSound(soundArray2);
    $gameWrapper.style.pointerEvents = "auto";
    $pauseBtn.style.pointerEvents = "auto";
    $resetBtn.style.pointerEvents = "auto";
    // 시작 시간 측정
    variables.startTime = new Date().getTime();
    variables.timeInterval = setInterval(() => {
      variables.totalTime = ((new Date().getTime() - variables.startTime) / 1000).toFixed(2);
      $timer.innerHTML = Math.floor(variables.totalTime);
    }, 10);
  }, 1000 + 500 + 120 * variables.totalCard);
}

$loadBtn.addEventListener("click", () => {
  variables.cardFliptimer = setTimeout(() => {  
    if (variables.totalTime !== 0 && variables.checked) {
      playSound(soundArray2);
      cardArray.forEach((card) => card.classList.toggle("flipped"));
      cardArray[0].style.pointerEvents = "auto";
      cardArray.splice(0);
    }
    variables.checked = false;
  }, 1000 - (variables.stopFlipTime - variables.startFlipTime));
  clearInterval(variables.timeInterval);
  $modal.classList.remove("active");
  if (completedCardArray.length === variables.totalCard) return;
  variables.endPauseTime = new Date().getTime();
  variables.totalPauseTime += variables.endPauseTime - variables.startPauseTime;
  variables.timeInterval = setInterval(() => {
    variables.totalTime = (
      (new Date().getTime() - variables.startTime - variables.totalPauseTime) /
      1000
    ).toFixed(2);
    if (variables.totalTime < 0) variables.totalTime = 0;
    $timer.innerHTML = Math.floor(variables.totalTime);
  }, 10);
});

$pauseBtn.addEventListener("click", () => {
  variables.stopFlipTime = Date.now();
  clearTimeout(variables.cardFliptimer); // 이전에 설정된 타이머 취소
  variables.cardFliptimer = null; // 클릭한 시점 초기화
  clearInterval(variables.timeInterval);
  $modal.classList.add("active");
  variables.startPauseTime = new Date().getTime();
  $loadBtn.style.display = "inline-block";
  $startBtn.innerHTML = "다시하기";
  $startBtn.removeEventListener("click", startGame);
  $startBtn.addEventListener("click", resetGame);
});

$resetBtn.addEventListener("click", resetGame);
function resetGame() {
  resetSound();
  cardArray.splice(0);
  completedCardArray.splice(0);
  randomCardArray.splice(0);
  variables.totalTime = 0;
  variables.totalPauseTime = 0;
  variables.checked = false;
  clearInterval(variables.timeInterval);
  $timer.innerHTML = 0;
  while ($gameWrapper.hasChildNodes()) {
    $gameWrapper.firstChild.remove();
  }
  startGame();
  $modal.classList.remove("active");
}

export {
  variables,
  randomCardArray,
  completedCardArray,
  cardArray,
};
