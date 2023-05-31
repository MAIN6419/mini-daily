import {
  deleteEditDiaryImg,
  editDiary,
  uploadFile,
} from "../../firebase/diary/firebase_diary.js";
import { data } from "../diary.js";

const $sectionContents = document.querySelector(".section-contents");
const $editForm = $sectionContents.querySelector(".edit-form");
const $inputContents = $editForm.querySelector("#input-contents");
const $cancelBtn = $editForm.querySelector(".btn-cancel");
const $editCompletedBtn = $editForm.querySelector(".btn-editCompleted");
const $inputUpload = $sectionContents.querySelector("#input-upload");
const $uploadBtn = $sectionContents.querySelectorAll(".btn-upload");
const $resetBtn = $sectionContents.querySelectorAll(".btn-reset");
const $diaryWrapper = $sectionContents.querySelector(".diary-wrapper");
const $previewImg = $sectionContents.querySelectorAll(".preview-img");
const $articleComment = $sectionContents.querySelector(".article-comment")
export const uploadImg = [];
let imgIdx = "0";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const $radioInputs = $editForm.querySelectorAll("input[name='mood']");
$radioInputs.forEach((el, idx) => {
    el.addEventListener("keydown", (e) => {
      if(e.keyCode === 9 && e.shiftKey && idx===0){
        e.preventDefault();
        $inputContents.focus();
      } else if (e.keyCode === 9 && e.shiftKey && idx !== 0) {
        e.preventDefault();
        $radioInputs[idx - 1].focus();
      } else if (e.keyCode === 9 && idx!==4) {
        e.preventDefault();
        $radioInputs[idx + 1].focus();
      }
    });
});
$uploadBtn[0].addEventListener("keydown", (e)=>{
  if (e.keyCode === 9 && e.shiftKey) {
    e.preventDefault();
    $radioInputs[4].focus();
  } 
})

$cancelBtn.addEventListener("click", () => {
  $editForm.classList.toggle("active");
  $diaryWrapper.classList.toggle("inactive");
  $articleComment.classList.remove("inactive");
});

$editCompletedBtn.addEventListener("click", async () => {
  const $inputTitle = $editForm.querySelector("#input-title");
  const $mood = $editForm.querySelector("input[name='mood']:checked");
  console.log($mood.value)
  if (!$inputTitle.value.trim()) {
    alert("제목을 입력해주세요!");
    return;
  }
  if (!$inputContents.value.trim()) {
    alert("내용을 입력해주세요!");
    return;
  }
  if (
    data.title === $inputTitle.value &&
    data.contents === $inputContents.value &&
    data.imgURL[0] === uploadImg[0] &&
    data.imgURL[1] === uploadImg[1] &&
    data.imgURL[2] === uploadImg[2] &&
    data.mood === $mood.value
  ) {
    alert("수정한 내용이 없습니다!");
    return;
  }

  if (confirm("정말 수정하겠습니까?")) {
    const $loadingModal = $sectionContents.querySelector(".loading-modal");
    $loadingModal.classList.add("active");
    const fileInfo = { url: [], fileName: [] };
    for (const i in uploadImg) {
      // 이미지 배열에 들어있는 데이터가 file인것을 구분해줌
      if (uploadImg[i] !== data.imgURL[i]) {
        const uploadResult = await uploadFile([uploadImg[i]]); // 파일 업로드 함수 호출 (Firebase Storage에 업로드)
        // 수정할때 이미지가 아직 채워지지 않은 이미지 배열이 존재하므로 존재하지 않는 이미지를 제거시 에러가 발생
        // 예외처리를 위해 사용
        deleteEditDiaryImg(data.imgFileName[i]);
        fileInfo.url.push(...uploadResult.url); // 업로드된 이미지의 URL을 배열에 저장
        fileInfo.fileName.push(...uploadResult.fileName); // 업로드된 이미지의 fileName을 배열에 저장
      } else {
        // File 객체가 아닌 경우, 기존 data의 이미지 URL와 fileName을 그대로 사용
        fileInfo.url.push(data.imgURL[i]);
        fileInfo.fileName.push(data.imgFileName[i]);
      }
    }
    const newData = {
      title: $inputTitle.value,
      contents: $inputContents.value,
      imgURL: fileInfo.url || [],
      imgFileName: fileInfo.fileName || [],
      mood: $mood.value,
    };
    await editDiary(id, newData);
    $loadingModal.classList.remove("active");
    // 이후 바뀐 데이터를 새로 받아오기 위해 새로고침
    location.reload();
  }
});

$uploadBtn.forEach((el, idx) => {
  el.addEventListener("click", () => {
    $inputUpload.click();
    imgIdx = idx;
  });
});

$resetBtn.forEach((el, idx) => {
  el.addEventListener("click", () => resetImg(idx));
});

function previewImg(e) {
  const file = e.currentTarget.files[0];
  const vaild = validataionImg(file);
  if (!vaild) return;
  const imageSrc = URL.createObjectURL(file);
  $previewImg[imgIdx].setAttribute("src", imageSrc);
  $previewImg[imgIdx].style.width = "100%";
  $previewImg[imgIdx].style.height = "100%";
  uploadImg[imgIdx] = file;
}
function resetImg(idx) {
  $previewImg[idx].setAttribute("src", "./img/imgUpload.png");
  $previewImg[idx].style.width = "70px";
  $previewImg[idx].style.height = "70px";
  uploadImg[idx] = "";
}

$inputUpload.addEventListener("change", (e) => previewImg(e));

function validataionImg(file) {
  if (!file) {
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("파일의 크기를 초과하였습니다.(최대 5MB)");
    return;
  }
  return true;
}
