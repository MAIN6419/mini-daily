"use strict";
initGame();
function fetchSpritePos() {
  return fetch("../db/db.json")
    .then((res) => res.json())
    .then((data) => data.gameSpritePos)
    .catch((error) => console.log(error));
}

async function initGame() {
  const spritePos = await fetchSpritePos();
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
  let totalCard = 12;
  let checked = false;
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
  
  function cardSetting() {
    const $frag = document.createDocumentFragment();
    for (let i = 0; i < totalCard; i++) {
      const $card = document.createElement("div");
      const $cardInner = document.createElement("div");
      const $cardFront = document.createElement("div");
      const $cardBack = document.createElement("div");
      const $cardImg = document.createElement("div");
  
      $card.setAttribute("class", "card");
      $card.addEventListener("click", clickCard);
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
  function clickCard() {
    if (checked === false) {
      playSound(soundArray);
      this.classList.toggle("flipped");
      cardArray.push(this);
      cardArray[0].style.pointerEvents = "none";
  
      // 클릭한 카드의 수가 2가 아니면 함수 종료!
      if (cardArray.length !== 2) return;
  
      // 클릭한 카드의 수가 2개 이면 checked 값을 true 변경
      if (cardArray.length === 2) checked = !checked;
  
      // 카드 일치시
      if (
        cardArray[0].getAttribute("name") === cardArray[1].getAttribute("name")
      ) {
        setTimeout(() => playSound(soundArray3), 300);
        completedCards();
        return;
      }
  
      // 카드가 일치하지 않을 시
      setTimeout(function () {
        // 카드를 다시 뒤집음
        playSound(soundArray2);
        cardArray.forEach((card) => card.classList.toggle("flipped"));
        cardArray[0].style.pointerEvents = "auto";
        cardArray.splice(0);
        // 클릭한 카드의 수가 2개 이면 checked 값을 true 변경
        checked = !checked;
      }, 1000);
    }
  }
  
  function completedCards() {
    completedCardArray.push(cardArray[0]);
    completedCardArray.push(cardArray[1]);
    cardArray.forEach((el) => (el.style.pointerEvents = "none"));
    cardArray.splice(0);
    // 클릭한 카드의 수가 2개 이면 checked 값을 false 변경
  
    checked = !checked;
    // 완료카드수가 총 카드 수와 같을 때 게임 종료
    if (completedCardArray.length === totalCard) {
      clearInterval(timeInterval);
      const prevRecord = parseFloat(localStorage.getItem("gameRecord"));
      const newRecord = prevRecord > parseFloat(totalTime) ? true : false;
      setTimeout(() => {
        alert(
          newRecord
            ? `축하합니다. 신 기록 달성~\n 총 클리어 시간은 ${totalTime}초로 이전 기록 보다 ${(
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
  }
  $startBtn.addEventListener("click", startGame);
  
  function startGame() {
    $modal.classList.toggle("active");
    shuffle(randomCardArray1);
    shuffle(randomCardArray2);
    soundSetting(soundArray, "../audio/card_effect.mp3");
    soundSetting(soundArray2, "../audio/card_effect2.mp3");
    soundSetting(soundArray3, "../audio/card_effect3.wav");
    cardSetting();
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
      // 0.01초 마다 시간 체크 task queue 오차
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
}


