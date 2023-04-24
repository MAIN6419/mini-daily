"use strict";
initPhoto();

function fetchPhotoData() {
  return fetch("../db/db.json")
    .then((res) => res.json())
    .then((data) => data.photoData)
    .catch((error) => console.log(error));
}
// 데이터를 받은 후 처리 하기 위해 사용
async function initPhoto() {
  try {
    const $sectionContents = document.querySelector(".section-contents");
    const $prevBtn = $sectionContents.querySelector(".btn-prev");
    const $nextBtn = $sectionContents.querySelector(".btn-next");
    const $axisBtn = $sectionContents.querySelector(".axis-btn");
    const $carouselControler = $sectionContents.querySelector(
      ".carousel-controler"
    );
    const $carousel = $sectionContents.querySelector(".carousel");
    const $carouselWrapper = $sectionContents.querySelector(".carousel-wrapper");
    const $autoplayBtn = $sectionContents.querySelector(".autoplay-btn");
    const $dirBtn = $sectionContents.querySelector(".dir-btn");
    const $slider = $sectionContents.querySelector(".slider");
    const $playSpeed = $sectionContents.querySelector(".playSpeed span");
    const photoData = [];
    let angle = 0;
    let isAutoplay = false;
    let isChangePlayDir = false;
    let autoPlaySpeed = 1;
    let interval;

    const data = await fetchPhotoData();
    photoData.push(...data);

    settingCards();
    const $carouselCard = document.querySelectorAll(".card");
    cardAngle();

    const rotateAngle = 360 / $carouselCard.length;

    // Math.tan를 사용 => 각도를 라디안 값으로 변환
    const radian = ((rotateAngle / 2) * Math.PI) / 180;

    //원의 중심점에서 떨어진 거리 구하기 (밑변의 길이 / tan(각도에 해당하는 라디안))
    const colTz = Math.round(250 / 2 / Math.tan(radian));
    const rowTz = Math.round(160 / 2 / Math.tan(radian));

    // 초기 셀 각도 및 중심점에서 떨어진 거리 세팅
    function cardAngle() {
      $carouselCard.forEach((el, idx) => {
        el.style.background = `url(${photoData[idx]}) no-repeat center / cover #eee`;
        el.style.zIndex = `${-idx}`;
        setTimeout(() => {
          el.style.transform = `rotateY(${
            rotateAngle * idx
          }deg) translateZ(${colTz}px)`;
        }, 300 * idx);
      });
      setTimeout(() => {
        $prevBtn.classList.add("active");
        $nextBtn.classList.add("active");
        $carouselControler.classList.add("active");
      }, 300 * $carouselCard.length);
    }

    // 클릭 시 회전 시키기
    function rotateCards(e) {
      e.target === $prevBtn ? (angle += rotateAngle) : (angle -= rotateAngle);
      stopAutoPlay();
      $carousel.style.transform = $carousel.classList.contains("row")
        ? `rotateX(${angle}deg)`
        : `rotateY(${angle}deg)`;
    }
    $prevBtn.addEventListener("click", (e) => rotateCards(e));
    $nextBtn.addEventListener("click", (e) => rotateCards(e));

    function settingCards() {
      // fragement 사용 브라우저 최적화
      const frag = document.createDocumentFragment();
      for (let i = 0; i < photoData.length; i++) {
        const card = document.createElement("li");
        card.setAttribute("class", "card");
        frag.appendChild(card);
      }
      $carousel.appendChild(frag);
    }

    // 축 전환 시키기
    $axisBtn.addEventListener("click", () => {
      $carousel.classList.toggle("row");
      $carousel.style.transform = $carousel.classList.contains("row")
        ? `rotateX(${angle}deg)`
        : `rotateY(${angle}deg)`;
      if ($carousel.classList.contains("row")) {
        $carouselWrapper.style.perspectiveOrigin = "center";
        $carouselCard.forEach(
          (el, idx) =>
            (el.style.transform = `rotateX(${
              rotateAngle * idx
            }deg) translateZ(${rowTz}px)`)
        );
      } else {
        $carouselWrapper.style.perspectiveOrigin = "center -60%";
        $carouselCard.forEach(
          (el, idx) =>
            (el.style.transform = `rotateY(${
              rotateAngle * idx
            }deg) translateZ(${colTz}px)`)
        );
      }
    });

    $autoplayBtn.addEventListener("click", () => {
      isAutoplay = !isAutoplay;
      if (isAutoplay) {
        interval = setInterval(autoPlay, autoPlaySpeed * 1000);
      } else {
        stopAutoPlay();
      }
    });
    function autoPlay() {
      isChangePlayDir ? (angle += rotateAngle) : (angle -= rotateAngle);
      $carousel.style.transform = $carousel.classList.contains("row")
        ? `rotateX(${angle}deg)`
        : `rotateY(${angle}deg)`;
    }
    function stopAutoPlay() {
      isAutoplay = false;
      clearInterval(interval);
    }
    // autoplay 속도 설정
    $slider.addEventListener("input", () => {
      autoPlaySpeed = $slider.value;
      $playSpeed.innerHTML = $slider.value;
      if (isAutoplay) {
        clearInterval(interval);
        interval = setInterval(autoPlay, autoPlaySpeed * 1000);
      }
    });
    $dirBtn.addEventListener("click", () => {
      isChangePlayDir = !isChangePlayDir;
    });

    $slider.addEventListener("oninput", () => {
      autoPlaySpeed = $slider.value;
      $playSpeed.innerHTML = $slider.value;
      if (isAutoplay) {
        clearInterval(interval);
        interval = setInterval(autoPlay, autoPlaySpeed * 1000);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
