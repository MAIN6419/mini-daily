const $gameWrapper = document.querySelector(".game-wrapper");
const $timer = document.querySelector(".timer-box span");
const $startBtn = document.querySelector(".btn-start");
const $loadBtn = document.querySelector(".btn-load");
const $modal = document.querySelector(".modal-wrapper");
const $pauseBtn = document.querySelector(".btn-pause");
const $resetBtn = document.querySelector(".btn-reset");
const $bestRecord = document.querySelector(".best-record");

const catSpriteInfo = [
  { x: -34 / 5, y: -64 / 5, width: 205 / 5, height: 182 / 5 },
  { x: -297 / 5, y: -289 / 5, width: 174 / 5, height: 190 / 5 },
  { x: -514 / 5, y: -1024 / 5, width: 205 / 5, height: 175 / 5 },
  { x: -1017 / 5, y: -1009 / 5, width: 174 / 5, height: 190 / 5 },
  { x: -1017 / 5, y: -754 / 5, width: 189 / 5, height: 212 / 5 },
  { x: -504 / 5, y: -527 / 5, width: 197 / 5, height: 174 / 5 },
];
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
let totalPauseTime = 0;

if(localStorage.getItem('gameRecord')){
  $bestRecord.textContent = `최고기록 : ${localStorage.getItem('gameRecord')}초`
}
else{
  $bestRecord.textContent = '현재 게임 기록이 없습니다. 최고 기록에 도전해보세요!'
}

function cardSetting() {
  for (let i = 0; i < totalCard; i++) {
    const $card = document.createElement("div");
    const $cardInner = document.createElement("div");
    const $cardFront = document.createElement("div");
    const $cardBack = document.createElement("div");
    const $cardImg = document.createElement("span");

    $card.setAttribute("class", "card");
    $card.addEventListener("click", clickCard);
    $cardInner.setAttribute("class", "card-inner");
    $cardFront.setAttribute("class", "card-front");
    $cardImg.setAttribute("class", "card-img");
    $cardBack.setAttribute("class", "card-back");
    $gameWrapper.appendChild($card);
    $card.appendChild($cardInner);
    $cardInner.appendChild($cardFront);
    $cardInner.appendChild($cardBack);
    $cardFront.appendChild($cardImg);

    if (i < totalCard / 2) {
      $cardImg.style.backgroundPosition = `${
        catSpriteInfo[randomCardArray1[i]].x
      }px ${catSpriteInfo[randomCardArray1[i]].y}px`;
      $cardImg.style.width = `${catSpriteInfo[randomCardArray1[i]].width}px`;
      $cardImg.style.height = `${catSpriteInfo[randomCardArray1[i]].height}px`;
      $card.setAttribute("name", randomCardArray1[i]);
    } else {
      $cardImg.style.backgroundPosition = `${
        catSpriteInfo[randomCardArray2[i % (totalCard / 2)]].x
      }px ${catSpriteInfo[randomCardArray2[i % (totalCard / 2)]].y}px`;
      $cardImg.style.width = `${
        catSpriteInfo[randomCardArray2[i % (totalCard / 2)]].width
      }px`;
      $cardImg.style.height = `${
        catSpriteInfo[randomCardArray2[i % (totalCard / 2)]].height
      }px`;
      $card.setAttribute("name", randomCardArray2[i % (totalCard / 2)]);
    }
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
function clickCard() {
  if (checked === false) {
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
      compareCards();
      return;
    }

    // 카드가 일치하지 않을 시
    setTimeout(function () {
      // 카드를 다시 뒤집음
      cardArray.forEach((card) => card.classList.toggle("flipped"));
      cardArray[0].style.pointerEvents = "auto";
      cardArray.splice(0);
      // 클릭한 카드의 수가 2개 이면 checked 값을 true 변경
      checked = !checked;
    }, 1000);
  }
}

function compareCards() {
  completedCardArray.push(cardArray[0]);
  completedCardArray.push(cardArray[1]);
  cardArray.forEach((el) => (el.style.pointerEvents = "none"));
  cardArray.splice(0);
  // 클릭한 카드의 수가 2개 이면 checked 값을 false 변경

  checked = !checked;
  // 완료카드수가 총 카드 수와 같을 때 게임 종료
  if (completedCardArray.length === totalCard) {
    clearInterval(timeInterval);
    const prevRecord = parseFloat(localStorage.getItem('gameRecord'))
    const newRecord =  prevRecord > parseFloat(totalTime) ? true : false;
    setTimeout(() => {
      alert(newRecord ? `축하합니다. 신 기록 달성~\n 총 클리어 시간은 ${totalTime}초로 이전 기록 보다 ${prevRecord - parseFloat(totalTime)}초 빠릅니다.`
      : 
      `총 클리어 시간은 ${totalTime}초 입니다.`);
      if(newRecord){
        localStorage.setItem('gameRecord', totalTime);
        $bestRecord.textContent = totalTime;
      }
      
    }, 500);
  }
}
$startBtn.addEventListener("click", startGame);

function startGame() {
  $modal.classList.toggle("active");
  shuffle(randomCardArray1);
  shuffle(randomCardArray2);
  cardSetting();
  $gameWrapper.style.pointerEvents = "none";
  $pauseBtn.style.pointerEvents = "none";
  $resetBtn.style.pointerEvents = "none";
  const $card = document.querySelectorAll(".card");
  for (let i = 0; i < $card.length; i++) {
    // 카드를 하나씩 뒤집히는 효과를 주기 위해 지연
    setTimeout(() => {
      $card[i].classList.add("flipped");
    }, 1000 + 100 * i);
    // 카드가 모두 뒤집힌 뒤 카드를 1초 동안 보여주고 뒤집음
    setTimeout(() => {
      $card[i].classList.remove("flipped");
    }, 1000 + 1000 + 100 * totalCard);
  }
  setTimeout(() => {
    // 카드 뒤집기
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
