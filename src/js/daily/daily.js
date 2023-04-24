'use strict';
import { getCreatedAt } from "../commons/libray.js";
const $dailyTilte = document.querySelector(".daily-title");
const $dailyCreatedAt = document.querySelector(".daily-createdAt");
const $dailyContents = document.querySelector(".daily-contents");
const $editBtn = document.querySelector(".btn-edit");
const $deleteBtn = document.querySelector(".btn-del");
const $dailyWrapper = document.querySelector(".daily-wrapper");
const $editForm = document.querySelector(".edit-form");
const $candelBtn = document.querySelector(".btn-cancel");
const $editCompletedBtn = document.querySelector(".btn-editCompleted");
const $inputTitle = document.querySelector(".edit-form .input-title");
const $inputContents = document.querySelector(".edit-form .input-contents");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let data = [];

if (localStorage.getItem("daily")) {
  data = JSON.parse(localStorage.getItem("daily"));
}
if (data.length !== 0) {
  renderDaily();
}

function renderDaily() {
  const filterData = data.find((el) => el.id === id);
  $dailyTilte.textContent = filterData.title;
  $dailyCreatedAt.textContent = getCreatedAt(filterData.createdAt);
  $dailyCreatedAt.setAttribute(
    "datetime",
    new Date(filterData.createdAt).toISOString()
  );
  $dailyContents.textContent = filterData.contents;
}

$editBtn.addEventListener("click", () => {
  const filterData = data.find((el) => el.id === id);
  $editForm.classList.toggle("active");
  $dailyWrapper.classList.toggle("inactive");
  $inputTitle.value = filterData.title;
  $inputContents.value = filterData.contents;
});
$deleteBtn.addEventListener("click", () => {
  if (confirm("정말 삭제하시겠습니까?")) {
    data = data.filter((el) => el.id !== id);
    localStorage.setItem("daily", JSON.stringify(data));
    location.href = "dailyList.html";
  }
});
$candelBtn.addEventListener("click", () => {
  $editForm.classList.toggle("active");
  $dailyWrapper.classList.toggle("inactive");
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
    $dailyWrapper.classList.toggle("inactive");
    $dailyTilte.textContent = $inputTitle.value;
    $dailyContents.textContent = $inputContents.value;
    data.find((el, idx) => {
      if (el.id === id) {
        data[idx].title = $inputTitle.value;
        data[idx].contents = $inputContents.value;
        localStorage.setItem("daily", JSON.stringify(data));
      }
    });
  }
});
