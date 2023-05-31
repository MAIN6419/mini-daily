import _ from "lodash";
import {
  fetchFirstPage,
  goToNextPage,
  goToPrevPage,
  variables,
} from "./chattingRoom_pageNation.js";


import "../../css/chattingRoom.css";
import "../../img/loading.gif";


const $sectionContents = document.querySelector(".section-contents");
const $roomList = $sectionContents.querySelector(".room-list");
const $loadingModal = $sectionContents.querySelector(".loading-modal");
const $pageNum = $sectionContents.querySelector(".page-num");

let keyword = "";


async function renderChattingRooms(data) {
  if (!data.length) {
    variables.hasNextPage = false;
    $roomList.innerHTML = `<li>현재 채팅방이 없습니다.</li>`;
    $loadingModal.classList.remove("active");
    $nextBtn.classList.add("inactive");
    $prevBtn.classList.add("inactive");
    return;
  }

  $pageNum.textContent = variables.currentPage + "/" + variables.totalPage;
  variables.hasNextPage
    ? $nextBtn.classList.remove("inactive")
    : $nextBtn.classList.add("inactive");

  $roomList.innerHTML = "";
  variables.currentPage > 1
    ? $prevBtn.classList.remove("inactive")
    : $prevBtn.classList.add("inactive");
  if (variables.currentPage === 1 && variables.totalPage === 1) {
    $prevBtn.classList.add("inactive");
    $nextBtn.classList.add("inactive");
  }
  if (variables.currentPage === variables.totalPage) {
    $nextBtn.classList.add("inactive");
  }
  for (const item of data) {
    const roomLi = document.createElement("li");
    item.isprivate;
    roomLi.className = item.isprivate ? "room private" : "room";

    const roomLink = document.createElement("a");
    roomLink.href = `chatting.html?id=${item.id}`;

    const roomTitle = document.createElement("h3");
    roomTitle.classList.add("room-title");
    roomTitle.textContent = `방이름 : ${item.title}`;

    const countState = document.createElement("span");
    countState.classList.add("count-state");
    if (item.users.length === item.limit) {
      countState.style.backgroundColor = "red";
    } else if (item.users.length >= Math.floor(item.limit / 2)) {
      countState.style.backgroundColor = "gold";
    } else {
      countState.style.backgroundColor = "yellowgreen";
    }
    const userCountBox = document.createElement("div");
    userCountBox.className = "user-countBox";

    const userCount = document.createElement("span");
    userCount.className = "user-count";
    userCount.textContent = `인원 : ${item.users.length}/${item.limit}`;

    roomLink.appendChild(roomTitle);
    userCountBox.appendChild(countState);
    userCountBox.appendChild(userCount);
    roomLink.appendChild(userCountBox);
    roomLi.appendChild(roomLink);
    $roomList.appendChild(roomLi);

    roomLink.addEventListener("click", async (e) => {
      if (item.users.length >= item.limit) {
        e.preventDefault();
        alert("입장가능한 인원수가 모두 찼습니다!");
        return;
      }
      if (item.isprivate) {
        e.preventDefault();
        modalPrompt(item);
      } else {
        location.href = `chatting.html?id=${item.id}`;
      }
    });
    $loadingModal.classList.remove("active");
  }
}

fetchFirstPage();

const $nextBtn = $sectionContents.querySelector(".btn-next");
const $prevBtn = $sectionContents.querySelector(".btn-prev");

$prevBtn.addEventListener("click", goToPrevPage);
$nextBtn.addEventListener("click", goToNextPage);

const $inputSearch = $sectionContents.querySelector(".input-search");
$inputSearch.addEventListener("input", (e) => {
  // 첫 글자 스페이스 방지 => 검색 최적화 스페이스가 된다면 검색이 이루어져서 불필요한 데이터 요청 발생
  if (e.target.value.length === 1 && e.target.value[0] === " ") {
    e.target.value = ""; // 입력한 값을 빈 문자열로 대체하여 막음
    return;
  }
  debounceSearch(e);
});

// 검색 기능
const debounceSearch = _.debounce(async (e) => {
  keyword = e.target.value;
  variables.prevFirstPage = null;
  variables.nextFirstPage = null; // 검색시 nextFirstPage를 지워줘야 검색했을때 페이지를 정상적으로 불러옴
  if (!e.target.value) {
    $roomList.innerHTML = "";
    variables.currentSnapshotUnsubscribe();
    await fetchFirstPage();
    return;
  }
  variables.currentSnapshotUnsubscribe();
  $roomList.innerHTML = "";
  await fetchFirstPage();
}, 500);

export { renderChattingRooms, keyword };
