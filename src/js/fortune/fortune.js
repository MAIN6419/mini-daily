const fortuneTitle = document.querySelector(".fortune-title");
const description = document.querySelector(".description");
const prevBtn = document.querySelector(".btn-prev");
const nextBtn = document.querySelector(".btn-next");
const resetBtn = document.querySelector(".btn-reset");
const carousel = document.querySelector(".carousel");
const carouselWrapper = document.querySelector(".carousel-wrapper");
const totalCard = 10;
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
  "오늘은 자신의 능력을 발휘할 수 있는 좋은 날입니다. 무엇이든 도전해보세요.",
  "인내심과 끈기를 가지고 일을 처리해보세요. 오늘은 그 노력이 보상받을 수 있는 날입니다.",
  "새로운 도전을 하기 전에 충분한 준비를 해보세요. 계획을 세우는 것이 중요합니다.",
  "오늘은 출장이나 여행 계획을 세우는 데 좋은 날입니다. 새로운 경험을 쌓을 수 있는 기회가 있을 수 있습니다.",
  "불안감이 들 수 있는 날입니다. 하지만 긍정적인 마인드를 유지하며, 지금 당장 할 수 있는 일에 집중해보세요.",
  "오늘은 자신의 감정을 솔직하게 표현해보는 것이 좋습니다. 소통이 중요합니다.",
  "기존의 문제를 해결할 수 있는 좋은 기회가 찾아올 수 있는 날입니다. 창의적인 해결책을 생각해보세요.",
  "오늘은 자신의 미래에 대한 비전을 생각해보는 데 좋은 날입니다. 목표를 설정하고 노력해보세요.",
  "인간관계에서 불화가 생길 수 있는 날입니다. 상대방의 의견에 대한 이해와 존중이 필요합니다.",
  "오늘은 돈과 관련된 일이 일어날 수 있는 날입니다. 조심스럽게 관리하고 사용해보세요.",
  "건강상의 문제가 발생할 수 있는 날입니다. 주의하며 건강을 지켜보세요.",
  "기존의 계획이 변경될 수 있는 날입니다. 유연한 대처가 필요합니다.",
  "오늘은 자신의 장점을 살려서 일을 처리해보세요. 자신감을 가지고 도전해보는 것이 좋습니다.",
  "불필요한 감정이 들 수 있는 날입니다. 집중력을 유지하며 일을 처리해보세요.",
  "오늘은 조용하게 시간을 보내는 것이 좋습니다. 마음의 안정을 취하는 것이 중요합니다.",
  "새로운 아이디어를 생각해내는 데 좋은 날입니다. 창의적인 생각을 자극하는 것이 좋습니다.",
  "오늘은 자신의 실력을 발휘할 수 있는 날입니다. 기회를 잡아보세요.",
];
// 운세 데이터에서 랜덤하게 뽑은 데이터를 넣어줄 배열
const randomData = [];
let angle = 0;
let index = 0;
let nextIndex = 0;
let lastIndex = totalCard - 1;
// 캐러셀이 돌아갈 각도 구하기
const rotateAngle = 360 / totalCard;
// Math.tan를 사용 => 각도를 라디안 값으로 변환
const radian = ((rotateAngle / 2) * Math.PI) / 180;
//원의 중심점에서 떨어진 거리 구하기 (밑변의 길이 / tan(각도에 해당하는 라디안))
const colTz = Math.round(210 / 2 / Math.tan(radian));

// 카드 요소 생성 함수 카드의 요소를 생성합니다.
settingCards();
// 카드 요소를 생성하는 함수
function settingCards() {
  // 기존 카드 요소를 비움
  carousel.innerHTML = "";
  // 카드 데이터를 섞는다.
  shuffleData();
  // 카드 요소 생성 총 카드의 개수 만큼 생성함
  for (let i = 0; i < totalCard; i++) {
    const card = document.createElement("li");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.setAttribute("class","card-inner active");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    const cardTitle = document.createElement("h4");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = "오늘의 운세";

    const fortuneResult = document.createElement("p");
    fortuneResult.classList.add("fortune-result");

    cardBack.appendChild(cardTitle);
    cardBack.appendChild(fortuneResult);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    card.appendChild(cardInner);

    carousel.appendChild(card);
  }
}

