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
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
<img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white">
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
  - 캐싱 기법으로 중복되는 작성자 프로필 이미지는 캐싱 변수를 생성하여 캐싱 변수에 프로필 이미지를 저장
  - 이미 가져온 유저 프로필 이미지는 해당 캐싱 변수에서 가져와서 사용 => 중복으로 프로필 이미지를 가져오지 않음
  - placeholder 이미지 기법을 이용하여 로딩전 palcehloder 이미지로 유저 프로필과 UI를 먼저 보여준 후 마지막에 유저 프로필 이미지를 불러옴
  - 로딩 시간이 **2.5초**에서 **1.2초**로 **50%** 단축됨
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
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/30340e35-8ba9-40f2-aa5c-4ea9e44f18c2">
<br>
<br>

### 로그인
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/be7e330c-3643-404b-9b8b-c43ed8b80f68">
<br>
<br>

### 아이디 | 비밀번호 찾기
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/dee0fd78-74e6-4d72-9ebc-5707795749bf">
<br>
<br>

### 홈
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/f3e5bf98-2d7e-4136-83c8-746e6700f38d">
<br>
<br>

### 전체 다이어리
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/767f1cd2-d6d4-4e47-bc7f-f0101c50a1bc">
<br>
<br>

### 마이 다이어리 
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/097dadbe-8f39-4e10-8889-6e56faeb0b88">
<br>
<br>

### 다이어리 작성
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/861a9f9d-27a1-4f89-8049-8a7509955343">
<br>
<br>

### 다이어리 편집
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/f791229c-aa9b-4fe6-8585-9b155e0f8e74">
<br>
<br>

### 다이어리 삭제
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/8c44fc8b-13da-4f2e-b6ce-2bcb5a575597">
<br>
<br>

### 댓글 | 답글(작성, 삭제, 수정)
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/9991e6cd-86d3-4605-929e-907f936146bd">
<br>
<br>

### 채팅방 생성
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/b8f556a7-be8c-44ae-bd52-a0246ea59eed">
<br>
<br>

### 채팅방 아이디 참여
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/f13d8960-98a4-4243-aa82-98a2e5ffb513">
<br>
<br>

### 비밀 채팅방
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/5e9d8681-722d-428a-a0c2-99a61f7c0cc3">
<br>
<br>

### 실시간 채팅
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/77ea172e-2633-4633-bf29-0cbcaa239ae6">
<br>
<br>

### 채팅 유저 정보
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/30541370-dd4a-48b9-a06e-b6cdfdeab6af">
<br>
<br>

### 운세보기
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/4efbc332-07d7-4c9d-92a2-696489c201af">
<br>
<br>

### 자동 등업
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/c88f2c00-d113-44a7-8225-95a43a328f57">
<br>
<br>
  
### 프로필 사진 변경
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/dcb617ed-7157-4341-908d-d9d73d592f02">
<br>
<br>

### 비밀번호 변경
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/e7733992-b2c5-4d31-8aac-f82b900c0f62">
<br>
<br>
  
### 소개글 변경
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/6d092618-349a-4701-9d1f-dee0e759b0f9">
<br>
<br>
   
### 등업정보, 나의 공감 목록
<br>
<img src="https://github.com/MAIN6419/minidiary-launch/assets/113427991/e1fdfa17-fec3-4ec1-8cc9-612204f03085">
<br>
<br>

</div>

<p align="center">
<b>📗 미니다이어리</b>는 일상에 지친 사람들을 위해 <b>  일상과 감정을 공유하는 소통을 위한 공간</b>입니다.
</p>
<br/>
