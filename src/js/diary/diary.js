'use strict';
import { getCreatedAt } from "../commons/libray.js";

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
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const data = JSON.parse(localStorage.getItem("diary")) ||[];

  renderdiary();

function renderdiary() {
  const filterData = data.find((el) => el.id === id);
  if (!filterData) {
    $diaryTitle.textContent = '존재하지 않는 게시물';
    return;
  }
  
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
    const filterData = data.filter((el) => el.id !== id);
    data.splice(0);
    data.push(...filterData);
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