// Dom에서 생성된 카드 요소들을 찾습니다.
const cardInner = document.querySelectorAll(".card-inner");
const card = document.querySelectorAll(".card");
const fortuneResult = document.querySelectorAll(".fortune-result");
const cardTitle = document.querySelectorAll(".card-title");

// 카드별 각도와 거리를 부여해 줍니다.
setCardAngle(card, cardInner);
// 초기 셀 각도 및 중심점에서 떨어진 거리 세팅
function setCardAngle(card, cardInner) {
  card.forEach((el, idx) => {
    // 카드가 하나씩 배치되는 효과를 주기위해 setTimeout를 사용
    setTimeout(() => {
      el.style.transform = `rotateY(${
        rotateAngle * idx
      }deg) translateZ(${colTz}px)`;
    }, 300 * idx);
  });
  // 해당하는 각도에 모두 카드가 배치되면 버튼과 3개의 카드(이전, 현재, 다음) 클릭 활성화
  setTimeout(() => {
    prevBtn.classList.add("active");
    nextBtn.classList.add("active");
    cardInner[index].style.pointerEvents = "auto";
    cardInner[index + 1].style.pointerEvents = "auto";
    cardInner[lastIndex].style.pointerEvents = "auto";
    description.classList.add("active");
  }, 300 * totalCard + 300);
}

// 생성된 카드들에 이벤트를 부여함
cardInner.forEach((el, idx) =>
  el.addEventListener("click", () => {
    // 카드 클릭시 클래스에 active부여 => 카드의 classList에 active가 있으면 카드가 rotateY(180deg)가 되어 뒤집힘
    el.classList.toggle("flipped");
    if (el.classList.contains("flipped")) {
      // 카드가 뒤집히고 나면 
      // 카드의 각도를 없애주고(중심(0deg)으로 이동시킴), 중심축과의 거리는 유지 시킴
      card[idx].style.transform = `translateZ(${colTz}px)`;
      // 캐러셀의 각도 초기화
      carousel.style.transform = ``;
      setTimeout(() => {
        // 운세 제목을 서서히 나타나게 하기 위해 사용
        cardTitle[idx].classList.add("active");
        // 운세 결과가 한 글자씩 출력되도록 하는 함수
        typing(fortuneResult[idx], fortuneData[randomData[idx]]);
      }, 500);
      // 선택한 카드 이외에 다른 카드들을 안보이게 감추고 모든 카드 클릭을 막음
      cardInner.forEach((v) => {
        // 모든 카드들을 감추고 클릭을 막음
        v.classList.remove("active");
        // 현재 카드만 보이게함
        if (v === el) v.style.opacity = "1";
      });
      // 회전 버튼들의 이벤트를 지우고, 숨김처리
      prevBtn.removeEventListener("click", clickPrevBtn);
      nextBtn.removeEventListener("click", clickNextBtn);
      description.classList.remove("active");
      fortuneTitle.classList.remove("active");
      prevBtn.classList.remove("active");
      nextBtn.classList.remove("active");
      // 현재 운세결과를 로컬스토리지에 저장
      localStorage.setItem("fortune", fortuneData[randomData[idx]]);
    }
  })
);

