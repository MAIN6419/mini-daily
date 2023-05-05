import { userData } from "../commons/commons.js";
import { editIntroduce } from "../commons/firebase.js";

const $sectionContents = document.querySelector(".section-contents");
const $changeIntroduceBtn = $sectionContents.querySelector(".btn-changeIntroduce");
const $introduceModal = $sectionContents.querySelector(".introduce-modal");
const $submitBtn = $introduceModal.querySelector(".btn-submit");
const $cancleBtn = $introduceModal.querySelector(".btn-cancle");
const $inputIntroduce = $introduceModal.querySelector(".input-introduce");
const $textCounter = $introduceModal.querySelector(".text-counter")



$changeIntroduceBtn.addEventListener("click",()=>{
  $inputIntroduce.value = userData.introduce;
  $textCounter.textContent = `${userData.introduce.length}/100`
  $introduceModal.classList.add("active");
  $inputIntroduce.focus();
})

$introduceModal.addEventListener("click", (e)=>{
  if(e.target===$introduceModal||e.target===$cancleBtn)
  $introduceModal.classList.remove("active");
})

$cancleBtn.addEventListener("keydown", (e)=>{
  if (e.keyCode === 9 && e.shiftKey) {
    e.preventDefault(); // 기본 이벤트 취소
    $submitBtn.focus(); // $submitBtn에 포커스 이동
  }
  else if(e.keyCode===9){
    e.preventDefault();
    $inputIntroduce.focus();
    }
})

$inputIntroduce.addEventListener("input", (e)=>{
  $textCounter.textContent = `${e.target.value.length}/100`
});

$inputIntroduce.addEventListener("keydown",(e)=>{
  if(e.keyCode===9&&e.shiftKey){
    e.preventDefault();
    $cancleBtn.focus();
  }
});

$submitBtn.addEventListener("click", async(e)=>{
  e.preventDefault();
  if(!$inputIntroduce.value.trim()){
    alert("입력된 내용이 없습니다!");
    return;
  }
  if($inputIntroduce.value===userData.introduce){
    alert("수정된 내용이 없습니다!");
    return;
  }
  // 데이터 전송로직
  await editIntroduce($inputIntroduce.value);
  userData.introduce = $inputIntroduce.value;
  sessionStorage.setItem('userData', JSON.stringify(userData));
  alert("수정이 완료되었습니다.");
  location.reload();
})
