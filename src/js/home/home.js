'use strict';
const $recentDailyLists = document.querySelector(".recent-dailyLists");
const $fortuneContents = document.querySelector(".fortune-cotents")
let data = [];
if(localStorage.getItem('daily')){
  data = JSON.parse(localStorage.getItem('daily'));
}
rederRecentDaily();
renderFortune();
  function rederRecentDaily() {
    if(data.length===0){
      $recentDailyLists.innerHTML+=`
      <li class="none-daily">현재 다이어리가 없어요~</li>
      `
      return;
    }
    const recentData = data.slice(0, 3);
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

  function renderFortune(){
    if(localStorage.getItem('fortune')){
      $fortuneContents.textContent = JSON.parse(localStorage.getItem('fortune')).result;
    }
    else{
      $fortuneContents.textContent = '아직 운세를 보지 않았네요.'
    }
  }