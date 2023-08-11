# mini-diary

<br>
<p align="center">
    <img src="https://github.com/MAIN6419/mini-diary/assets/113427991/41564653-01ff-4481-88fe-84924e008b9d" alt="mini-diary-logo" width="180" height="223">
</p>
<div align="center">

  😀 하루 **일상**과 **감정**을 **공유, 공감**하는 소통 창구입니다. <br>
  
  📖[미니다이어리(mini-diary)](https://miniDiary.site/) <br><br>
  테스트 계정 (중복 로그인이 불가합니다.)

| NO | ID         | PW     |
|:-----:|------------|--------|
| 1   | asd1@a.com | 123123 |
| 2   | asd2@a.com | 123123 |
| 3   | asd3@a.com | 123123 |
</div>


## 👀 개요
- 미니 다이어리는 자신의 일상과 감정 상태를 나타내는 다이어리를 작성하여 다른사람들과 공감, 소통을 할 수있습니다.
- 공감 버튼을 눌러 감정 상태를 공감 할 수 있습니다.
- 댓글과 답글을 통해 다이어리에 대해 소통과 공감을 할 수 있습니다.
- 실시간 채팅 기능을 통해 원하는 사람들과 소통할 수 있습니다.
<br>

## 🚩 개발 기간
- 전체 개발 기간 : 2023-04-27 ~ 2023-06-11
<br>

## 🗜 프로젝트 구조

- template : 페이지별 html 파일
- css : css 파일 => 공통으로 사용되는 css는 main.css에 구성
- js : 각 페이지별로 js파일을 나누고, 그 안에서 기능별 모듈로 js파일을 구분, 공통으로 사용되는 기능은 commons.js에 구성
- db : 운세 데이터가 담긴 db.json파일
- img : 프로젝트에서 사용되는 이미지

```bash
┣ README.md
┣ index.html
┣ 404.html
┣ webpack.config.js
┣ src
┃   ┣ css
┃   ┃   ┣ allDiary.css
┃   ┃   ┣ chatting.css
┃   ┃   ┣ chattingRoom.css
┃   ┃   ┣ diary.css
┃   ┃   ┣ findAccount.css
┃   ┃   ┣ fortune.css
┃   ┃   ┣ home.css
┃   ┃   ┣ login.css
┃   ┃   ┣ main.css
┃   ┃   ┣ myDiary.css
┃   ┃   ┣ mypage.css
┃   ┃   ┣ reset.css
┃   ┃   ┣ signup.css
┃   ┃   ┗ write.css
┃   ┣ db
┃   ┃   ┗ db.json
┃   ┣ img
┃   ┃   ┣ 404.png
┃   ┃   ┣ bg.png
┃   ┃   ┣ card-back.png
┃   ┃   ┣ card-front.png
┃   ┃   ┣ favicon.png
┃   ┃   ┣ fortune-bg.jpg
┃   ┃   ┣ icon-sprite.png
┃   ┃   ┣ imgUpload.png
┃   ┃   ┣ loading.gif
┃   ┃   ┣ no-image.png
┃   ┃   ┣ placeholderImg.png
┃   ┃   ┣ profile.png
┃   ┃   ┣ sunset-bg.png
┃   ┃   ┗ weather-loading.gif
┃   ┣ js
┃   ┃   ┣ allDiary
┃   ┃   ┃   ┗ allDiary.js
┃   ┃   ┣ chatting
┃   ┃   ┃   ┗ chatting.js
┃   ┃   ┣ chattingRoom
┃   ┃   ┃   ┣ chattingRoom.js
┃   ┃   ┃   ┣ chattingRoom_modal.js
┃   ┃   ┃   ┗ chattingRoom_pageNation.js
┃   ┃   ┣ commons
┃   ┃   ┃   ┣ calendar.js
┃   ┃   ┃   ┣ clock.js
┃   ┃   ┃   ┣ commons.js
┃   ┃   ┃   ┣ libray.js
┃   ┃   ┃   ┗ weather.js
┃   ┃   ┣ diary
┃   ┃   ┃   ┣ diaryComment
┃   ┃   ┃   ┃   ┗ diaryComment.js
┃   ┃   ┃   ┣ diaryEdit
┃   ┃   ┃   ┃   ┗ diaryEdit.js
┃   ┃   ┃   ┣ diaryInfinityScroll
┃   ┃   ┃   ┃   ┗ diaryInfinityScroll.js
┃   ┃   ┃   ┣ diaryReplyComment
┃   ┃   ┃   ┃   ┗ diaryReplyComment.js
┃   ┃   ┃   ┗ diary.js
┃   ┃   ┣ findAccount
┃   ┃   ┃   ┗ findAccount.js
┃   ┃   ┣ firebase
┃   ┃   ┃   ┣ auth
┃   ┃   ┃   ┃    ┗ firebase_auth.js
┃   ┃   ┃   ┣ chatting
┃   ┃   ┃   ┃    ┗ firebase_chatting.js
┃   ┃   ┃   ┣ chattingRoom
┃   ┃   ┃   ┃   ┗ firebase_chattingRoom.js
┃   ┃   ┃   ┣ comment
┃   ┃   ┃   ┃   ┗ firebase_comment.js
┃   ┃   ┃   ┣ diary
┃   ┃   ┃   ┃   ┗ firebase_diary.js
┃   ┃   ┃   ┣ fortune
┃   ┃   ┃   ┃   ┗ firebase_fortune.js
┃   ┃   ┃   ┗ setting
┃   ┃   ┃   ┃   ┗ firebase_setting.js
┃   ┃   ┣ fortune
┃   ┃   ┃   ┗ fortune.js
┃   ┃   ┣ home
┃   ┃   ┃   ┗ home.js
┃   ┃   ┣ login
┃   ┃   ┃   ┗ login.js
┃   ┃   ┣ myDiary
┃   ┃   ┃   ┗ myDiary.js
┃   ┃   ┣ mypage
┃   ┃   ┃   ┣ myEmpathyList.js
┃   ┃   ┃   ┣ myEmpathySwiper.js
┃   ┃   ┃       ┗ mypage.js
┃   ┃   ┣ signup
┃   ┃   ┃   ┗ signup.js
┃   ┃   ┗ write
┃   ┃   ┃   ┗ write.js
┃   ┣   template
┃   ┃   ┣ allDiary.html
┃   ┃   ┣ chatting.html 
┃   ┃   ┣ chattingRoom.html
┃   ┃   ┣ diary.html
┃   ┃   ┣ findAccount.html
┃   ┃   ┣ fortune.html
┃   ┃   ┣ home.html
┃   ┃   ┣ myDiary.html
┃   ┃   ┣ mypage.html
┃   ┃   ┣ signup.html
┗   ┗   ┗ write.html
```
<br>

## 🛠 Skills
|프론트엔드|벡엔드|배포,관리|
|---|---|---|
|<img src="https://img.shields.io/badge/html-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white">|<img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white">|<img src="https://img.shields.io/badge/netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">|

<br>

## 🔫 트러블 슈팅
- 이미지 로딩으로 인한 UX 저해 
  - placehloder 이미지 기법을 통해 이미지가 로딩전 placehloder이미지를 보여줘 갑자기 UI의 높이가 변화하는 것을 개선
  - 적용 전
  
     ![diaryPlaceholder-before](https://github.com/MAIN6419/mini-diary/assets/113427991/36f765c2-e4c0-44f7-b7c4-9ab459155f99)
        
  - 적용 후
  
    ![diaryPlaceholder-after](https://github.com/MAIN6419/mini-diary/assets/113427991/62193ae9-f677-49dd-86e3-85a93b19735a)

- 다이어리 카드에서 유저 프로필 이미지를 받아오는 로딩으로 페이지 로딩시간 증가
  - 게시글의 작성자의 닉네임을 가져와 user DB에서 해당되는 유저의 프로필 이미지를 가져옴
  - 다이어리 목록이 많아질 수록 user DB에서 유저 프로필 이미지를 가져오는 횟수가 증가하여 로딩속도 저하
  - 중복되는 작성자 프로필 이미지를 변수에 변수(cachedImages)에 저장
  - 이미 가져온 유저 프로필 이미지는 해당 저장된 변수(cachedImages)에서 가져와서 사용 => 중복된 프로필 이미지는 API요청을 보내지 않음, 아래 getAuthImg 함수 코드 참고
  - => 로딩 시간이 **2.5초**에서 **1.2초**로 **50%** 단축됨
  - UX향상을 위해 placeholder 이미지 기법을 이용하여 로딩전 placehloder 이미지로 유저 프로필과 UI를 먼저 보여준 후 마지막에 유저 프로필 이미지를 불러옴
 
#### firebase_auth.js getAuthImg 함수 코드
```javascript
// 유저 이미지 Url를 가져오는 함수
// 중복되는 유저 프로필 이미지를 저장할 변수
const cachedImages = {};

async function getAuthImg(auth) {
  if (cachedImages[auth]) {
    return cachedImages[auth];
  }

  const userRef = doc(db, "user", auth);
  const res = await getDoc(userRef);
  const datas = res.data();
  const imgUrl = datas.profileImgUrl;

  // 이미지 URL을 저장
  cachedImages[auth] = imgUrl;
  return imgUrl;
}
```

#### allDiary.js 코드
```javascript
//                      '
//                      '
//                      '
//                    (생략)

async function renderAllDiary(data) {
  if (data.length === 0) {
    $allDiaryList.innerHTML = `
    <li class="no-diary">
      현재 다이어리가 없어요.
    </li>
    `;
    return;
  } 
  // 최초로딩시에만 로딩화면을 보여주기 위해서
  if (!isfirstLoding) $loadingModal.classList.add("active");
  const frag = new DocumentFragment();

  for (const diary of data) {
    const listItem = document.createElement("li");
    listItem.classList.add("diary");
    // listItem.addEventListener("mouseover", ()=> getThorttle(diary.id))

    const anchor = document.createElement("a");
    anchor.href = `diary.html?id=${diary.id}`;
    listItem.appendChild(anchor);

    const img = document.createElement("img");
    img.classList.add("diary-img");
    img.src = diary.imgURL[0] || "./img/no-image.png";
    img.alt = "다이어리 이미지";
    anchor.appendChild(img);

    const contentsDiv = document.createElement("div");
    contentsDiv.classList.add("diary-contents");

    const title = document.createElement("h3");
    title.classList.add("diary-title");
    title.textContent = diary.title;
    contentsDiv.appendChild(title);

    const text = document.createElement("p");
    text.classList.add("diary-text");
    text.textContent = diary.contents;
    contentsDiv.appendChild(text);

    const bottomDiv = document.createElement("div");
    bottomDiv.classList.add("diary-bottom");

    const profileImg = document.createElement("img");
    profileImg.classList.add("diary-profileImg");
    // 초기 유저 이미지의 경우 임시 이미지 사용 => 렌더링이 완료된후 유저 이미지를 불러옴
    profileImg.src = "./img/placeholderImg.png";
    profileImg.alt = "유저 프로필 이미지";
    bottomDiv.appendChild(profileImg);

    const auth = document.createElement("span");
    auth.classList.add("diary-auth");
    auth.textContent = diary.auth;
    bottomDiv.appendChild(auth);

    const createdAt = document.createElement("time");
    createdAt.classList.add("diary-createdAt");
    createdAt.datetime = new Date(diary.createdAt).toISOString();
    createdAt.textContent = getCreatedAt(diary.createdAt);
    bottomDiv.appendChild(createdAt);

    contentsDiv.appendChild(bottomDiv);
    
    const empathy = document.createElement("span");
    empathy.setAttribute("class", "diary-empathy");
    empathy.textContent = `${diary.empathy}`;
    contentsDiv.appendChild(empathy);

    anchor.appendChild(contentsDiv);
    
    frag.appendChild(listItem);
    
    // 이미지 렌더링이 완료된후 유저 이미지를 적용
    fetchAuthImg(profileImg, diary);
    }
    
  $allDiaryList.appendChild(frag);
  if (!isfirstLoding) $loadingModal.classList.remove("active");
  isfirstLoding = true;
}

// 다이어리 작성자 이미지를 불러오는 함수 => placeholderImg 교체
async function fetchAuthImg(profileImg, data) {
  profileImg.src = (await getAuthImg(data.auth)) || "./img/profile.png";
}

//                    (생략)
//                      '
//                      '
//                      '
```

  - 적용 전
  
     ![placeholder-Before](https://github.com/MAIN6419/mini-diary/assets/113427991/8dc955d1-3877-4f31-a073-5cadb8a0e558)

  - 적용 후
  
    ![placeholder-after](https://github.com/MAIN6419/mini-diary/assets/113427991/c0f00676-7d84-4422-8122-6a116f0d7cba)
    
- foreach문 안에서 비동기 처리가 동작하지 않음
   - 게시글 삭제 시 공감 버튼을 누른 유저의 목록에서 공감 목록 삭제가 제대로 처리되지 않음
   - 비동기 처리가 되는 for of문으로 변경하여 해결
<br>

## ❗ 이슈
- 브라우저 창 종료시 로그아웃 처리 불가 => 로그아웃을 하지 않고 브라우저 창 종료 시 로그아웃 처리가 되지 않음
  - 로그아웃을 하지 않고 브라우저 창 종료 후 로그인이 이미 로그인된 아이디로 경고창이 발생함
- 다이어리 작성, 편집, 삭제시 이미지가 존재하면 로딩시간이 길어져 중 페이지 이동이 발생 하거나 새로고침이 발생하면 문제가 발생
  - 게시글 변경사항이 제대로 적용되지 않거나 DB에 변경사항이 제대로 적용되지 않음
- 유저 프로필 변경시 로딩 시간이 길어 프로필 변경 중 페이지 이동이 발생 하거나 새로고침이 발생하면 문제가 발생
  - 이미지가 제대로 바뀌지 않거나 DB에 데이터가 제대로 전달되지 않음
<br>

## 💻 미니다이어리 기능
<div align="center">
    
### 회원가입
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/34858329-a474-4ee8-8ea9-18d85d744e1c">
<br>
<br>

### 로그인
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/bac93459-c9b8-452c-8fe8-b8a2adc96b28">
<br>
<br>

### 아이디 | 비밀번호 찾기
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/c2de771d-f01c-4d78-8eeb-af98f858de14">
<br>
<br>

### 홈
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/b8f7d86c-c4e8-48f9-9bda-2653b4707cb6">
<br>
<br>

### 전체 다이어리
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/f30bc16c-7f95-4b2b-b644-a6f6092b7c7a">
<br>
<br>

### 마이 다이어리 
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/380c436a-d9e7-47ff-9f8d-3f1bacf943fa">
<br>
<br>

### 다이어리 작성
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/cc7bd0cf-d15d-4db7-92b9-2d575a6983f7">
<br>
<br>

### 다이어리 편집
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/dafed43c-5ba3-4ac8-afec-86b463bee3a0">
<br>
<br>

### 다이어리 삭제
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/ebc0e1d6-e899-4ec9-90a9-c31ce2d89155">
<br>
<br>

### 댓글 | 답글(작성, 삭제, 수정)
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/52fca2ee-56df-4073-94fb-f9de3fcaf73e">
<br>
<br>

### 채팅방 생성
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/6bac03f0-35a5-4660-be56-6e6cdd7dd98c">
<br>
<br>

### 채팅방 아이디 참여
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/1e8f7cbd-deb6-4540-af85-4efe95f3d4a8">
<br>
<br>

### 비밀 채팅방
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/38a87fb4-6f76-40db-aea9-3c150086d0fa">
<br>
<br>

### 실시간 채팅
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/dd01d472-ab8a-4341-bf09-fee10664172c">
<br>
<br>

### 채팅 유저 정보
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/03cc92c7-eba8-4e37-bda7-e4b17c8d7186">
<br>
<br>

### 운세보기
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/1c5e6b8e-df82-4e45-87a6-f9447b164c31">
<br>
<br>

### 자동 등업
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/2ede999b-32e2-43cd-9328-884cad352cef">
<br>
<br>
  
### 프로필 사진 변경
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/b541de24-cdc2-41ca-957d-8af89d909615">
<br>
<br>

### 비밀번호 변경
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/f12c007e-0ab4-4452-a903-da977cd5f126">
<br>
<br>
  
### 소개글 변경
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/c19e3fd0-9256-4341-ac7f-0973c2bc5630">
<br>
<br>
   
### 등업정보, 나의 공감 목록
<br>
<img src="https://github.com/MAIN6419/mini-diary/assets/113427991/eeadaf96-9f3f-4447-a553-b41ad91fa750">
<br>
<br>

</div>

<p align="center">
<b>📗 미니다이어리</b>는 일상에 지친 사람들을 위해 <b>  일상과 감정을 공유하는 소통을 위한 공간</b>입니다.
</p>
<br/>
