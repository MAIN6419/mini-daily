const preBtn = document.querySelector(".pre-btn");
const nextBtn = document.querySelector(".next-btn");
const resetBtn = document.querySelector(".btn-reset");
const carousel = document.querySelector(".carousel");
const carouselWrapper = document.querySelector(".carousel-wrapper");
const totalCard = 8;
const fortuneData = [
  "오늘은 새로운 계획을 세우기 좋은 날입니다. 새로운 도전에 도전해보세요.",
  "인간관계에서 좋은 소식이 찾아올 수 있는 날입니다. 사람들과 이야기를 나누고 대화를 통해 관계를 개선해보세요.",
  "무언가를 시작하기에 좋은 날입니다. 지금 당장 행동에 옮겨보세요. 단, 계획을 세우고 미리 준비하는 것이 좋습니다.",
  "오늘은 돈과 관련된 일이 일어날 수 있는 날입니다. 기회를 놓치지 마세요. 금전운이 좋아지는 시기이니 무엇이든 시도해보세요.",
  "당신이 기다리고 있는 일이 이루어질 수 있는 좋은 날입니다. 기대해도 좋습니다. 하지만 이루어질 것이라는 보장은 없으니 천천히 기다려보세요.",
  "오늘은 건강에 좋은 선택을 해보세요. 건강은 늘 우리 곁에 있어야 합니다. 충분한 수면과 규칙적인 식습관을 유지하며 건강을 지켜보세요.",
  "가벼운 마음으로 일상을 즐기는 것이 좋은 결과를 가져올 수 있는 날입니다. 스트레스를 최대한 피하고 긍정적인 마인드로 생활해보세요.",
  "당신이 꾸준하게 노력한 결과가 드디어 보이기 시작할 수 있는 날입니다. 자신의 노력에 대해 자랑스러워할 때입니다. 하지만 더 많은 노력이 필요하다는 것도 잊지 마세요.",
  "오늘은 자신의 능력을 다시 한 번 확인할 수 있는 날입니다. 자신감을 가져보세요. 하지만 과도한 자신감은 오히려 좋지 않을 수 있습니다.",
  "긴 시간을 기다린 결과가 이루어질 수 있는 날입니다. 기대를 가져도 좋습니다. 하지만 결과에 대한 과도한 기대는 실망을 초래할 수 있습니다.",
  "오늘은 생각지 못한 사람으로부터 좋은 도움을 받을 수 있는 날입니다. 오히려 남들과 소통하는 것이 중요해보입니다. 협력적인 태도로 일을 해결해보세요.",
];
// 운세 데이터에서 랜덤하게 뽑은 데이터를 넣어줄 배열
const randomData = [];
let angle = 0;
// 현재 카드를 알기 위해서 사용
let index = 0;
let isWriteResult = false;

// 카드 요소 생성 함수 카드의 요소를 생성합니다.
settingCards();

// Dom에서 생성된 카드 요소들을 찾습니다.
const card = document.querySelectorAll(".card-inner");
const carouselCard = document.querySelectorAll(".card");
const fortuneResult = document.querySelectorAll(".fortune-result");
const fortuneTitle = document.querySelectorAll(".fortune-title");

// 카드별 각도와 거리를 부여해 줍니다.
setCardAngle(carouselCard);

// 캐러셀이 돌아갈 각도 구하기
const ratateAngle = 360 / totalCard;

// Math.tan를 사용 => 각도를 라디안 값으로 변환
const radian = ((ratateAngle / 2) * Math.PI) / 180;

//원의 중심점에서 떨어진 거리 구하기 (밑변의 길이 / tan(각도에 해당하는 라디안))
const colTz = Math.round(210 / 2 / Math.tan(radian));

// 초기 셀 각도 및 중심점에서 떨어진 거리 세팅
function setCardAngle(carouselCard) {
  carouselCard.forEach((el, idx) => {
    // 카드가 하나씩 배치되는 효과를 주기위해 setTimeout를 사용
    setTimeout(() => {
      el.style.transform = `rotateY(${
        ratateAngle * idx
      }deg) translateZ(${colTz}px)`;
    }, 300 * idx);
  });
}

