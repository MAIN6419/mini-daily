const $dailyLists = document.querySelector('.daily-lists');
let data = [];
if(localStorage.getItem('daily')){
  data = JSON.parse(localStorage.getItem('daily'));
}
rederDailyList();
function rederDailyList() {
  if(data.length===0){
    $dailyLists.innerHTML += `
    <li class="none-item">
         현재 게시글이 없어요.
         게시글을 한 번 작성해보세요~
    </li>
    `
  }
  for(const item of data) {
    $dailyLists.innerHTML += `
    <li class="daily-item">
            <a href="daily.html?id=${item.id}" class="daily-link">
              <h3 class="item-title">${item.title}</h3>
              <time class="item-createdAt" datetime="${new Date(item.createdAt).toISOString()}">${getCreatedAt(item.createdAt)}</time>
              <p class="item-contents">${item.contents}</p>
            </a>
      </li>
    `
  }
}