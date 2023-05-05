import {
  createChattingRoom,
  renderChattingRoom,
} from "../commons/firebase.js";


const $sectionContents = document.querySelector(".section-contents")
const $createRoomBtn = $sectionContents.querySelector(".btn-createRoom");
const $roomList = $sectionContents.querySelector(".room-list");

const $openModalBtn = $sectionContents.querySelector(".btn-openModal");
const $createRoomModl = $sectionContents.querySelector(".createRoom-modal");
const $inputTitle = $createRoomModl.querySelector("#input-title");
const $inputLimit = $createRoomModl.querySelector("#input-limit");
const $chkPriavte = $createRoomModl.querySelector("#checkbox-private");
const $inputPassowrd = $createRoomModl.querySelector("#input-password");
const $closeBtn = $createRoomModl.querySelector(".btn-close");
const $loadingModal = $sectionContents.querySelector(".loading-modal");

$createRoomBtn.addEventListener("click", () => {
  $createRoomModl.classList.add("active");
  if(!$inputTitle.value.trim()){
    alert("제목을 입력해주세요!");
    return;
  }
  if(!$inputLimit.value){
    alert("최대 인원수 입력해주세요!");
    return;
  }
  if($chkPriavte.checked){
    if(!$inputPassowrd.value){
      alert("비밀번호를 입력해주세요!");
      return;
    }
    else if($inputPassowrd.value < 4){
      alert("비밀번호는 최소 4자리 이상입니다!");
      return;
    }
  }
  const newRoom = {
    id: uuid.v4(),
    title: $inputTitle.value,
    limit: parseInt($inputLimit.value),
    isprivate: $chkPriavte.checked,
    password: $inputPassowrd.value || "",
    createdAt: new Date().getTime(),
  };
  createChattingRoom(newRoom);

  $inputPassowrd.value = "";
  $inputLimit.value = "";
  $inputTitle.value = "";
  $createRoomModl.classList.remove("active");

});
renderChattingRoom($roomList, $loadingModal);

$openModalBtn.addEventListener("click",()=>{
  $createRoomModl.classList.add("active");
  $inputTitle.focus();
  
})

$createRoomModl.addEventListener("click",(e)=>{
  if(e.target===$closeBtn||e.target===$createRoomModl){
    $createRoomModl.classList.remove("active");
  }
})
$inputTitle.addEventListener("keydown",(e)=>{
  if(e.keyCode===9&&e.shiftKey){
    e.preventDefault();
    $closeBtn.focus();
  }  
  if(e.keyCode===32&&!e.target.value.trim()){
    e.preventDefault();
    e.target.value = "";
  }
 
})
$closeBtn.addEventListener("keydown",(e)=>{
  if(e.keyCode===9&&!e.shiftKey){
    e.preventDefault();
    $inputTitle.focus();
  }
})

$inputPassowrd.addEventListener("input",(e)=>{
  e.target.value = e.target.value.trim();
})

$inputLimit.addEventListener("change",(e)=>{
  if(e.target.value>100){
    e.target.value = 100;
  }
  else if(e.target.value <0){
    e.target.value = 0;
  }
})

$chkPriavte.addEventListener("change",()=>{
  $inputPassowrd.classList.toggle("active");
})