// 클릭 시 회전 인자로 direction를 받아 'prev'인 경우 시계 방향으로 회전 'next'인 경우 반시계 방향으로 회전
function rotateCard(dir){
  // index는 현재 화면 중간에 있는 카드가 어떤거인지 알기 위해 사용
  // index를 통해 화면 중간에 있는 카드만 클릭 가능하게 함
  index = dir === 'prev' ? index-- : index++;
  if (index < 0) index = totalCard - 1;
  if(index > totalCard - 1) index = totalCard - 1;
  card.forEach((el) => (el.style.pointerEvents = "none"));
  // 현재 카드의 마우스 이벤트를 사용 가능하게함 
  card[index].style.pointerEvents = "all";
  // 회전 방향 구별
  dir === 'prev' ? angle += ratateAngle : angle -= ratateAngle;
  carousel.style.transform = `rotateY(${angle}deg)`;
}
// 각 버튼에 이벤트 부여
preBtn.addEventListener("click",  ()=>rotateCard('prev'));
nextBtn.addEventListener("click", ()=>rotateCard('next'));

// 버튼을 누르면 기존 진행된 운세보기가 초기화됨
resetBtn.addEventListener("click", () => {
  // 변수 초기화
  randomData.splice(0);
  angle = 0;
  index = 0;
  isWriteResult = false;

  // 다시 카드를 세팅
  settingCards();
  const card = document.querySelectorAll(".card-inner");
  const carouselCard = document.querySelectorAll(".card");
  const fortuneResult = document.querySelectorAll(".fortune-result");
  const fortuneTitle = document.querySelectorAll(".fortune-title");
  setCardAngle(carouselCard);
  card.forEach((v) => {
    v.style.pointerEvents = "auto";
    v.style.opacity = "1";
  });
  preBtn.style.pointerEvents = "auto";
  nextBtn.style.pointerEvents = "auto";
  card.forEach((el, idx) =>
  el.addEventListener("click", () => {
    el.classList.toggle("active");
    if (el.classList.contains("active")) {
      el.style.scale = "1.1";
      el.style.transform = `rotateY(180deg) translateY(-10%)`;
      setTimeout(() => {
        fortuneTitle[idx].style.opacity = 1;
        typing(fortuneResult[idx], fortuneData[randomData[idx]]);
      }, 500);
      card.forEach((v) => {
        v.style.pointerEvents = "none";
        if (v !== el) v.style.opacity = "0";
      });
      preBtn.style.pointerEvents = "none";
      nextBtn.style.pointerEvents = "none";
    } else {
      el.style.scale = "1.0";
      el.style.transform = "";
    }
  })
);
});

// 카드 요소를 생성하는 함수
function settingCards() {
  // 기존 카드 요소를 비움
  carousel.innerHTML = '';
  // 카드 데이터를 섞는다.
  shuffleData();
  for (let i = 0; i < totalCard; i++) {
    carousel.innerHTML += `
    <li class="card">
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">
       <h4 class="fortune-title">오늘의 운세</h4>
      <p class="fortune-result"></p>
      </div>
    </div>
   </li>
    `;
  }
}
 // 생성된 카드들에 이벤트를 부여함
  card.forEach((el, idx) =>
  el.addEventListener("click", () => {
    // 카드 클릭시 클래스에 active부여 => 카드의 classList에 active가 있으면 카드가 rotateY(180deg)가 되어 뒤집힘
    el.classList.toggle("active");
    if (el.classList.contains("active")) {
      // 카드가 뒤집힐 때 주는 효과
      el.style.scale = "1.1";
      el.style.transform = `rotateY(180deg) translateY(-10%)`;
      setTimeout(() => {
        fortuneTitle[idx].style.opacity = 1;
        typing(fortuneResult[idx], fortuneData[randomData[idx]]);
      }, 500);
      // 선택한 카드 이외에 다른 카드들을 안보이게 감추고 클릭을 막음
      card.forEach((v) => {
        v.style.pointerEvents = "none";
        if (v !== el) v.style.opacity = "0";
      });
      // 회전 버튼들도 클릭을 막음
      preBtn.style.pointerEvents = "none";
      nextBtn.style.pointerEvents = "none";
    } 
  })
);

// 운세 정보 데이터를 섞여주는 함수
function shuffleData() {
  while (randomData.length < 8) {
    const random = Math.floor(Math.random() * fortuneData.length);
    if (randomData.includes(random)) {
      continue;
    }
    randomData.push(random);
  }
}

// 운세 정보에 타이핑 효과(글자가 하나씩 나타나게)를 주는 함수
function typing(fortuneResult, message) {
  if (!isWriteResult) {
    isWriteResult = true;
    let letterIndex = 0;
    let letter = message.split("");
    const text = [];
    const interval = setInterval(() => {
      text.push(letter[letterIndex]);
      fortuneResult.textContent = text.join("");
      letterIndex++;
      if (text.length === letter.length) {
        clearInterval(interval);
        letterIndex = 0;
        isWriteResult = false;
        resetBtn.classList.add("active");
      }
    }, 60);
  }
}
