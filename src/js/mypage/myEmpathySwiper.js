import { Swiper, Parallax, Navigation, Pagination} from 'swiper'
Swiper.use([ Parallax, Navigation, Pagination ]);
import 'swiper/swiper-bundle.min.css';

const swiper = new Swiper(".swiper-container", {
  slidesPerView: 4, // 한 슬라이드에 보여줄 갯수
  spaceBetween: 20, // 슬라이드 사이 여백
  loop: false, // 슬라이드 반복 여부
  pagination : true, // pager 여부
  loopAdditionalSlides: 1, // 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
  pagination: true, // pager 여부
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  observer: true,
  observeParents: true,
  parallax:true,
});


