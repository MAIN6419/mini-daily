"use strict";
import {
  randomCardArray,
  completedCardArray,
  cardArray,
  variables,
} from "./miniGame.js";
import { playSound, soundArray, soundArray2, soundArray3, soundSetting } from "./audio.js";
import { FetchUserData, setGameRecord } from "../commons/firebase.js";
import { userData } from "../commons/commons.js";
const $sectionContents = document.querySelector(".section-contents");
const $gameWrapper = $sectionContents.querySelector(".game-wrapper");
const $bestRecord = $sectionContents.querySelector(".best-record");
let recordData;
function fetchSpritePos() {
  return fetch("../db/db.json")
    .then((res) => res.json())
    .then((data) => data.gameSpritePos)
    .catch((error) => console.log(new Error(error)));
}

async function cardSetting() {
  try {
    // 카드에 적용할 효과음을 불러옴
    recordData = (await FetchUserData(userData.nickname)).gameRecord;
    soundSetting(soundArray, "../audio/card_effect.mp3");
    soundSetting(soundArray2, "../audio/card_effect2.mp3");
    soundSetting(soundArray3, "../audio/card_effect3.wav");

    const spritePos = await fetchSpritePos();
    const $frag = document.createDocumentFragment();
    for (let i = 0; i < variables.totalCard; i++) {
      const $card = document.createElement("div");
      const $cardInner = document.createElement("div");
      const $cardFront = document.createElement("div");
      const $cardBack = document.createElement("div");
      const $cardImg = document.createElement("div");

      $card.setAttribute("class", "card");
      $card.addEventListener("click", flipCard);
      $cardInner.setAttribute("class", "card-inner");
      $cardFront.setAttribute("class", "card-front");
      $cardImg.setAttribute("class", "card-img");
      $cardBack.setAttribute("class", "card-back");
      $card.appendChild($cardInner);
      $cardInner.appendChild($cardFront);
      $cardInner.appendChild($cardBack);
      $cardFront.appendChild($cardImg);
      $frag.appendChild($card);

      $cardImg.style.backgroundPosition = `${
        spritePos[randomCardArray[i]].x
      }px ${spritePos[randomCardArray[i]].y}px`;
      $cardImg.style.width = `${spritePos[randomCardArray[i]].width}px`;
      $cardImg.style.height = `${spritePos[randomCardArray[i]].height}px`;
      $card.setAttribute("data-id", randomCardArray[i]);
    }
    $gameWrapper.appendChild($frag);
    playSound(soundArray);
  } catch (error) {
    console.log(new Error(error));
  }
}


function shuffle() {
  const random1 = getRandom();
  const random2 = getRandom();
  randomCardArray.push(...random1, ...random2);
}

function getRandom() {
  const randomArray = [];
  while (randomArray.length < variables.totalCard / 2) {
    const random = Math.floor((Math.random() * variables.totalCard) / 2);
    if (randomArray.includes(random)) {
      continue;
    }
    randomArray.push(random);
  }
  return randomArray;
}
function flipCard() {
  if (!variables.checked) {
    playSound(soundArray);
    this.classList.toggle("flipped");
    cardArray.push(this);
    cardArray[0].style.pointerEvents = "none";

    // 클릭한 카드의 수가 2가 아니면 함수 종료!
    if (cardArray.length !== 2) return;

    // 클릭한 카드의 수가 2개 이면 checked 값을 true 변경
    if (cardArray.length === 2) variables.checked = true;

    // 카드 일치시
    if (
      cardArray[0].dataset.id === cardArray[1].dataset.id 
    ) {
      setTimeout(() => {
        if (variables.totalTime !== 0) {
          playSound(soundArray3);
        }
      }, 300);
      checkCompletedCards();
      return;
    }

    // 카드가 일치하지 않을 시 카드를 다시 뒤집음
    variables.startFlipTime = Date.now(); // 클릭한 시점을 저장
    variables.cardFliptimer = setTimeout(() => {
      if (variables.totalTime !== 0) {
        playSound(soundArray2);
        cardArray.forEach((card) => card.classList.toggle("flipped"));
        cardArray[0].style.pointerEvents = "auto";
        cardArray.splice(0);
      }
      variables.checked = false;
    }, 1000);
  }
}

function checkCompletedCards() {
  completedCardArray.push(cardArray[0]);
  completedCardArray.push(cardArray[1]);
  cardArray.forEach((el) => (el.style.pointerEvents = "none"));
  cardArray.splice(0);
  // 클릭한 카드의 수가 2개 이면 checked 값을 false 변경

  variables.checked = false;
  // 완료카드수가 총 카드 수와 같을 때 게임 종료
  if (completedCardArray.length === variables.totalCard) gameClear();
}

function gameClear() {
  console.log(recordData)
  clearInterval(variables.timeInterval);
  const newRecord = parseFloat(recordData) > parseFloat(variables.totalTime) ? true : false;
  setTimeout(() => {
    alert(
      newRecord
        ? `축하합니다. 신 기록 달성~\n총 클리어 시간은 ${variables.totalTime}초로 이전 기록 보다 ${(
          parseFloat(recordData) - parseFloat(variables.totalTime)
          ).toFixed(2)}초 빠릅니다.`
        : `총 클리어 시간은 ${variables.totalTime}초 입니다.`
    );
    if (!recordData) {
      setGameRecord(userData.nickname, parseFloat(variables.totalTime));
      $bestRecord.textContent = `최고기록 : ${variables.totalTime}초`;
    }
    if (newRecord) {
      setGameRecord(userData.nickname, parseFloat(variables.totalTime))
      $bestRecord.textContent = `최고기록 : ${variables.totalTime}초`;
    }
  }, 500);
}

export { cardSetting, shuffle };
