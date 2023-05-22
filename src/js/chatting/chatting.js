'use strict';
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid@8.3.2?dts';
import { userData } from "../commons/commons.js";
import { joinChatRoom, fetchChatting, addChatting, deleteChat } from "../commons/firebase.js";
import { getCreatedAt } from '../commons/libray.js';

// 인원수 확인 로직 추가

//===============================================
const $sectionContents = document.querySelector(".section-contents");
const $roomName = $sectionContents.querySelector(".room-name");
const $roomId =  $sectionContents.querySelector(".room-id");
const $copyBtn = $sectionContents.querySelector(".btn-copy");
const $chattingBox = document.querySelector(".chatting-box");
const $chattingForm = document.querySelector(".chatting-form");
const $chattingInput = $chattingForm .querySelector("#input-chatting");
const $sendBtn = $chattingForm.querySelector(".btn-send");
const $joinCount = document.querySelector(".join-count");
const $joinLists = document.querySelector(".join-lists");
const $loadingModal = document.querySelector(".loading-modal");
const urlParams = new URLSearchParams(window.location.search);
const chatRoomId = urlParams.get("id");


// 입장 제한
// if(parseInt(chatRoomId.slice(4)) > 6){
//   alert("존재하지않는 채팅방입니다.")
//   location.replace("?id=chat")
// }
$loadingModal.classList.add("active");
await joinChatRoom(chatRoomId, userData.nickname, rednerJoinUsers);
await fetchChatting($chattingBox, chatRoomId, renderChattingMsg);
$loadingModal.classList.remove("active");
$chattingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if(!$chattingInput.value.trim()) return;
  const newChat = {
    id: uuidv4(),
    message: $chattingInput.value.trim(),
    user: userData.nickname,
    createdAt: new Date().getTime(),
    type: "added"
  }
  await addChatting(chatRoomId, newChat);
  $chattingInput.value = "";
});

$chattingInput.addEventListener("keydown",(e)=>{
  // shift를 눌렀을경우 enter키 이벤트를 막기위해 e.preventDefault();
    if (e.keyCode === 13 && e.shiftKey) { // 쉬프트 + 엔터키를 눌렀을 때
      $chattingInput.value += "\n";
      e.preventDefault();
      return;
    } else if (e.keyCode === 13) { // 일반 엔터키를 눌렀을 때
      e.preventDefault();
      $sendBtn.click();
    }
})

function renderChattingMsg(data, prevDate, currentDate) {

  // 날짜가 달라졌을 때 새로운 날짜를 삽입
  if (!prevDate || prevDate.getDate() !== currentDate.getDate()) {
    const dateBox = document.createElement("div");
    dateBox.classList.add("date-box");

    const dateText = document.createElement("span");
    dateText.classList.add("date-text");
    dateText.innerText = `${currentDate.getFullYear()}년 ${
      currentDate.getMonth() + 1
    }월 ${currentDate.getDate()}일 ${
      ["일", "월", "화", "수", "목", "금", "토"][currentDate.getDay()] +
      "요일"
    }`;
    dateBox.appendChild(dateText);

    $chattingBox.appendChild(dateBox);
    prevDate = currentDate;
  }
  // 채팅 리스트에 새로운 메시지 추가
  const messageBox = document.createElement("div");
  messageBox.classList.add("message-box");

  const messageImg = document.createElement("img");
  messageImg.classList.add("message-img");
  messageImg.src = "../img/profile.png";
  messageImg.alt = "유저 프로필";

  const userName = document.createElement("span");
  userName.classList.add("user-name");
  userName.innerText = data.user;

  const message = document.createElement("p");
  message.classList.add("message");
  message.innerText = data.message;

  const createdAt = document.createElement("time");
  createdAt.classList.add("createdAt");
  createdAt.innerText = getCreatedAt(data.createdAt).slice(11);
  createdAt.setAttribute(
    "datetime",
    new Date(data.createdAt).toISOString()
  );
  const delBtn = document.createElement("button");
  delBtn.classList.add("btn-del");
  delBtn.innerText = "X";
  delBtn.addEventListener("click", async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteChat(chatRoomId, data.id);
    }
  });
  // 작성자가 나인 경우
  if (data.user === userData.nickname) {
    messageBox.classList.add("sent");
  } else {
    // 작성자가 다른 경우
    messageBox.classList.add("received");
  }

  // 메시지 박스에 새로운 요소들 추가
  messageBox.appendChild(messageImg);
  messageBox.appendChild(userName);
  messageBox.appendChild(message);
  messageBox.appendChild(createdAt);
  if (data.user === userData.nickname && data.type !== "delete") {
    messageBox.appendChild(delBtn);
  }

  // 채팅 리스트에 메시지 박스 추가
  $chattingBox.appendChild(messageBox);
  prevDate = currentDate;
}

function rednerJoinUsers({users, limit, title, id}){
  $joinLists.innerHTML = '';
  $roomName.textContent = `방 이름 : ${title}`;
  $roomId.textContent = `id : ${id}`
  $joinCount.textContent = `총 참여자 ${users.length}/${limit}`
  for(const user of users){
    $joinLists.innerHTML +=`
    <li class="join-user">
    <img class="profile-img" src="../img/profile.png" alt="유저 프로필 이미지">
    <span class="user-name">${user}</span>
  </li>
    `
  }
}
$copyBtn.addEventListener("click", copyId);

function copyId() {
  const el = document.createElement(`textarea`);
    el.value = $roomId.textContent.replace("id : ","")
    el.setAttribute(`readonly`, ``);
    document.body.appendChild(el);
    el.select();
    document.execCommand(`copy`);
    document.body.removeChild(el);
    alert('아이디가 복사되었습니다.');
}

