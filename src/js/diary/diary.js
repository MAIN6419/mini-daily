'use strict';
import { getCreatedAt } from "../commons/libray.js";
const $diaryTitle = document.querySelector(".diary-title");
const $diaryCreatedAt = document.querySelector(".diary-createdAt");
const $diaryContents = document.querySelector(".diary-contents");
const $editBtn = document.querySelector(".btn-edit");
const $deleteBtn = document.querySelector(".btn-del");
const $diaryWrapper = document.querySelector(".diary-wrapper");
const $editForm = document.querySelector(".edit-form");
const $candelBtn = document.querySelector(".btn-cancel");
const $editCompletedBtn = document.querySelector(".btn-editCompleted");
const $inputTitle = document.querySelector(".edit-form .input-title");
const $inputContents = document.querySelector(".edit-form .input-contents");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let data = [];

if (localStorage.getItem("diary")) {
  data = JSON.parse(localStorage.getItem("diary"));
}
if (data.length !== 0) {
  renderdiary();
}

function renderdiary() {
  const filterData = data.find((el) => el.id === id);
  $diaryTitle.textContent = filterData.title;
  $diaryCreatedAt.textContent = getCreatedAt(filterData.createdAt);
  $diaryCreatedAt.setAttribute(
    "datetime",
    new Date(filterData.createdAt).toISOString()
  );
  $diaryContents.textContent = filterData.contents;
}

$editBtn.addEventListener("click", () => {
  const filterData = data.find((el) => el.id === id);
  $editForm.classList.toggle("active");
  $diaryWrapper.classList.toggle("inactive");
  $inputTitle.value = filterData.title;
  $inputContents.value = filterData.contents;
});
$deleteBtn.addEventListener("click", () => {
  if (confirm("정말 삭제하시겠습니까?")) {
    data = data.filter((el) => el.id !== id);
    localStorage.setItem("diary", JSON.stringify(data));
    location.href = "diaryList.html";
  }
});
$candelBtn.addEventListener("click", () => {
  $editForm.classList.toggle("active");
  $diaryWrapper.classList.toggle("inactive");
});
$editCompletedBtn.addEventListener("click", () => {
  const filterData = data.find((el) => el.id === id);
  if(!$inputTitle.value.trim()){
    alert('제목을 입력해주세요!');
    return;
  }
  if(!$inputContents.value.trim()){
    alert('내용을 입력해주세요!');
    return;
  }
  if(filterData.title===$inputTitle.value&&filterData.contents===$inputContents.value){
    alert("수정한 내용이 없습니다!");
    return;
  }
  if (confirm("정말 수정 하겠습니까?")) {
    $editForm.classList.toggle("active");
    $diaryWrapper.classList.toggle("inactive");
    $diaryTitle.textContent = $inputTitle.value;
    $diaryContents.textContent = $inputContents.value;
    data.find((el, idx) => {
      if (el.id === id) {
        data[idx].title = $inputTitle.value;
        data[idx].contents = $inputContents.value;
        localStorage.setItem("diary", JSON.stringify(data));
      }
    });
  }
});
