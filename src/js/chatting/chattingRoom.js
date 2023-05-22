import _ from "https://cdn.skypack.dev/lodash-es";
import {
  checkDeleteRoom,
  checkJoinRoom,
  createChattingRoom,
  db,
  fetchChattingRoom,
} from "../commons/firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  startAt,
  startAfter,
  endBefore,
  endAt,
  limit,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
const $sectionContents = document.querySelector(".section-contents");

const $roomList = $sectionContents.querySelector(".room-list");

const $createRoomModalBtn = $sectionContents.querySelector(
  ".btn-createRoomModal"
);
const $createRoomModal = $sectionContents.querySelector(".createRoom-modal");
const $createRoomModalDim = $createRoomModal.querySelector(".dim");
const $inputTitle = $createRoomModal.querySelector("#input-title");
const $inputLimit = $createRoomModal.querySelector("#input-limit");
const $chkPriavte = $createRoomModal.querySelector("#checkbox-private");
const $inputPassowrd = $createRoomModal.querySelector("#input-password");
const $createRoomBtn = $sectionContents.querySelector(".btn-createRoom");
const $createRoomCloseBtn = $createRoomModal.querySelector(".btn-close");
const $loadingModal = $sectionContents.querySelector(".loading-modal");

const $joinRoomModalBtn = $sectionContents.querySelector(".btn-joinRoomModal");
const $joinRoomModal = $sectionContents.querySelector(".joinRoom-modal");
const $joinRoomModalDim = $joinRoomModal.querySelector(".dim");
const $inputRoomId = $joinRoomModal.querySelector("#input-roomId");
const $joinRoomCloseBtn = $joinRoomModal.querySelector(".btn-close");
const $joinRoomBtn = $joinRoomModal.querySelector(".btn-join");

const $pageNum = $sectionContents.querySelector(".page-num");

let keyword = "";
let hasNextPage = false;
let nextFirstPage = null;
let prevFirstPage = null;
let currentPage = 1; // 현재 페이지 번호
let totalPage = 1;
let currentSnapshotUnsubscribe; // 현재 페이지의 onSnapshot 구독 객체

let baseUrl = "";
const host = window.location.host;
if (host.includes("github.io")) {
  baseUrl = "/mini-diary";
}

// createRoom 모달창 이벤트
$createRoomBtn.addEventListener("click", (e) => {
  e.preventDefault();
  $createRoomModal.classList.add("active");
  if (!$inputTitle.value.trim()) {
    alert("제목을 입력해주세요!");
    return;
  }
  if (!$inputLimit.value) {
    alert("최대 인원수 입력해주세요!");
    return;
  }
  if ($chkPriavte.checked) {
    if (!$inputPassowrd.value) {
      alert("비밀번호를 입력해주세요!");
      return;
    } else if ($inputPassowrd.value < 4) {
      alert("비밀번호는 최소 4자리 이상입니다!");
      return;
    }
  }
  const newRoom = {
    id: uuid.v4(),
    title: $inputTitle.value,
    limit: parseInt($inputLimit.value),
    isprivate: $chkPriavte.checked,
    password: $inputPassowrd.value || "",
    createdAt: new Date().getTime(),
  };
  createChattingRoom(newRoom);

  $inputPassowrd.value = "";
  $inputLimit.value = "";
  $inputTitle.value = "";
  $createRoomModal.classList.remove("active");
});

$createRoomModalBtn.addEventListener("click", () => {
  $createRoomModal.classList.add("active");
  $inputTitle.focus();
});
$createRoomModalDim.addEventListener("click", () => {
  $createRoomCloseBtn.click();
});
$createRoomCloseBtn.addEventListener("click", () => {
  $createRoomModal.classList.remove("active");
  $inputTitle.value = "";
  $inputPassowrd.value = "";
  $inputLimit.value = "";
  $chkPriavte.checked = false;
  $inputPassowrd.classList.remove("active");
});
$inputTitle.addEventListener("keydown", (e) => {
  if (e.keyCode === 9 && e.shiftKey) {
    e.preventDefault();
    $createRoomCloseBtn.focus();
  }
  if (e.keyCode === 32 && !e.target.value.trim()) {
    e.preventDefault();
    e.target.value = "";
  }
});
$createRoomCloseBtn.addEventListener("keydown", (e) => {
  if (e.keyCode === 9 && !e.shiftKey) {
    e.preventDefault();
    $inputTitle.focus();
  }
});

$inputPassowrd.addEventListener("input", (e) => {
  e.target.value = e.target.value.trim();
});

