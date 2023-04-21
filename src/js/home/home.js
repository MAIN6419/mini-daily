const $recentDailyLists = document.querySelector(".recent-dailyLists")
let data = [];
if(localStorage.getItem('daily')){
  data = JSON.parse(localStorage.getItem('daily'));
}
rederRecentDaily();
  function rederRecentDaily() {
    if(data.length===0){
      $recentDailyLists.innerHTML+=`
      <li class="none-daily">현재 다이어리가 없어요~</li>
      `
      return;
    }
    const recentData = data.slice(-3);
    recentData.reverse();
    for(const item of recentData){
      const $dailyItem = document.createElement('li');
      const $recentLink = document.createElement('a');
      $dailyItem.setAttribute('class', 'recent-item');
      $recentLink.textContent = item.title;
      $recentLink.setAttribute('href', `src/template/daily.html?id=${item.id}`)
      $recentDailyLists.appendChild($dailyItem);
      $dailyItem.appendChild($recentLink);
    }
  }