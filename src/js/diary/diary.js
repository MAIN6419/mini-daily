'use strict';
import { getCreatedAt } from "../commons/libray.js";
import { FetchDiary, deleteDiary, editDiary } from "../commons/firebase.js";
const $sectionContents = document.querySelector(".section-contents");
const $diaryWrapper = $sectionContents.querySelector(".diary-wrapper");
const $diaryTitle = $diaryWrapper .querySelector(".diary-title");
const $diaryCreatedAt = $diaryWrapper .querySelector(".diary-createdAt");
const $diaryContents = $diaryWrapper .querySelector(".diary-contents");
const $editBtn = $diaryWrapper .querySelector(".btn-edit");
const $deleteBtn = $diaryWrapper .querySelector(".btn-del");

const $editForm = $sectionContents.querySelector(".edit-form");
const $candelBtn = $editForm.querySelector(".btn-cancel");
const $editCompletedBtn = $editForm.querySelector(".btn-editCompleted");
const $inputTitle = $editForm.querySelector(".input-title");
const $inputContents = $editForm.querySelector(".input-contents");
const $loadingModal = $sectionContents.querySelector(".loading-modal");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// preload된 데이터 가져오기
const diaryData = JSON.parse(sessionStorage.getItem("diaryData"));

const fetchData = async ()=> {
  // 만약 preload된 데이터가 있고, 데이터의 id가 urlParamsId값과 일치한다면 현재 preload된 데이터를 사용
  if(diaryData&&diaryData.id===id){
    return JSON.parse(sessionStorage.getItem("diaryData"));
  }
  // preload된 데이터가 없거나, preload된 데이터가 현재 다이어리 데이터와 일치하지 않는다면 서버에서 새로 데이터를 받음
  $loadingModal.classList.add("active");
   return await FetchDiary(id).then((res)=>{
    $loadingModal.classList.remove("active");
    return res;
  })
}
const data =  await fetchData() || [];
renderdiary();
function renderdiary() {

  if (!data) {
    $diaryTitle.textContent = '존재하지 않는 게시물';
    return;
  }
  
  $diaryTitle.textContent = data.title;
  $diaryCreatedAt.textContent = getCreatedAt(data.createdAt);
  $diaryCreatedAt.setAttribute(
    "datetime",
    new Date(data.createdAt).toISOString()
  );
  $diaryContents.textContent = data.contents;
}

$editBtn.addEventListener("click", () => {
  $editForm.classList.toggle("active");
  $diaryWrapper.classList.toggle("inactive");
  $inputTitle.value = data.title;
  $inputContents.value = data.contents;
});
$deleteBtn.addEventListener("click", async() => {
  if (confirm("정말 삭제하시겠습니까?")) {
    await deleteDiary(id);
    location.href = "diaryList.html";
    alert("삭제가 완료되었습니다.")
  }
});
$candelBtn.addEventListener("click", () => {
  $editForm.classList.toggle("active");
  $diaryWrapper.classList.toggle("inactive");
});
$editCompletedBtn.addEventListener("click", async () => {
  if(!$inputTitle.value.trim()){
    alert('제목을 입력해주세요!');
    return;
  }
  if(!$inputContents.value.trim()){
    alert('내용을 입력해주세요!');
    return;
  }
  if(data.title===$inputTitle.value&&data.contents===$inputContents.value){
    alert("수정한 내용이 없습니다!");
    return;
  }
  if (confirm("정말 수정하겠습니까?")) {
    $editForm.classList.toggle("active");
    $diaryWrapper.classList.toggle("inactive");
    $diaryTitle.textContent = $inputTitle.value;
    $diaryContents.textContent = $inputContents.value;
    await editDiary(id,$inputTitle.value,$inputContents.value);
    renderdiary();
    const newDiary = JSON.parse(sessionStorage.getItem("diaryData"));
    // preload 데이터 변경
    newDiary.title = $inputTitle.value;
    newDiary.contents = $inputContents.value;
    sessionStorage.setItem("diaryData", JSON.stringify(newDiary));
    
  }
});
