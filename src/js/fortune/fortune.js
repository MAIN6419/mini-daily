"use strict";
import { userData } from "../commons/commons.js";
import { setFortune } from "../commons/firebase.js";
initFortune();

function fetchFortuneData() {
  return fetch("../db/db.json")
    .then((res) => res.json())
    .then((data) => data.fortuneData)
    .catch((error) => console.log(error));
}
// 데이터를 받아온 후 처리
async function initFortune() {
  try {
    const $sectionContents = document.querySelector(".section-contents");
    const $fortuneTitle = $sectionContents.querySelector(".fortune-title");
    const $description = $sectionContents.querySelector(".description");
    const $prevBtn = $sectionContents.querySelector(".btn-prev");
    const $nextBtn = $sectionContents.querySelector(".btn-next");
    const $resetBtn = $sectionContents.querySelector(".btn-reset");
    const $carouselWrapper = $sectionContents.querySelector(".carousel-wrapper");
    const $carousel = $carouselWrapper.querySelector(".carousel");

    const totalCard = 10;
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

    const fortuneData = await fetchFortuneData();

    // 카드 요소 생성 함수 카드의 요소를 생성합니다.
    settingCards();

    // Dom에서 생성된 카드 요소들을 찾습니다.
    const $card = $carousel.querySelectorAll(".card");
    const $cardInner = $carousel.querySelectorAll(".card-inner");
    const $fortuneResult = $carousel.querySelectorAll(".fortune-result");

    // 카드별 각도와 거리를 부여해 줍니다.
    setCardAngle($card, $cardInner);

    // 생성된 카드들에 이벤트를 부여함
    $cardInner.forEach((el, idx) =>
      el.addEventListener("click", () => {
        // 카드 클릭시 클래스에 active부여 => 카드의 classList에 active가 있으면 카드가 rotateY(180deg)가 되어 뒤집힘
        el.classList.toggle("flipped");
        if (el.classList.contains("flipped")) {
          // 카드가 뒤집히고 나면
          // 카드의 각도를 없애주고(중심(0deg)으로 이동시킴), 중심축과의 거리는 유지 시킴
          $card[idx].style.transform = `translateZ(${colTz}px)`;
          // 캐러셀의 각도 초기화
          $carousel.style.transform = ``;
          setTimeout(() => {
            // 운세 결과가 한 글자씩 출력되도록 하는 함수
            typing($fortuneResult[idx], fortuneData[randomData[idx]]);
          }, 500);
          // 선택한 카드 이외에 다른 카드들을 안보이게 감추고 모든 카드 클릭을 막음
          $cardInner.forEach((v) => {
            // 모든 카드들을 감추고 클릭을 막음
            v.classList.remove("active");
            // 현재 카드만 보이게함
            if (v === el) v.style.opacity = "1";
          });
          // 회전 버튼들의 이벤트를 지우고, 숨김처리
          $prevBtn.removeEventListener("click", clickPrevBtn);
          $nextBtn.removeEventListener("click", clickNextBtn);
          $description.classList.remove("active");
          $fortuneTitle.classList.remove("active");
          $prevBtn.classList.remove("active");
          $nextBtn.classList.remove("active");
          $carouselWrapper.style.perspectiveOrigin = "center";
          // 현재 운세결과를 로컬스토리지에 저장
          const newFortuneData = {
            result: fortuneData[randomData[idx]],
            createdAt: new Date().getTime(),
          };
          setFortune(userData.nickname, newFortuneData);
        }
      })
    );
    // 각 버튼에 부여할 이벤트
    const clickPrevBtn = (e) => rotateCard(e, $cardInner);
    const clickNextBtn = (e) => rotateCard(e, $cardInner);
    // 각 버튼에 이벤트 부여
    $prevBtn.addEventListener("click", clickPrevBtn);
    $nextBtn.addEventListener("click", clickNextBtn);
    // 카드 요소를 생성하는 함수
    function settingCards() {
      // fragment 사용 브라우저 최적화
      const frag = document.createDocumentFragment();
      // 기존 카드 요소를 비움
      $carousel.innerHTML = "";
      // 카드 데이터를 섞는다.
      shuffleData();
      // 카드 요소 생성 총 카드의 개수 만큼 생성함
      for (let i = 0; i < totalCard; i++) {
        const card = document.createElement("li");
        card.classList.add("card");

        const cardInner = document.createElement("div");
        cardInner.setAttribute("class", "card-inner active");

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
      $carousel.appendChild(frag);
    }

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
        $prevBtn.classList.add("active");
        $nextBtn.classList.add("active");
        cardInner[index].style.pointerEvents = "auto";
        cardInner[index + 1].style.pointerEvents = "auto";
        cardInner[lastIndex].style.pointerEvents = "auto";
        $description.classList.add("active");
      }, 300 * totalCard + 300);
    }

    function rotateCard(e, cardInner) {
      // 회전 방향 구별
      e.target === $prevBtn ? index-- : index++;
      // 인덱스가 범위 지정
      if (index > totalCard - 1) {
        index = 0;
      }
      if (index < 0) {
        index = totalCard - 1;
      }
      lastIndex = index === 0 ? totalCard - 1 : index - 1;
      nextIndex = index === totalCard - 1 ? 0 : index + 1;
      // 3장의 카드(이전, 현재, 다음)외 클릭이 되지 않도록 막음
      cardInner.forEach((el) => (el.style.pointerEvents = "none"));
      cardInner[lastIndex].style.pointerEvents = "auto";
      cardInner[index].style.pointerEvents = "auto";
      cardInner[nextIndex].style.pointerEvents = "auto";
      // 회전 방향에 따라 캐러셀 각도 더하거나 빼줌
      e.target === $prevBtn ? (angle += rotateAngle) : (angle -= rotateAngle);
      $carousel.style.transform = `rotateY(${angle}deg)`;
    }

    // 버튼을 누르면 기존 진행된 운세보기가 초기화됨
    $resetBtn.addEventListener("click", () => {
      // 운세다시보기 버튼을 없앰
      $resetBtn.classList.remove("active");
      randomData.splice(0);
      index = 0;
      lastIndex = totalCard - 1;
      angle = 0;
      // 다시 카드를 세팅
      settingCards();
      // 다시 세팅한 카드 요소들을 가져온다.
      const $cardInner = $carousel.querySelectorAll(".card-inner");
      const $card = $carousel.querySelectorAll(".card");
      const $fortuneResult = $carousel.querySelectorAll(".fortune-result");
      // 카드 각도 세팅 및 클릭할 수 있는 3장의 카드 활성화
      setCardAngle($card, $cardInner);
      // 기존 버튼에 이벤트를 지우고 새로 이벤트를 넣어줘야한다. => 요소가 변했기 때문
      const clickPrevBtn = (e) => rotateCard(e, $cardInner);
      const clickNextBtn = (e) => rotateCard(e, $cardInner);
      $prevBtn.addEventListener("click", clickPrevBtn);
      $nextBtn.addEventListener("click", clickNextBtn);
      $fortuneTitle.classList.add("active");
      $carouselWrapper.style.perspectiveOrigin = "center -50%";
      $cardInner.forEach((el, idx) => {
        // 기존 숨김 처리를 복구, 클릭 활성화는 위의 setCardAngle에서 해주었기 때문에 따로 해주지 않음
        el.style.opacity = "1";
        // cardInner에 클릭 이벤트 부여 => 위에서 나온것과 동일
        el.addEventListener("click", () => {
          el.classList.toggle("flipped");
          if (el.classList.contains("flipped")) {
            $card[idx].style.transform = `translateZ(${colTz}px)`;
            $carousel.style.transform = ``;
            setTimeout(() => {
              typing($fortuneResult[idx], fortuneData[randomData[idx]]);
            }, 500);
            $cardInner.forEach((v) => {
              v.style.pointerEvents = "none";
              if (v !== el) v.style.opacity = "0";
            });
            $prevBtn.removeEventListener("click", clickPrevBtn);
            $nextBtn.removeEventListener("click", clickNextBtn);
            $prevBtn.classList.remove("active");
            $nextBtn.classList.remove("active");
            $fortuneTitle.classList.remove("active");
            $description.classList.remove("active");
            $carouselWrapper.style.perspectiveOrigin = "center";
            const newFortuneData = {
              result: fortuneData[randomData[idx]],
              createdAt: new Date().getTime(),
            };
            setFortune(userData.nickname, newFortuneData);
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
          $resetBtn.classList.add("active");
        }
      }, 60);
    }
  } catch (error) {
    console.log(error);
  }
}