$inputLimit.addEventListener("change", (e) => {
  if (e.target.value > 100) {
    e.target.value = 100;
  } else if (e.target.value < 2) {
    e.target.value = 2;
  }
});

$chkPriavte.addEventListener("change", () => {
  $inputPassowrd.classList.toggle("active");
});

// joinRoom 모달창 이벤트
$joinRoomModalBtn.addEventListener("click", () => {
  $joinRoomModal.classList.add("active");
  $inputRoomId.focus();
});
$joinRoomModalDim.addEventListener("click", () => {
  $joinRoomCloseBtn.click();
});
$inputRoomId.addEventListener("input", (e) => {
  e.target.value = e.target.value.trim();
});
$joinRoomCloseBtn.addEventListener("click", () => {
  $joinRoomModal.classList.remove("active");
  $inputRoomId.value = "";
});
$joinRoomBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!$inputRoomId.value) {
    alert("입장할 채팅방 id를 입력해주세요.");
    return;
  }
  const res = await checkJoinRoom($inputRoomId.value);
  if (res) {
    if (res.isprivate) {
      modalPrompt(res);
    } else {
      location.href = `${baseUrl}/src/template/chatting.html?id=${res.id}`;
    }
  } else {
    alert("존재하지 않는 채팅방입니다!");
  }
});

$inputRoomId.addEventListener("keydown", (e) => {
  if (e.keyCode === 9 && e.shiftKey) {
    e.preventDefault();
    $joinRoomCloseBtn.focus();
  }
  if (e.keyCode === 32 && !e.target.value.trim()) {
    e.preventDefault();
    e.target.value = "";
  }
});
$joinRoomCloseBtn.addEventListener("keydown", (e) => {
  if (e.keyCode === 9 && !e.shiftKey) {
    e.preventDefault();
    $inputRoomId.focus();
  }
});

// 비밀번호 모달창
const $passwordModal = $sectionContents.querySelector(".password-modal");
const $passwordModalDim = $passwordModal.querySelector(".dim");
const $passwordModalConfirmBtn = $passwordModal.querySelector(".btn-confirm");
const $passwordModalCancleBtn = $passwordModal.querySelector(".btn-cancel");
const $passwordModalInput = $passwordModal.querySelector(".input-password");

$passwordModalInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.trim();
});
$passwordModalInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 9 && e.shiftKey) {
    e.preventDefault();
    $passwordModalCancleBtn.focus();
  }
});
$passwordModalCancleBtn.addEventListener("keydown", (e) => {
  if (e.keyCode === 9 && e.shiftKey) {
    e.preventDefault();
    $passwordModalConfirmBtn.focus();
  } else if (e.keyCode === 9) {
    e.preventDefault();
    $passwordModalInput.focus();
  }
});

function modalPrompt(roomData) {
  $passwordModal.classList.add("active");
  $passwordModalInput.focus();

  async function handleConfirm(e) {
    e.preventDefault();
    const value = $passwordModalInput.value;
    if (!value) {
      alert("비밀번호를 입력해주세요!");
      return;
    }
    if (value !== roomData.password) {
      alert("비밀번호가 일치하지 않습니다!");
      $passwordModalInput.value = "";
      return;
    }
    location.href = `${baseUrl}/src/template/chatting.html?id=${roomData.id}`;
    handleCancel();
  }
  function handleCancel() {
    $passwordModal.classList.remove("active");
    $passwordModalInput.value = "";
    $passwordModalConfirmBtn.removeEventListener("click", handleConfirm);
    $passwordModalCancleBtn.removeEventListener("click", handleCancel);
    $passwordModalDim.removeEventListener("click", handleCancel);
  }
  $passwordModalConfirmBtn.addEventListener("click", handleConfirm);
  $passwordModalCancleBtn.addEventListener("click", handleCancel);
  $passwordModalDim.addEventListener("click", handleCancel);
}

async function renderChattingRooms(data) {
  if (!data.length) {
    hasNextPage = false;
    $roomList.innerHTML = `<li>현재 채팅방이 없습니다.</li>`;
    $loadingModal.classList.remove("active");
    return;
  }

  $pageNum.textContent = currentPage + "/" + totalPage;
  hasNextPage
    ? $nextBtn.classList.remove("inactive")
    : $nextBtn.classList.add("inactive");

  $roomList.innerHTML = "";
  currentPage > 1
    ? $prevBtn.classList.remove("inactive")
    : $prevBtn.classList.add("inactive");
  if (currentPage === 1 && totalPage === 1) {
    $prevBtn.classList.add("inactive");
    $nextBtn.classList.add("inactive");
  }
  for (const item of data) {
    const roomLi = document.createElement("li");
    item.isprivate;
    roomLi.className = item.isprivate ? "room private" : "room";

    const roomLink = document.createElement("a");
    roomLink.href = `${baseUrl}/src/template/chatting.html?id=${item.id}`;

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
        location.href = `${baseUrl}/src/template/chatting.html?id=${item.id}`;
      }
    });
    $loadingModal.classList.remove("active");
  }
}

