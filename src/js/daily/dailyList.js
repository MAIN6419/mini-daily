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
    const $dailyItem = document.createElement("li");
    $dailyItem.setAttribute("class", "daily-item");
    
    const $dailyLink = document.createElement("a");
    $dailyLink.setAttribute("href", `daily.html?id=${item.id}`);
    $dailyLink.setAttribute("class", "daily-link");
    
    const $itemTitle = document.createElement("h3");
    $itemTitle.setAttribute("class", "item-title");
    $itemTitle.textContent = item.title;
    
    const $itemCreatedAt = document.createElement("time");
    $itemCreatedAt.setAttribute("class", "item-createdAt");
    $itemCreatedAt.setAttribute("datetime", new Date(item.createdAt).toISOString());
    $itemCreatedAt.textContent = getCreatedAt(item.createdAt);
    
    const $itemContents = document.createElement("p");
    $itemContents.setAttribute("class", "item-contents");
    $itemContents.textContent = item.contents;
    
    $dailyLink.appendChild($itemTitle);
    $dailyLink.appendChild($itemCreatedAt);
    $dailyLink.appendChild($itemContents);
    $dailyItem.appendChild($dailyLink);
    $dailyLists .appendChild($dailyItem);
  }
}