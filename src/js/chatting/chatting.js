'use strict';
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid@8.3.2?dts';
import { userData } from "../commons/commons.js";
import { fetchChatting, chatRef, setDoc, doc } from "../commons/firebase.js";
const $chattingBox = document.querySelector(".chatting-box");
const $chattingForm = document.querySelector(".chatting-form");
const $chattingInput = $chattingForm .querySelector("#input-chatting");
const $sendBtn = $chattingForm.querySelector(".btn-send");

fetchChatting($chattingBox);

$chattingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if(!$chattingInput.value.trim()) return;
  const message = $chattingInput.value.trim();
  const user = userData.nickname;
  const createdAt = new Date().getTime();
  const type = "added";
  const id = uuidv4()
  try {
    // Firestore에 새로운 메시지 추가
    await setDoc(doc(chatRef, id), {
      id,
      message,
      user,
      createdAt,
      type,
    });
    $chattingInput.value = "";
  } catch (error) {
    console.error(error);
  }
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