import {
  totalCard,
  randomCardArray1,
  randomCardArray2,
  completedCardArray,
  cardArray,
  timeInterval,
  totalTime,
  checked,
  setChecked
} from "./miniGame.js";
import {
  playSound,
  soundArray,
  soundArray2,
  soundArray3,
} from "./audio.js";
const $sectionContents = document.querySelector(".section-contents");
const $gameWrapper = $sectionContents.querySelector(".game-wrapper");
const $bestRecord = $sectionContents.querySelector(".best-record");
function fetchSpritePos() {
  return fetch("../db/db.json")
    .then((res) => res.json())
    .then((data) => data.gameSpritePos)
    .catch((error) => console.log(new Error(error)));
}

async function cardSetting() {
  try {
    const spritePos = await fetchSpritePos();
    const $frag = document.createDocumentFragment();
    for (let i = 0; i < totalCard; i++) {
      const $card = document.createElement("div");
      const $cardInner = document.createElement("div");
      const $cardFront = document.createElement("div");
      const $cardBack = document.createElement("div");
      const $cardImg = document.createElement("div");

      $card.setAttribute("class", "card");
      $card.addEventListener("click", flippeCard);
      $cardInner.setAttribute("class", "card-inner");
      $cardFront.setAttribute("class", "card-front");
      $cardImg.setAttribute("class", "card-img");
      $cardBack.setAttribute("class", "card-back");
      $card.appendChild($cardInner);
      $cardInner.appendChild($cardFront);
      $cardInner.appendChild($cardBack);
      $cardFront.appendChild($cardImg);
      $frag.appendChild($card);

      if (i < totalCard / 2) {
        $cardImg.style.backgroundPosition = `${
          spritePos[randomCardArray1[i]].x
        }px ${spritePos[randomCardArray1[i]].y}px`;
        $cardImg.style.width = `${spritePos[randomCardArray1[i]].width}px`;
        $cardImg.style.height = `${spritePos[randomCardArray1[i]].height}px`;
        $card.setAttribute("name", randomCardArray1[i]);
      } else {
        $cardImg.style.backgroundPosition = `${
          spritePos[randomCardArray2[i % (totalCard / 2)]].x
        }px ${spritePos[randomCardArray2[i % (totalCard / 2)]].y}px`;
        $cardImg.style.width = `${
          spritePos[randomCardArray2[i % (totalCard / 2)]].width
        }px`;
        $cardImg.style.height = `${
          spritePos[randomCardArray2[i % (totalCard / 2)]].height
        }px`;
        $card.setAttribute("name", randomCardArray2[i % (totalCard / 2)]);
      }
    }
    $gameWrapper.appendChild($frag);
  } catch (error) {
    console.log(new Error(error));
  }
}
// 랜덤으로 0~8 난수를 뽑아 배열을 만들어 주는 함수 이것을 통해 카드의 이미지와 name이 달라짐
function shuffle(array) {
  while (array.length < totalCard / 2) {
    let randomNum = Math.floor((Math.random() * totalCard) / 2);
    if (array.indexOf(randomNum) === -1) {
      array.push(randomNum);
    }
  }
}
function flippeCard() {
  if (checked === false) {
    playSound(soundArray);
    this.classList.toggle("flipped");
    cardArray.push(this);
    cardArray[0].style.pointerEvents = "none";

    // 클릭한 카드의 수가 2가 아니면 함수 종료!
    if (cardArray.length !== 2) return;

    // 클릭한 카드의 수가 2개 이면 checked 값을 true 변경
    if (cardArray.length === 2) setChecked(true);

    // 카드 일치시
    if (
      cardArray[0].getAttribute("name") === cardArray[1].getAttribute("name")
    ) {
      setTimeout(() => playSound(soundArray3), 300);
      checkCompletedCards();
      return;
    }

    // 카드가 일치하지 않을 시
    setTimeout(function () {
      // 카드를 다시 뒤집음
      playSound(soundArray2);
      cardArray.forEach((card) => card.classList.toggle("flipped"));
      cardArray[0].style.pointerEvents = "auto";
      cardArray.splice(0);

      setChecked(false);
    }, 1000);
  }
}

function checkCompletedCards() {
  completedCardArray.push(cardArray[0]);
  completedCardArray.push(cardArray[1]);
  cardArray.forEach((el) => (el.style.pointerEvents = "none"));
  cardArray.splice(0);
  // 클릭한 카드의 수가 2개 이면 checked 값을 false 변경

  setChecked(false);
  // 완료카드수가 총 카드 수와 같을 때 게임 종료
  if (completedCardArray.length === totalCard) gameClear();
}

function gameClear() {
  clearInterval(timeInterval);
  const prevRecord = parseFloat(localStorage.getItem("gameRecord"));
  const newRecord = prevRecord > parseFloat(totalTime) ? true : false;
  setTimeout(() => {
    alert(
      newRecord
        ? `축하합니다. 신 기록 달성~\n총 클리어 시간은 ${totalTime}초로 이전 기록 보다 ${(
            prevRecord - parseFloat(totalTime)
          ).toFixed(2)}초 빠릅니다.`
        : `총 클리어 시간은 ${totalTime}초 입니다.`
    );
    if (!localStorage.getItem("gameRecord")) {
      localStorage.setItem("gameRecord", totalTime);
      $bestRecord.textContent = `최고기록 : ${totalTime}초`;
    }
    if (newRecord) {
      localStorage.setItem("gameRecord", totalTime);
      $bestRecord.textContent = `최고기록 : ${totalTime}초`;
    }
  }, 500);
}

export { cardSetting, shuffle };
