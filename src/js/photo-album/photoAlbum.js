const preBtn = document.querySelector(".pre-btn");
const nextBtn = document.querySelector(".next-btn");
const axisBtn = document.querySelector(".axis-btn");
const carousel = document.querySelector(".carousel");
const carouselWrapper = document.querySelector(".carousel-wrapper");
const autoplayBtn = document.querySelector(".autoplay-btn");
const dirBtn = document.querySelector(".dir-btn");
const slider = document.querySelector(".slider");
const playSpeed = document.querySelector(".playSpeed span");
const photoData = [
  "https://cdn.pixabay.com/photo/2014/06/21/08/43/rabbit-373691_960_720.jpg",
  "https://cdn.pixabay.com/photo/2012/12/21/10/06/kitten-71514_960_720.jpg",
  "https://cdn.pixabay.com/photo/2016/06/05/22/42/otter-1438378_960_720.jpg",
  "https://cdn.pixabay.com/photo/2016/01/11/22/38/animal-1134504_960_720.jpg",
  "https://cdn.pixabay.com/photo/2016/11/23/13/31/red-panda-1852860_960_720.jpg",
  "https://cdn.pixabay.com/photo/2018/07/13/10/17/cat-3535399_960_720.jpg",
  "https://cdn.pixabay.com/photo/2012/02/28/10/24/animal-18218_960_720.jpg",
  "https://cdn.pixabay.com/photo/2015/02/05/12/09/chihuahua-624924_960_720.jpg",
];
let angle = 0;
let isAutoplay = false;
let isChangePlayDir = false;
let autoPlaySpeed = 1;

settingCards();
const carouselCard = document.querySelectorAll(".card");
cardAngle();
// 클릭했을 때 회전각도 구하기
const ratateAngle = 360 / carouselCard.length;

// Math.tan를 사용 => 각도를 라디안 값으로 변환
const radian = ((ratateAngle / 2) * Math.PI) / 180;

//원의 중심점에서 떨어진 거리 구하기 (밑변의 길이 / tan(각도에 해당하는 라디안))
const colTz = Math.round(250 / 2 / Math.tan(radian));
const rowTz = Math.round(160 / 2 / Math.tan(radian));

// 초기 셀 각도 및 중심점에서 떨어진 거리 세팅
function cardAngle() {
  carouselCard.forEach((el, idx) => {
    el.style.background = `url(${photoData[idx]}) no-repeat center / cover #eee`;
    el.style.zIndex = `${-idx}`;
    setTimeout(() => {
      el.style.transform = `rotateY(${
        ratateAngle * idx
      }deg) translateZ(${colTz}px)`;
    }, 300 * idx);
  });
  setTimeout(() => {
    preBtn.style.pointerEvents = "auto";
    nextBtn.style.pointerEvents = "auto";
    autoplayBtn.style.pointerEvents = "auto";
    axisBtn.style.pointerEvents = "auto";

  }, 300 * carouselCard.length);
}

// 클릭 시 회전 시키기
preBtn.addEventListener("click", () => {
  angle -= ratateAngle;
  stopAutoPlay();
  carousel.style.transform = carousel.classList.contains("row")
    ? `rotateX(${-angle}deg)`
    : `rotateY(${-angle}deg)`;
});

nextBtn.addEventListener("click", () => {
  angle += ratateAngle;
  stopAutoPlay();
  carousel.style.transform = carousel.classList.contains("row")
    ? `rotateX(${-angle}deg)`
    : `rotateY(${-angle}deg)`;
});

function settingCards() {
  for (let i = 0; i < photoData.length; i++) {
    carousel.innerHTML += `
    <li class="card"></li>
    `;
  }
}

// 축 전환 시키기
axisBtn.addEventListener("click", () => {
  carousel.classList.toggle("row");
  carousel.style.transform = carousel.classList.contains("row")
    ? `rotateX(${-angle}deg)`
    : `rotateY(${-angle}deg)`;
  if (carousel.classList.contains("row")) {
    carouselWrapper.style.perspectiveOrigin = "center";
    carouselCard.forEach(
      (el, idx) =>
        (el.style.transform = `rotateX(${
          ratateAngle * idx
        }deg) translateZ(${rowTz}px)`)
    );
  } else {
    carouselWrapper.style.perspectiveOrigin = "center -60%";
    carouselCard.forEach(
      (el, idx) =>
        (el.style.transform = `rotateY(${
          ratateAngle * idx
        }deg) translateZ(${colTz}px)`)
    );
  }
});

dirBtn.addEventListener('click',()=>{
  isChangePlayDir = !isChangePlayDir;
})

let interval = setInterval(autoPlay, autoPlaySpeed * 1000);
clearInterval(interval);
autoplayBtn.addEventListener("click", () => {
  isAutoplay = !isAutoplay;
  if (isAutoplay) {
    interval = setInterval(autoPlay, autoPlaySpeed * 1000);
  } else {
    stopAutoPlay();
  }
});
function autoPlay() {
  isChangePlayDir ? angle-=ratateAngle : angle += ratateAngle;
  carousel.style.transform = carousel.classList.contains("row")
    ? `rotateX(${-angle}deg)`
    : `rotateY(${-angle}deg)`;
}
 function stopAutoPlay() {
  isAutoplay = false;
  clearInterval(interval);
}
// autoplay 속도 설정
slider.addEventListener("input", () => {
  autoPlaySpeed = slider.value;
  playSpeed.innerHTML = slider.value;
  if (isAutoplay) {
    clearInterval(interval);
    interval = setInterval(autoPlay, autoPlaySpeed * 1000);
  }
});
function stopAutoPlay() {
  isAutoplay = false;
  clearInterval(interval);
}
slider.addEventListener('oninput' ,()=>{
  autoPlaySpeed = slider.value;
  playSpeed.innerHTML = slider.value;
  if (isAutoplay) {
    clearInterval(interval);
    autoplayBtnImg.setAttribute("src", "./images/stop.png");
    interval = setInterval(autoPlay, autoPlaySpeed * 1000);
  }
})