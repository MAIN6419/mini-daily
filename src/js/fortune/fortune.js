'use strict';
const fortuneTitle = document.querySelector(".fortune-title");
const description = document.querySelector(".description");
const prevBtn = document.querySelector(".btn-prev");
const nextBtn = document.querySelector(".btn-next");
const resetBtn = document.querySelector(".btn-reset");
const carousel = document.querySelector(".carousel");
const carouselWrapper = document.querySelector(".carousel-wrapper");
const totalCard = 10;
const fortuneData = [
  "당신은 마음의 평화를 찾을 것입니다. 하지만 이를 찾기 위해서는 어떠한 장애물도 어렵지 않게 넘어가야 할 것입니다. 그리고 그 과정에서 더욱 강해지고 자기 자신에게 더욱 믿음이 생길 것입니다. 자신감을 가지고 미래를 향해 나아가세요. 성공이 당신을 기다리고 있습니다.",
  "오늘은 새로운 사람을 만나게 될 것입니다. 그 사람은 당신의 인생에 큰 영향을 끼칠 것입니다. 오히려 당신이 그 사람에게 더 큰 영향을 끼치게 될 수도 있습니다. 서로에게 긍정적인 영향을 주고 받는 인연이 되길 바랍니다.",
  "성공을 위해서는 노력이 필요합니다. 그러나 노력만으로는 충분하지 않습니다. 인내와 인내력도 필요합니다. 다른 사람들이 보지 못하는 곳에서 꾸준한 노력을 하면 결국 보람을 느낄 수 있을 거예요.",
  "지금까지 해왔던 일들에 대한 보람을 느낄 수 있는 날입니다. 자신이 얼마나 많은 일을 해왔는지 돌아보며 뿌듯해하며 지난 시간을 돌아보는 것도 좋겠습니다. 하지만 더 중요한 것은 앞으로의 계획을 세우는 것입니다.",
  "삶은 언제나 변화합니다. 때로는 어려움이 찾아오기도 하지만 그것을 극복할 수 있는 힘은 당신 안에 있습니다. 지금 당장 포기하지 마시고, 더 강해질 수 있도록 노력해보세요.",
  "당신은 지금 매우 중요한 결정을 내려야 합니다. 이 결정은 당신의 인생을 크게 좌우할 것입니다. 주변의 조언을 들으며 신중하게 고민해보세요. 그러나 마음에 들지 않는 결정을 내릴 필요는 없습니다. 당신만의 선택을 해보세요.",
  "이번 주는 새로운 시작의 기회가 찾아올 것입니다. 어떤 일이든 시작하는 것은 쉽지 않지만, 그 일이 당신의 인생을 크게 바꿀 수 있다면 한 발짝 더 나아가 보세요. 그리고 어려움이 찾아올 때는 포기하지 마시고, 꾸준히 노력해보세요.",
  "가벼운 마음으로 일상을 즐기는 것이 좋은 결과를 가져올 수 있는 날입니다. 스트레스를 최대한 피하고 긍정적인 마인드로 생활해보세요.",
  "당신이 꾸준하게 노력한 결과가 드디어 보이기 시작할 수 있는 날입니다. 자신의 노력에 대해 자랑스러워할 때입니다. 하지만 더 많은 노력이 필요하다는 것도 잊지 마세요.",
  "당신은 오늘부터 새로운 시작을 할 준비가 되어 있습니다. 지금껏 했던 일들이나 불필요한 습관들은 모두 뒤로 두고 새로운 것들을 받아들이는 마음으로 머리를 비워보세요. 그리고 긍정적인 마인드를 가지고 새로운 도전에 나서보세요.",
  "긴 시간을 기다린 결과가 이루어질 수 있는 날입니다. 기대를 가져도 좋습니다. 하지만 결과에 대한 과도한 기대는 실망을 초래할 수 있습니다.",
  "오늘은 생각지 못한 사람으로부터 좋은 도움을 받을 수 있는 날입니다. 오히려 남들과 소통하는 것이 중요해보입니다. 협력적인 태도로 일을 해결해보세요.",
  "모든 것은 시간 문제입니다. 어떤 상황에서도 시간이 지나면 결국 해결될 것입니다. 중요한 것은 그 시간동안 최선을 다하는 것입니다. 그렇게 하면 결국에는 원하는 결과를 얻을 수 있을 거예요.",
  "지금 당신이 하는 일은 미래에 큰 도움이 될 것입니다. 지금처럼 꾸준히 노력하면, 더 나은 결과를 얻을 수 있을 것입니다. 하지만 지금 무리하게 너무 많은 일을 하려고 하면 오히려 역효과가 일어날 수 있습니다. 조심스럽게 계획을 세워보세요.",
  "모든 문제는 해결될 수 있습니다. 때로는 해결책을 찾기가 어려울 수도 있지만, 결국 해결책은 반드시 찾을 수 있습니다. 더 중요한 것은, 문제를 해결하기 위해 노력하는 것이죠.",
  "오늘은 당신의 감성이 예민해질 수 있습니다. 감정적인 부분에서 조금 더 조심스러워질 필요가 있습니다. 일을 처리할 때 감정적으로 대하지 마시고, 합리적으로 판단하세요.",
  "지금은 어려운 시기이지만, 우리는 언제나 새로운 시작을 할 수 있습니다. 무엇보다도, 자신의 믿음을 지켜나가는 것이 가장 중요합니다. 그렇게 하면 결국 성공할 수 있을 거예요.",
  "인생은 매우 짧은 여행입니다. 그러나 그 여정에서는 많은 것을 경험하게 됩니다. 어떤 상황에서도 자신의 믿음을 잃지 마시고, 노력하고 최선을 다해 살아보세요.",
  "이제부터는 자신의 가치를 높이 평가하는 것이 중요합니다. 자신의 능력을 믿고, 긍정적인 마인드로 새로운 도전을 받아들이면 좋은 결과를 얻을 수 있을 것입니다.",
  "인생은 가끔 기나긴 밤과 같습니다. 하지만 그 밤이 끝나면 언제나 새로운 아침이 찾아옵니다. 그리고 그 아침에는 더 나은 기회와 희망이 당신을 기다리고 있습니다.",
  "삶에는 항상 좋은 일이 있는 법입니다. 그러나 그것을 놓치지 않고, 이를 인식하고 받아들일 수 있어야 합니다. 그렇게 해서 당신은 더 행복한 인생을 살아갈 수 있습니다."
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
  // fragment 사용 브라우저 최적화
  const frag = document.createDocumentFragment();
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

    const fortuneResult = document.createElement("p");
    fortuneResult.classList.add("fortune-result");

    cardBack.appendChild(fortuneResult);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    card.appendChild(cardInner);
    frag.appendChild(card);
  }
  carousel.appendChild(frag);
}

// Dom에서 생성된 카드 요소들을 찾습니다.
const cardInner = document.querySelectorAll(".card-inner");
const card = document.querySelectorAll(".card");
const fortuneResult = document.querySelectorAll(".fortune-result");

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
      carouselWrapper.style.perspectiveOrigin = 'center'
      // 현재 운세결과를 로컬스토리지에 저장
      const newFortuneData = {
          result : fortuneData[randomData[idx]],
          createdAt : new Date().getTime()
        }
      localStorage.setItem("fortune", JSON.stringify(newFortuneData));
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
  // 카드 각도 세팅 및 클릭할 수 있는 3장의 카드 활성화
  setCardAngle(card, cardInner);
  // 기존 버튼에 이벤트를 지우고 새로 이벤트를 넣어줘야한다. => 요소가 변했기 때문
  const clickPrevBtn = () => rotateCard("prev", cardInner);
  const clickNextBtn = () => rotateCard("next", cardInner);
  prevBtn.addEventListener("click", clickPrevBtn);
  nextBtn.addEventListener("click", clickNextBtn);
  fortuneTitle.classList.add("active");
  carouselWrapper.style.perspectiveOrigin = 'center -50%';
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
        carouselWrapper.style.perspectiveOrigin = 'center';
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
