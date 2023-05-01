'use strict';
import { userData } from "../commons/commons.js";
import { writeDiary } from "../commons/firebase.js";
const data = JSON.parse(localStorage.getItem('diary')) || [];

const $inputTitle = document.querySelector(".input-title");
const $inputcontents= document.querySelector(".input-contents");
const $submitBtn = document.querySelector(".btn-submit");

$submitBtn.addEventListener('click', async ()=>{
  // 유효성 검사
  if(!$inputTitle.value.trim()){
    alert("제목을 입력해주세요!");
    return;
  }
  if(!$inputcontents.value.trim()){
    alert("내용을 입력해주세요!");
    return;
  }
  if(confirm("정말 작성하시겠습니까?")){
    const id = uuid.v4();
    const newDiary = {
      id,
      auth: userData.nickname,
      title: $inputTitle.value,
      contents: $inputcontents.value,
      createdAt : new Date().getTime(),
    }
    // 데이터 추가 로직 => 데이터 넘겨줌 => 변경된 데이터 받아옴 => 렌더링(user에 정보를 넣는다)
    await writeDiary(newDiary);
    $inputTitle.value = '';
    $inputcontents.value= '';
    location.href = `diary.html?id=${id}`;
  }

})


