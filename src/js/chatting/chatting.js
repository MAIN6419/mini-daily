'use strict';
import {v4 as uuidv4} from 'uuid';
import { joinChatRoom, fetchChatting, addChatting, deleteChat, exitChattingRoom } from '../firebase/chatting/firebase_chatting.js';
import { getCreatedAt } from '../commons/libray.js';
import { FetchUserData, getSessionUser } from '../firebase/auth/firebase_auth.js';
import "../../css/chatting.css";

const $sectionContents = document.querySelector(".section-contents");
const $roomName = $sectionContents.querySelector(".room-name");
const $roomId =  $sectionContents.querySelector(".room-id");
const $copyBtn = $sectionContents.querySelector(".btn-copy");
const $chattingBox = document.querySelector(".chatting-box");
const $chattingForm = document.querySelector(".chatting-form");
const $chattingInput = $chattingForm .querySelector("#input-chatting");
const $sendBtn = $chattingForm.querySelector(".btn-send");

const $userInfoModal = $sectionContents.querySelector(".userInfo-modal");
const $loadingModal = document.querySelector(".loading-modal");
const $closeBtn = $userInfoModal.querySelector(".btn-close");

const urlParams = new URLSearchParams(window.location.search);
const chatRoomId = urlParams.get("id");
const userData = getSessionUser();

window.addEventListener("beforeunload", async () => {
  await exitChattingRoom(chatRoomId, userData.displayName)
});

$loadingModal.classList.add("active");
await joinChatRoom(chatRoomId, userData.displayName, rednerJoinUsers);
await fetchChatting($chattingBox, chatRoomId, renderChattingMsg);

$loadingModal.classList.remove("active");

$chattingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if(!$chattingInput.value.trim()) return;
  const newChat = {
    id: uuidv4(),
    message: $chattingInput.value.trim(),
    user: userData.displayName,
    createdAt: new Date().getTime(),
    type: "added"
  }
  await addChatting(chatRoomId, newChat);
  $chattingInput.value = "";
});
$chattingInput.addEventListener("paste", (e) => {
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData("text/plain");
  const totalLength = $chattingInput.value.length + pastedText.length;

  if (totalLength > 1000) {
    e.preventDefault();
    // 글자 수 초과 처리
    alert("최대 입력 가능한 글자 수는 1000자 입니다!");
  }
});
$chattingInput.addEventListener("keydown",(e)=>{
  if (e.keyCode === 13 && e.shiftKey && e.target.value.length >= 1000) {
    e.preventDefault();
    return;
  } else if (e.keyCode === 13 && e.shiftKey) { // 쉬프트 + 엔터키를 눌렀을 때
      e.preventDefault();
      const enterPost = $chattingInput.selectionStart;
      const value = $chattingInput.value;
  
      $chattingInput.value =
        value.substring(0, enterPost) +
        "\n" +
        value.substring(enterPost, value.length);
      // 커서 위치 조정
      $chattingInput.selectionStart = enterPost + 1;
      $chattingInput.selectionEnd = enterPost + 1;
      $chattingInput.scrollTop = $chattingInput.scrollHeight;
      return;
    } else if (e.keyCode === 13) { // 일반 엔터키를 눌렀을 때
      e.preventDefault();
      $sendBtn.click();
    }
})