// 각 버튼에 부여할 이벤트
const clickPrevBtn = () => rotateCard("prev", cardInner);
const clickNextBtn = () => rotateCard("next", cardInner);
// 각 버튼에 이벤트 부여
prevBtn.addEventListener("click", clickPrevBtn);
nextBtn.addEventListener("click", clickNextBtn);
// 클릭 시 회전 인자로 direction를 받아 'prev'인 경우 시계 방향으로 회전 'next'인 경우 반시계 방향으로 회전
function rotateCard(dir, cardInner) {
  // 회전 방향 구별
  dir === "prev" ? index-- : index++;
  // 인덱스가 범위 지정
  if (index > totalCard - 1) {
    index = 0;
  }
  if (index < 0) {
    index = totalCard - 1;
  }
  lastIndex = index === 0 ? 9 : index - 1;
  nextIndex = index === 9 ? 0 : index + 1;
  // 3장의 카드(이전, 현재, 다음)외 클릭이 되지 않도록 막음
  cardInner.forEach((el) => (el.style.pointerEvents = "none"));
  cardInner[lastIndex].style.pointerEvents = "auto";
  cardInner[index].style.pointerEvents = "auto";
  cardInner[nextIndex].style.pointerEvents = "auto";
  // 회전 방향에 따라 캐러셀 각도 더하거나 빼줌
  dir === "prev" ? (angle += rotateAngle) : (angle -= rotateAngle);
  carousel.style.transform = `rotateY(${angle}deg)`;
}

// 버튼을 누르면 기존 진행된 운세보기가 초기화됨
resetBtn.addEventListener("click", () => {
  resetBtn.classList.remove("active"); // 운세다시보기 버튼을 없앰
  randomData.splice(0);
  index = 0;
  lastIndex = totalCard - 1;
  angle = 0;

  // 다시 카드를 세팅
  settingCards();
  // 다시 세팅한 카드 요소들을 가져온다.
  const cardInner = document.querySelectorAll(".card-inner");
  const card = document.querySelectorAll(".card");
  const fortuneResult = document.querySelectorAll(".fortune-result");
  const cardTitle = document.querySelectorAll(".card-title");
  // 카드 각도 세팅 및 클릭할 수 있는 3장의 카드 활성화
  setCardAngle(card, cardInner);
  // 기존 버튼에 이벤트를 지우고 새로 이벤트를 넣어줘야한다. => 요소가 변했기 때문
  const clickPrevBtn = () => rotateCard("prev", cardInner);
  const clickNextBtn = () => rotateCard("next", cardInner);
  prevBtn.addEventListener("click", clickPrevBtn);
  nextBtn.addEventListener("click", clickNextBtn);
  fortuneTitle.classList.add("active");
  cardInner.forEach((el, idx) => {
    // 기존 숨김 처리를 복구, 클릭 활성화는 위의 setCardAngle에서 해주었기 때문에 따로 해주지 않음
    el.style.opacity = "1";
    // cardInner에 클릭 이벤트 부여 => 위에서 나온것과 동일
    el.addEventListener("click", () => {
      el.classList.toggle("flipped");
      if (el.classList.contains("flipped")) {
        card[idx].style.transform = `translateZ(${colTz}px)`;
        carousel.style.transform = ``;
        setTimeout(() => {
          cardTitle[idx].classList.add("active");
          typing(fortuneResult[idx], fortuneData[randomData[idx]]);
        }, 500);
        cardInner.forEach((v) => {
          v.style.pointerEvents = "none";
          if (v !== el) v.style.opacity = "0";
        });
        prevBtn.removeEventListener("click", clickPrevBtn);
        nextBtn.removeEventListener("click", clickNextBtn);
        prevBtn.classList.remove("active");
        nextBtn.classList.remove("active");
        fortuneTitle.classList.remove("active");
        description.classList.remove("active");
        localStorage.setItem("fortune", fortuneData[randomData[idx]]);
      }
    });
  });
});

// 운세 정보 데이터를 섞여주는 함수
function shuffleData() {
  while (randomData.length < totalCard) {
    const random = Math.floor(Math.random() * fortuneData.length);
    if (randomData.includes(random)) {
      continue;
    }
    randomData.push(random);
  }
}

// 운세 정보에 타이핑 효과(글자가 하나씩 나타나게)를 주는 함수
function typing(fortuneResult, message) {
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
      resetBtn.classList.add("active");
    }
  }, 60);
}
