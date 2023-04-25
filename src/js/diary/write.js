'use strict';
const data = JSON.parse(localStorage.getItem('diary')) || [];

const $inputTitle = document.querySelector(".input-title");
const $inputcontents= document.querySelector(".input-contents");
const $submitBtn = document.querySelector(".btn-submit");

$submitBtn.addEventListener('click', ()=>{
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
    const newPost = {
      id,
      title: $inputTitle.value,
      contents: $inputcontents.value,
      createdAt : new Date().getTime(),
    }
    data.unshift(newPost);
    localStorage.setItem('diary',JSON.stringify(data));
    $inputTitle.value = '';
    $inputcontents.value= '';
    location.href = `diary.html?id=${id}`;
  }

})