async function renderChattingMsg(data, userInfo) {
  // 채팅 리스트에 새로운 메시지 추가

  const messageBox = document.createElement("div");
  messageBox.classList.add("message-box");
  messageBox.setAttribute("id", data.id);

  const messageImg = document.createElement("img");
  messageImg.classList.add("message-img");
  messageImg.src = userInfo.profileImgUrl||"./img/profile.png";
  messageImg.alt = "유저 프로필";

  const userGrade = document.createElement('span');
  userGrade.classList.add('user-grade');
  userGrade.textContent = userInfo.grade;

  if(userInfo.grade === "우수") {
    userGrade.classList.add("good");
  } else if(userInfo.grade === "프로") {
    userGrade.classList.add("pro");
  } else if(userInfo.grade === "VIP") {
    userGrade.classList.add("VIP");
  }

  const userName = document.createElement("span");
  userName.classList.add("user-name");
  userName.textContent = data.user;

  const message = document.createElement("p");
  message.classList.add("message");
  message.textContent = data.message;

  const createdAt = document.createElement("time");
  createdAt.classList.add("createdAt");
  createdAt.textContent = getCreatedAt(data.createdAt).slice(2);
  createdAt.setAttribute(
    "datetime",
    new Date(data.createdAt).toISOString()
  );
  const delBtn = document.createElement("button");
  delBtn.classList.add("btn-del");
  delBtn.textContent = "X";
  delBtn.addEventListener("click", async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
     await deleteChat(chatRoomId, data.id);
    }
  });

  // 작성자가 나인 경우
  if (data.user === userData.displayName) {
    messageBox.classList.add("sent");
  } else {
    // 작성자가 다른 경우
    messageBox.classList.add("received");
  }

  // 메시지 박스에 새로운 요소들 추가
  messageBox.appendChild(messageImg);
  messageBox.appendChild(userGrade);
  messageBox.appendChild(userName)
  messageBox.appendChild(message);
  messageBox.appendChild(createdAt);
  if (data.user === userData.displayName && data.type !== "delete") {
    messageBox.appendChild(delBtn);
  }

  // 채팅 리스트에 메시지 박스 추가
  $chattingBox.appendChild(messageBox);

}

async function rednerJoinUsers({users, limit, title, id}){
  const $joinCount = document.querySelector(".join-count");
  const $joinLists = document.querySelector(".join-lists");

  $joinLists.innerHTML = '';
  $roomName.textContent = `방 이름 : ${title}`;
  $roomId.textContent = `id : ${id}`
  $joinCount.textContent = `총 참여자 ${users.length}/${limit}`

  for (const user of users) {
    const userInfo = await FetchUserData(user);
    const listItem = document.createElement('li');
    listItem.classList.add('join-user');
  
    const profileImg = document.createElement('img');
    profileImg.classList.add('profile-img');
    profileImg.src = userInfo.profileImgUrl||'./img/profile.png';
    profileImg.alt = '유저 프로필 이미지';

    const userGrade = document.createElement('span');
    userGrade.classList.add('user-grade');
    userGrade.textContent = userInfo.grade;
    if(userInfo.grade === "우수") {
      userGrade.classList.add("good");
    } else if(userInfo.grade === "프로") {
      userGrade.classList.add("pro");
    } else if(userInfo.grade === "VIP") {
      userGrade.classList.add("VIP");
    }
    const userInfoButton = document.createElement('button');
    userInfoButton.classList.add('btn-userInfo');
  
    const userNameSpan = document.createElement('span');
    userNameSpan.classList.add('user-name');
    userNameSpan.textContent = user;
  
    userInfoButton.appendChild(userNameSpan);
  
    listItem.appendChild(profileImg);
    listItem.appendChild(userGrade);
    listItem.appendChild(userInfoButton);
  
    $joinLists.appendChild(listItem);

    userInfoButton.addEventListener("click", async ()=> {
      $userInfoModal.classList.add("active");
      const nickname = $userInfoModal.querySelector(".nickname");
      const grade = $userInfoModal.querySelector(".grade");
      const introduce = $userInfoModal.querySelector(".introduce-content");
      nickname.textContent = '닉네임 : ';
      grade.textContent = '등급 : '
      introduce.textContent = '';
      nickname.textContent = '닉네임 : ' + user;
      const currentUser = await FetchUserData(user);
      grade.textContent = '등급 : ' + currentUser.grade;
      introduce.textContent = currentUser.introduce;
    })
  }
  $chattingBox.scrollTop = $chattingBox.scrollHeight;
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

$userInfoModal.addEventListener("click", (e)=>{
  if(e.target===$userInfoModal || e.target===$closeBtn) {
    $userInfoModal.classList.remove("active");
  }
})

