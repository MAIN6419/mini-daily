const $dailyTilte = document.querySelector(".daily-title");
const $dailyCreatedAt = document.querySelector(".daily-createdAt");
const $dailyContents = document.querySelector(".daily-contents");
const $editBtn = document.querySelector(".edit-btn");
const $deleteBtn = document.querySelector(".del-btn");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
let data = [];

if(localStorage.getItem('daily')){
  data = JSON.parse(localStorage.getItem('daily'));
}
if(data.length!==0){
  renderDaily();
}
function renderDaily() {
  const filterData = data.find(el=>el.id===id);
  $dailyTilte.textContent = filterData.title;
  $dailyCreatedAt.textContent = getCreatedAt(filterData.createdAt);
  $dailyCreatedAt.setAttribute('datetime', new Date(filterData.createdAt).toISOString());
  $dailyContents.innerHTML = filterData.contents;
}

$editBtn.addEventListener('clcik',()=>{

})
$deleteBtn.addEventListener('click',()=>{
  if(confirm('정말 삭제하시겠습니까?')){
    data = data.filter(el=>el.id !== id);
    localStorage.setItem('daily',JSON.stringify(data));
    location.href = 'dailyList.html';
  }
})