fetchFirstPage();

async function fetchFirstPage() {
  $loadingModal.classList.add("active");
  const chattingRoomRef = collection(db, "chatRoom");
  if (keyword.trim()) {
    const q = query(
      chattingRoomRef,
      orderBy("title"),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      limit(9)
    );
    return new Promise((resolve, reject) => {
      currentSnapshotUnsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          const data = snapshot.docs.map((el) => el.data()).slice(0, 9);
          const res = await getDocs(chattingRoomRef);
          totalPage = Math.ceil(res.docs.length / 9);
          hasNextPage = snapshot.docs.length === 9;
          resolve(data);
          renderChattingRooms(data);
        } catch (error) {
          reject(error);
        }
      });
    });
  } else {
    const q = query(chattingRoomRef, orderBy("createdAt", "desc"), limit(9));
    return new Promise((resolve, reject) => {
      currentSnapshotUnsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          // 현재 최신 전체 데이터 수를 불러옴
          const res = await getDocs(chattingRoomRef);
          totalPage = Math.ceil(res.docs.length / 9);
          const data = snapshot.docs.map((el) => el.data()).slice(0, 9);
          prevFirstPage = snapshot.docs[0];
          nextFirstPage = snapshot.docs[snapshot.docs.length - 1];
          hasNextPage = snapshot.docs.length === 9;
          resolve(data);
          renderChattingRooms(data);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

async function fetchPage(type) {
  const chattingRoomRef = collection(db, "chatRoom");
  let q;
  if (keyword.trim()) {
    q = query(
      chattingRoomRef,
      orderBy("title"),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      type === "prev" ? endBefore(prevFirstPage) : startAfter(nextFirstPage),
      limit(9)
    );
  } else {
    q = query(
      chattingRoomRef,
      orderBy("createdAt", "desc"),
      type === "prev" ? endBefore(prevFirstPage) : startAfter(nextFirstPage),
      type === "prev" && currentPage !== 1 ? limit(currentPage * 9) : limit(9)
    );
  }

  return new Promise((resolve, reject) => {
    let data;
    currentSnapshotUnsubscribe();
    currentSnapshotUnsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const res = await getDocs(chattingRoomRef);
        totalPage = Math.ceil(res.docs.length / 9);
        if (type === "prev" && currentPage !== 1) {
          data = snapshot.docs.map((el) => el.data()).slice((currentPage * 9) - 9, currentPage * 9);
          prevFirstPage = snapshot.docs[currentPage * 9 - 9];
          nextFirstPage = snapshot.docs[snapshot.docs.length - 1];
        } else {
          data = snapshot.docs.map((el) => el.data());
          prevFirstPage = snapshot.docs[0];
          nextFirstPage = snapshot.docs[snapshot.docs.length - 1];
        }

        hasNextPage = snapshot.docs.length === 9;
        resolve(data);
        renderChattingRooms(data);
      } catch (error) {
        reject(error);
      }
    });
  });
}

const $nextBtn = $sectionContents.querySelector(".btn-next");
const $prevBtn = $sectionContents.querySelector(".btn-prev");

$prevBtn.addEventListener("click", goToPrevPage);
$nextBtn.addEventListener("click", goToNextPage);

async function goToPrevPage() {
  if (currentPage > 1) {
    currentPage--;
    $pageNum.textContent = currentPage + "/" + totalPage;
    currentSnapshotUnsubscribe();
    fetchPage("prev");
  }
}

async function goToNextPage() {
  if (hasNextPage) {
    currentPage++;
    $pageNum.textContent = currentPage + "/" + totalPage;
    currentSnapshotUnsubscribe();
    fetchPage("next");
  }
}

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
  prevFirstPage = null;
  nextFirstPage = null; // 검색시 nextFirstPage를 지워줘야 검색했을때 페이지를 정상적으로 불러옴
  if (!e.target.value) {
    $roomList.innerHTML = "";
    currentSnapshotUnsubscribe();
    await fetchFirstPage();
    return;
  }
  currentSnapshotUnsubscribe();
  $roomList.innerHTML = "";
  await fetchFirstPage();
}, 500);
