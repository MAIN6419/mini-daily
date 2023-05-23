"use strict";
import { getCreatedAt } from "../commons/libray.js";
import {
  FetchDiary,
  deleteDiary,
  deleteEditDiaryImg,
  editDiary,
  uploadFile,
  currentUser,
  updateEmpathy,
  FetchUserData,
  writeComment,
  fetchComment,
  // fetchReplyComment,
  fetchReplyComments,
  deleteComment,
  editComment,
  db,
  writeReplyComment,
  deleteReplyComment,
  editReplyComment,
  getAuthImg,
} from "../commons/firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  startAfter,
  limit,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const $sectionContents = document.querySelector(".section-contents");
const $diaryWrapper = $sectionContents.querySelector(".diary-wrapper");
const $diaryTitle = $diaryWrapper.querySelector(".diary-title");
const $diaryCreatedAt = $diaryWrapper.querySelector(".diary-createdAt");
const $diaryText = $diaryWrapper.querySelector(".diary-text");
const $authInfo = $diaryWrapper.querySelector(".auth-info");
const $diaryAuth = $diaryWrapper.querySelector(".diary-auth");
const $diaryProfileImg = $diaryWrapper.querySelector(".diary-profileImg");
const $editBtn = $diaryWrapper.querySelector(".btn-edit");
const $deleteBtn = $diaryWrapper.querySelector(".btn-del");
const $empathyBtn = $diaryWrapper.querySelector(".btn-empathy");
const $empathyCount = $diaryWrapper.querySelector(".empathy-count");
const $editForm = $sectionContents.querySelector(".edit-form");
const $candelBtn = $editForm.querySelector(".btn-cancel");
const $editCompletedBtn = $editForm.querySelector(".btn-editCompleted");
const $inputTitle = $editForm.querySelector("#input-title");
const $inputContents = $editForm.querySelector("#input-contents");
const $loadingModal = $sectionContents.querySelector(".loading-modal");
const $backBtn = $sectionContents.querySelector(".btn-back");
const $diaryLink = document.querySelector(".diary-link");
const $allDiaryLink = document.querySelector(".allDiary-link");
const $inputUpload = $sectionContents.querySelector("#input-upload");
const $btnUpload = $sectionContents.querySelectorAll(".btn-upload");
const $previewImg = $sectionContents.querySelectorAll(".preview-img");
const $resetBtn = $sectionContents.querySelectorAll(".btn-reset");
const $empathyBox = $diaryWrapper.querySelector(".empathy-box");
const $authGrade = $sectionContents.querySelector(".auth-grade");
const uploadImg = [];
let imgIdx = "0";
let lastpage;
let hasNextpage = false;
const fetchCommentData = async () => {
  return await firstComment()
    .then((res) => {
      return res;
    })
    .catch((error) => {
      throw error;
    });
};
const commentData = await fetchCommentData();

const $commentForm = $sectionContents.querySelector(".comment-form");
const $commentInput = $commentForm.querySelector("#input-comment");
const $commentSubitBtn = $commentForm.querySelector(".btn-submit");
const $commentLists = $sectionContents.querySelector(".comment-lists");

const previousPageUrl = document.referrer;

if (previousPageUrl.includes("diaryList")) {
  $diaryLink.classList.add("active");
  $backBtn.addEventListener("click", () => {
    location.href = "diaryList.html";
  });
} else {
  $allDiaryLink.classList.add("active");
  $backBtn.addEventListener("click", () => {
    location.href = "allDiary.html";
  });
}
// preload된 데이터 가져오기
const diaryData = JSON.parse(sessionStorage.getItem("diaryData"));

const fetchData = async () => {
  // 만약 preload된 데이터가 있고, 데이터의 id가 urlParamsId값과 일치한다면 현재 preload된 데이터를 사용
  //  if(diaryData&&diaryData.id===id){
  //   return JSON.parse(sessionStorage.getItem("diaryData"));
  // }
  // preload된 데이터가 없거나, preload된 데이터가 현재 다이어리 데이터와 일치하지 않는다면 서버에서 새로 데이터를 받음
  $loadingModal.classList.add("active");
  return await FetchDiary(id).then((res) => {
    $loadingModal.classList.remove("active");
    return res;
  });
};
const data = (await fetchData()) || [];
renderdiary();
async function renderdiary() {
  // 새로 렌더링 시 새로운 데이터를 가져옴
  const data = (await fetchData()) || [];
  uploadImg.splice(0);
  if (data.length === 0) {
    $diaryTitle.textContent = "존재하지 않는 게시물";
    alert("현재 삭제되었거나 존재하지 않는 게시물 입니다!");
    location.replace("allDiary.html");
    return;
  }
  // 만약 작성자와 현재 로그인한 유저가 같지 않다면
  // 수정과 삭제버튼 없애기
  if (currentUser.displayName !== data.auth) {
    $editBtn.remove();
    $deleteBtn.remove();
  }
  const auth = await FetchUserData(data.auth);
  if(auth.grade === "우수") {
    $authGrade.classList.add("good");
  } else if(auth.grade === "프로") {
    $authGrade.classList.add("pro");
  } else if(auth.grade === "VIP") {
    $authGrade.classList.add("VIP");
  }
  $authGrade.textContent = auth.grade;
  $diaryAuth.textContent = data.auth;
  $diaryProfileImg.setAttribute("src", (auth.profileImgUrl || "../img/profile.png"));
  $diaryTitle.textContent = data.title;
  $diaryCreatedAt.textContent = getCreatedAt(data.createdAt);
  $diaryCreatedAt.setAttribute(
    "datetime",
    new Date(data.createdAt).toISOString()
  );
  $authInfo.classList.add("active");
  uploadImg.push(...data.imgURL);

  data.imgURL.forEach((el) => {
    const $postImg = document.createElement("img");
    $postImg.setAttribute("class", "diary-img");
    $postImg.setAttribute("src", "../img/placeholderImg.png");
    const actualImageURL = el;
    const dataImg = new Image();
    dataImg.src = actualImageURL;
    dataImg.addEventListener("load", () => {
      $postImg.src = actualImageURL;
    });
    $postImg.setAttribute("alt", "포스트 이미지");
    $diaryText.insertAdjacentElement("beforebegin", $postImg);
  });
  $empathyBox.classList.add("active");
  $diaryText.textContent = data.contents;
  $empathyCount.textContent = `공감 ${data.empathy}`;
  const user = await FetchUserData(currentUser.displayName);
  if (user.empathyList.includes(id)) {
    $empathyBtn.style.backgroundImage = "url(../img/heart.png)";
  }
}

$editBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  $editForm.classList.toggle("active");
  $diaryWrapper.classList.toggle("inactive");
  $inputTitle.value = data.title;
  $inputContents.value = data.contents;
  $previewImg.forEach((el, idx) => {
    if (data.imgURL[idx]) {
      el.setAttribute("src", data.imgURL[idx]);
    }
  });
});
$deleteBtn.addEventListener("click", async () => {
  if (confirm("정말 삭제하시겠습니까?")) {
    await deleteDiary(id);
    previousPageUrl.includes("diaryList")
      ? (location.href = "diaryList.html")
      : (location.href = "allDiary.html");
    alert("삭제가 완료되었습니다.");
  }
});
$empathyBtn.addEventListener("click", async () => {
  const checkdiary = await FetchDiary(id);
  if (!checkdiary) {
    alert("현재 삭제되었거나 존재하지 않는 게시글 입니다.");
    if (previousPageUrl.includes("diaryList")) {
      return (location.href = "diaryList.html");
    } else {
      return (location.href = "allDiary.html");
    }
  }
  const user = await FetchUserData(currentUser.displayName);
  if (user.empathyList.includes(id)) {
    updateEmpathy(id, -1);
    data.empathy -= 1;
    // sessionStorage.setItem("diaryData", JSON.stringify(data));
    $empathyCount.textContent = `공감 ${data.empathy}`;
    $empathyBtn.style.backgroundImage = "url(../img/unheart.png)";
  } else {
    updateEmpathy(id, 1);
    data.empathy += 1;
    // sessionStorage.setItem("diaryData", JSON.stringify(data));
    $empathyCount.textContent = `공감 ${data.empathy}`;
    $empathyBtn.style.backgroundImage = "url(../img/heart.png)";
  }
});

$candelBtn.addEventListener("click", () => {
  $editForm.classList.toggle("active");
  $diaryWrapper.classList.toggle("inactive");
});

$editCompletedBtn.addEventListener("click", async () => {
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
    data.imgURL[2] === uploadImg[2]
  ) {
    alert("수정한 내용이 없습니다!");
    return;
  }

  if (confirm("정말 수정하겠습니까?")) {
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
    $diaryTitle.textContent = $inputTitle.value;
    $diaryText.textContent = $inputContents.value;
    const newData = {
      title: $inputTitle.value,
      contents: $inputContents.value,
      imgURL: fileInfo.url || [],
      imgFileName: fileInfo.fileName || [],
    };
    await editDiary(id, newData);
    $loadingModal.classList.remove("active");
    // session storage 데이터 수정 preload를 위해
    const newDiary = JSON.parse(sessionStorage.getItem("diaryData"));
    newDiary.title = $inputTitle.value;
    newDiary.contents = $inputContents.value;
    newDiary.imgURL = fileInfo.url;
    newDiary.imgFileName = fileInfo.fileName;
    sessionStorage.setItem("diaryData", JSON.stringify(newDiary));
    // 이후 바뀐 데이터를 새로 받아오기 위해 새로고침
    location.reload();
  }
});

$btnUpload.forEach((el, idx) => {
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
  $previewImg[idx].setAttribute("src", "../img/imgUpload.png");
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

$commentSubitBtn.addEventListener("click", (e) => submitComment(e));

async function submitComment(e) {
  e.preventDefault();
  if (confirm("정말 작성하시겠습니까?")) {
    if (!$commentInput.value.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }
    const newComment = {
      diaryId: id,
      auth: currentUser.displayName,
      profileImg: currentUser.photoURL,
      content: $commentInput.value,
      commentId: uuidv4(),
      createdAt: new Date().getTime(),
    };
    await writeComment(newComment);
    $commentInput.value = "";
    // 만약에 데이터가 없을 경우에만 직적 동적으로 요소를 생성
    // 다른경우에는 무한 스크롤이 적용되어서 데이터를 불러와서 자동으로 요소를 생성하므로
    if(!hasNextpage){
      addComment(newComment);
    }

  }
}

async function addComment(item) {
  // li 요소 생성
  const li = document.createElement("li");
  li.classList.add("comment-item");

  // auth-profile 요소 생성
  const authProfile = document.createElement("div");
  authProfile.classList.add("auth-profile");

  // comment-profileImg 요소 생성
  const profileImg = document.createElement("img");
  profileImg.classList.add("comment-profileImg");
  profileImg.src =(await getAuthImg(diary.auth)) || "../img/profile.png";;
  profileImg.alt = "유저 프로필";

  // comment-auth 요소 생성
  const authSpan = document.createElement("span");
  authSpan.classList.add("comment-auth");
  authSpan.textContent = item.auth;

  // auth-profile에 profileImg와 authSpan 추가
  authProfile.appendChild(profileImg);
  authProfile.appendChild(authSpan);

  const contents = document.createElement("div");
  contents.setAttribute("class", "comment-contents active");

  // comment-content 요소 생성
  const text = document.createElement("p");
  text.classList.add("comment-text");
  text.textContent = item.content;

  // comment-createdAt 요소 생성
  const createdAt = document.createElement("time");
  createdAt.classList.add("comment-createdAt");
  createdAt.textContent = getCreatedAt(item.createdAt);

  // comment-btns 요소 생성
  const btns = document.createElement("div");
  btns.classList.add("comment-btns");

  // btn-reply 요소 생성
  const replyBtn = document.createElement("button");
  replyBtn.classList.add("btn-reply");
  replyBtn.textContent = "답글";

  // btn-edit 요소 생성
  const editBtn = document.createElement("button");
  editBtn.setAttribute("type", "submit");
  editBtn.classList.add("btn-edit");
  editBtn.textContent = "수정";

  // btn-del 요소 생성
  const delBtn = document.createElement("button");
  delBtn.classList.add("btn-del");
  delBtn.textContent = "삭제";

  // btns에 replyBtn, editBtn, delBtn 추가
  btns.appendChild(replyBtn);
  if (item.auth === currentUser.displayName) {
    btns.appendChild(editBtn);
    btns.appendChild(delBtn);
  }

  // li에 authProfile, content, createdAt, btns 추가
  li.appendChild(authProfile);
  contents.appendChild(text);
  contents.appendChild(createdAt);
  contents.appendChild(btns);
  li.append(contents);

  // 수정 폼 요소 생성
  const editForm = document.createElement("form");
  editForm.classList.add("editComment-form");

  const editTextarea = document.createElement("textarea");
  editTextarea.id = "input-editComment";
  editTextarea.value = item.content;

  const editCommpleteBtn = document.createElement("button");
  editCommpleteBtn.classList.add("btn-submit");
  editCommpleteBtn.type = "submit";
  editCommpleteBtn.textContent = "수정하기";

  const editCancelBtn = document.createElement("button");
  editCancelBtn.classList.add("btn-cancel");
  editCancelBtn.type = "button";
  editCancelBtn.textContent = "취소하기";

  editForm.appendChild(editTextarea);
  editForm.appendChild(editCommpleteBtn);
  editForm.appendChild(editCancelBtn);

  // 답글 폼 요소 생성
  const replyForm = document.createElement("form");
  replyForm.classList.add("replyComment-form");

  const replyTextarea = document.createElement("textarea");
  replyTextarea.id = "input-replyComment";

  const replySubmitBtn = document.createElement("button");
  replySubmitBtn.classList.add("btn-submit");
  replySubmitBtn.type = "submit";
  replySubmitBtn.textContent = "답글달기";

  const replyCancelBtn = document.createElement("button");
  replyCancelBtn.classList.add("btn-cancel");
  replyCancelBtn.type = "button";
  replyCancelBtn.textContent = "취소하기";

  replyForm.appendChild(replyTextarea);
  replyForm.appendChild(replySubmitBtn);
  replyForm.appendChild(replyCancelBtn);

  const replyLists = document.createElement("ul");
  replyLists.classList.add("reply-lists");

  li.append(editForm, replyForm);
  li.appendChild(replyLists);
  renderReplyComment(replyLists, item.commentId);
  $commentLists.appendChild(li);

  delBtn.addEventListener("click", async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      if (currentUser.displayName !== item.auth) {
        alert("사용자 정보가 일치하지 않습니다!");
        return;
      }
      await deleteComment(item.commentId);
      alert("삭제가 완료되었습니다.");
      e.target.closest("li").remove();
    }
  });

  editBtn.addEventListener("click", async () => {
    contents.classList.remove("active");
    editForm.classList.add("active");
  });

  editCancelBtn.addEventListener("click", () => {
    contents.classList.add("active");
    editForm.classList.remove("active");
  });

  editCommpleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentUser.displayName !== item.auth) {
      alert("사용자 정보가 일치하지 않습니다!");
      contents.classList.add("active");
      editForm.classList.remove("active");
      return;
    }
    if (!editTextarea.value.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }
    if (confirm("정말 수정하시겠습니까?")) {
      editComment(item.commentId, editTextarea.value);
      contents.classList.add("active");
      editForm.classList.remove("active");
      text.textContent = editTextarea.value;
    }
  });

  editTextarea.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 && e.shiftKey) {
      // 쉬프트 + 엔터키를 눌렀을 때
      e.preventDefault();
      editTextarea.value += "\n";
      return;
    } else if (e.keyCode === 13) {
      // 일반 엔터키를 눌렀을 때
      e.preventDefault();
      editCommpleteBtn.click();
    }
  });

  replyBtn.addEventListener("click", () => {
    replyForm.classList.add("active");
  });
  replyCancelBtn.addEventListener("click", () => {
    replyForm.classList.remove("active");
    replyTextarea.value = '';
  });

  replyTextarea.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 && e.shiftKey) {
      // 쉬프트 + 엔터키를 눌렀을 때
      e.preventDefault();
      replyTextarea.value += "\n";
      return;
    } else if (e.keyCode === 13) {
      // 일반 엔터키를 눌렀을 때
      e.preventDefault();
      replySubmitBtn.click();
    }
  });

  replySubmitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!replyTextarea.value.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }
    if (confirm("정말 작성 하시겠습니까?")) {
      const newReply = {
        commentId: uuidv4(),
        content: replyTextarea.value,
        createdAt: new Date().getTime(),
        auth: currentUser.displayName,
        profileImg: currentUser.photoURL,
        parentCommentId: item.commentId,
      };
     await writeReplyComment(newReply, item.commentId);
      contents.classList.add("active");
      replyForm.classList.remove("active");
      addReplyComment(replyLists, newReply);
    }
  });
}
async function addReplyComment(replyLists, item) {
  // li 요소 생성
  const li = document.createElement("li");
  li.classList.add("comment-item");

  // auth-profile 요소 생성
  const authProfile = document.createElement("div");
  authProfile.classList.add("auth-profile");

  // comment-profileImg 요소 생성
  const profileImg = document.createElement("img");
  profileImg.classList.add("comment-profileImg");
  profileImg.src = (await getAuthImg(diary.auth)) || "../img/profile.png";
  profileImg.alt = "유저 프로필";

  // comment-auth 요소 생성
  const authSpan = document.createElement("span");
  authSpan.classList.add("comment-auth");
  authSpan.textContent = item.auth;

  // auth-profile에 profileImg와 authSpan 추가
  authProfile.appendChild(profileImg);
  authProfile.appendChild(authSpan);

  const contents = document.createElement("div");
  contents.setAttribute("class", "comment-contents active");

  // comment-content 요소 생성
  const text = document.createElement("p");
  text.classList.add("comment-text");
  text.textContent = item.content;

  // comment-createdAt 요소 생성
  const createdAt = document.createElement("time");
  createdAt.classList.add("comment-createdAt");
  createdAt.textContent = getCreatedAt(item.createdAt);

  // comment-btns 요소 생성
  const btns = document.createElement("div");
  btns.classList.add("comment-btns");

  // btn-edit 요소 생성
  const editBtn = document.createElement("button");
  editBtn.setAttribute("type", "submit");
  editBtn.classList.add("btn-edit");
  editBtn.textContent = "수정";

  // btn-del 요소 생성
  const delBtn = document.createElement("button");
  delBtn.classList.add("btn-del");
  delBtn.textContent = "삭제";

  // btns에 replyBtn, editBtn, delBtn 추가
  if (item.auth === currentUser.displayName) {
    btns.appendChild(editBtn);
    btns.appendChild(delBtn);
  }

  // li에 authProfile, content, createdAt, btns 추가
  li.appendChild(authProfile);
  contents.appendChild(text);
  contents.appendChild(createdAt);
  contents.appendChild(btns);
  li.append(contents);

  // 수정 폼 요소 생성
  const editForm = document.createElement("form");
  editForm.classList.add("editComment-form");

  const editTextarea = document.createElement("textarea");
  editTextarea.id = "input-editComment";
  editTextarea.value = item.content;

  const editCommpleteBtn = document.createElement("button");
  editCommpleteBtn.classList.add("btn-submit");
  editCommpleteBtn.type = "submit";
  editCommpleteBtn.textContent = "수정하기";

  const editCancelBtn = document.createElement("button");
  editCancelBtn.classList.add("btn-cancel");
  editCancelBtn.type = "button";
  editCancelBtn.textContent = "취소하기";

  editForm.appendChild(editTextarea);
  editForm.appendChild(editCommpleteBtn);
  editForm.appendChild(editCancelBtn);

  li.append(editForm);
  replyLists.appendChild(li);

  delBtn.addEventListener("click", async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      if (currentUser.displayName !== item.auth) {
        alert("사용자 정보가 일치하지 않습니다!");
        return;
      }
      await deleteReplyComment(item.commentId, item.parentCommentId);
      alert("삭제가 완료되었습니다.");
      e.target.closest("li").remove();
    }
  });

  editBtn.addEventListener("click", async () => {
    contents.classList.remove("active");
    editForm.classList.add("active");
  });

  editCancelBtn.addEventListener("click", () => {
    contents.classList.add("active");
    editForm.classList.remove("active");
  });

  editCommpleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentUser.displayName !== item.auth) {
      alert("사용자 정보가 일치하지 않습니다!");
      contents.classList.add("active");
      editForm.classList.remove("active");
      return;
    }
    if (!editTextarea.value.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }
    if (confirm("정말 수정하시겠습니까?")) {
      editReplyComment(
        item.commentId,
        item.parentCommentId,
        editTextarea.value
      );
      contents.classList.add("active");
      editForm.classList.remove("active");
      text.textContent = editTextarea.value;
    }
  });

  editTextarea.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 && e.shiftKey) {
      // 쉬프트 + 엔터키를 눌렀을 때
      e.preventDefault();
      editTextarea.value += "\n";
      return;
    } else if (e.keyCode === 13) {
      // 일반 엔터키를 눌렀을 때
      e.preventDefault();
      editCommpleteBtn.click();
    }
  });
}
renderComment(commentData);
async function renderComment(data) {
  const frag = new DocumentFragment();
  for (const item of data) {
    // li 요소 생성
    const li = document.createElement("li");
    li.classList.add("comment-item");

    // auth-profile 요소 생성
    const authProfile = document.createElement("div");
    authProfile.classList.add("auth-profile");

    // comment-profileImg 요소 생성
    const profileImg = document.createElement("img");
    profileImg.classList.add("comment-profileImg");
    profileImg.src = (await getAuthImg(diary.auth)) || "../img/profile.png";
    profileImg.alt = "유저 프로필";

    // comment-auth 요소 생성
    const authSpan = document.createElement("span");
    authSpan.classList.add("comment-auth");
    authSpan.textContent = item.auth;

    // auth-profile에 profileImg와 authSpan 추가
    authProfile.appendChild(profileImg);
    authProfile.appendChild(authSpan);

    const contents = document.createElement("div");
    contents.setAttribute("class", "comment-contents active");

    // comment-content 요소 생성
    const text = document.createElement("p");
    text.classList.add("comment-text");
    text.textContent = item.content;

    // comment-createdAt 요소 생성
    const createdAt = document.createElement("time");
    createdAt.classList.add("comment-createdAt");
    createdAt.textContent = getCreatedAt(item.createdAt);

    // comment-btns 요소 생성
    const btns = document.createElement("div");
    btns.classList.add("comment-btns");

    // btn-reply 요소 생성
    const replyBtn = document.createElement("button");
    replyBtn.classList.add("btn-reply");
    replyBtn.textContent = "답글";

    // btn-edit 요소 생성
    const editBtn = document.createElement("button");
    editBtn.setAttribute("type", "submit");
    editBtn.classList.add("btn-edit");
    editBtn.textContent = "수정";

    // btn-del 요소 생성
    const delBtn = document.createElement("button");
    delBtn.classList.add("btn-del");
    delBtn.textContent = "삭제";

    // btns에 replyBtn, editBtn, delBtn 추가
    btns.appendChild(replyBtn);
    if (item.auth === currentUser.displayName) {
      btns.appendChild(editBtn);
      btns.appendChild(delBtn);
    }

    // li에 authProfile, content, createdAt, btns 추가
    li.appendChild(authProfile);
    contents.appendChild(text);
    contents.appendChild(createdAt);
    contents.appendChild(btns);
    li.append(contents);

    // 수정 폼 요소 생성
    const editForm = document.createElement("form");
    editForm.classList.add("editComment-form");

    const editTextarea = document.createElement("textarea");
    editTextarea.id = "input-editComment";
    editTextarea.value = item.content;

    const editCommpleteBtn = document.createElement("button");
    editCommpleteBtn.classList.add("btn-submit");
    editCommpleteBtn.type = "submit";
    editCommpleteBtn.textContent = "수정하기";

    const editCancelBtn = document.createElement("button");
    editCancelBtn.classList.add("btn-cancel");
    editCancelBtn.type = "button";
    editCancelBtn.textContent = "취소하기";

    editForm.appendChild(editTextarea);
    editForm.appendChild(editCommpleteBtn);
    editForm.appendChild(editCancelBtn);

    // 답글 폼 요소 생성
    const replyForm = document.createElement("form");
    replyForm.classList.add("replyComment-form");

    const replyTextarea = document.createElement("textarea");
    replyTextarea.id = "input-replyComment";

    const replySubmitBtn = document.createElement("button");
    replySubmitBtn.classList.add("btn-submit");
    replySubmitBtn.type = "submit";
    replySubmitBtn.textContent = "답글달기";

    const replyCancelBtn = document.createElement("button");
    replyCancelBtn.classList.add("btn-cancel");
    replyCancelBtn.type = "button";
    replyCancelBtn.textContent = "취소하기";

    replyForm.appendChild(replyTextarea);
    replyForm.appendChild(replySubmitBtn);
    replyForm.appendChild(replyCancelBtn);

    const replyLists = document.createElement("ul");
    replyLists.classList.add("reply-lists");

    li.append(editForm, replyForm);
    li.appendChild(replyLists);
    renderReplyComment(replyLists, item.commentId);
    frag.appendChild(li);

    delBtn.addEventListener("click", async (e) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        if (currentUser.displayName !== item.auth) {
          alert("사용자 정보가 일치하지 않습니다!");
          return;
        }
        await deleteComment(item.commentId);
        alert("삭제가 완료되었습니다.");
        e.target.closest("li").remove();
      }
    });

    editBtn.addEventListener("click", async () => {
      contents.classList.remove("active");
      editForm.classList.add("active");
    });

    editCancelBtn.addEventListener("click", () => {
      contents.classList.add("active");
      editForm.classList.remove("active");
    });

    editCommpleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentUser.displayName !== item.auth) {
        alert("사용자 정보가 일치하지 않습니다!");
        contents.classList.add("active");
        editForm.classList.remove("active");
        return;
      }
      if (!editTextarea.value.trim()) {
        alert("내용을 입력해주세요!");
        return;
      }
      if (confirm("정말 수정하시겠습니까?")) {
        editComment(item.commentId, editTextarea.value);
        contents.classList.add("active");
        editForm.classList.remove("active");
        text.textContent = editTextarea.value;
      }
    });

    editTextarea.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 && e.shiftKey) {
        // 쉬프트 + 엔터키를 눌렀을 때
        e.preventDefault();
        editTextarea.value += "\n";
        return;
      } else if (e.keyCode === 13) {
        // 일반 엔터키를 눌렀을 때
        e.preventDefault();
        editCommpleteBtn.click();
      }
    });

    replyBtn.addEventListener("click", () => {
      replyForm.classList.add("active");
    });
    replyCancelBtn.addEventListener("click", () => {
      replyForm.classList.remove("active");
    });
    replyTextarea.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 && e.shiftKey) {
        // 쉬프트 + 엔터키를 눌렀을 때
        e.preventDefault();
        replyTextarea.value += "\n";
        return;
      } else if (e.keyCode === 13) {
        // 일반 엔터키를 눌렀을 때
        e.preventDefault();
        replySubmitBtn.click();
      }
    });
    replySubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!replyTextarea.value.trim()) {
        alert("내용을 입력해주세요!");
        return;
      }
      if (confirm("정말 작성 하시겠습니까?")) {
        const newReply = {
          commentId: uuidv4(),
          content: replyTextarea.value,
          createdAt: new Date().getTime(),
          auth: currentUser.displayName,
          profileImg: currentUser.photoURL,
          parentCommentId: item.commentId,
        };
        writeReplyComment(newReply, item.commentId);
        contents.classList.add("active");
        replyForm.classList.remove("active");
        addReplyComment(replyLists, newReply)
      }
    });
  }
  $commentLists.appendChild(frag);
}

$commentInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 && e.shiftKey) {
    // 쉬프트 + 엔터키를 눌렀을 때
    e.preventDefault();
    $commentInput.value += "\n";
    return;
  } else if (e.keyCode === 13) {
    // 일반 엔터키를 눌렀을 때
    e.preventDefault();
    $commentSubitBtn.click();
  }
});
async function firstComment() {
  const comment = collection(db, "comment");
  const q = query(
    comment,
    where("diaryId", "==", id),
    orderBy("createdAt", "asc"),
    limit(4)
  );
  const res = await getDocs(q);
  lastpage = res.docs[res.docs.length - 1];
  hasNextpage = res.docs.length === 4;
  const datas = res.docs.map((el) => el.data());
  return datas;
}

async function nextComment() {
  const commentRef = collection(db, "comment");
  const q = query(
    commentRef,
    where("diaryId", "==", id),
    orderBy("createdAt", "asc"),
    startAfter(lastpage),
    limit(4)
  );
  const res = await getDocs(q);
  lastpage = res.docs[res.docs.length - 1];
  const datas = res.docs.map((el) => el.data());
  hasNextpage = res.docs.length === 4;
  return datas;
}

// 무한스크롤 구현
async function addItems() {
  if (!hasNextpage) {
    return;
  }

  const commentData = await nextComment();
  renderComment(commentData);
}

function handleScroll() {
  const scrollBottom =
    $sectionContents.scrollTop + $sectionContents.clientHeight >=
    $sectionContents.scrollHeight - 1;

  if (scrollBottom) {
    addItems();
  }
}

// 스크롤이 끝까지 내려가면 다음 4개 요소를 출력
$sectionContents.addEventListener("scroll", handleScroll);

async function renderReplyComment(replyLists, commentId) {
  const frag = new DocumentFragment();
  const data = await fetchReplyComments(commentId);
  for (const item of data) {
    // li 요소 생성
    const li = document.createElement("li");
    li.classList.add("comment-item");

    // auth-profile 요소 생성
    const authProfile = document.createElement("div");
    authProfile.classList.add("auth-profile");

    // comment-profileImg 요소 생성
    const profileImg = document.createElement("img");
    profileImg.classList.add("comment-profileImg");
    profileImg.src = (await getAuthImg(diary.auth)) || "../img/profile.png";
    profileImg.alt = "유저 프로필";

    // comment-auth 요소 생성
    const authSpan = document.createElement("span");
    authSpan.classList.add("comment-auth");
    authSpan.textContent = item.auth;

    // auth-profile에 profileImg와 authSpan 추가
    authProfile.appendChild(profileImg);
    authProfile.appendChild(authSpan);

    const contents = document.createElement("div");
    contents.setAttribute("class", "comment-contents active");

    // comment-content 요소 생성
    const text = document.createElement("p");
    text.classList.add("comment-text");
    text.textContent = item.content;

    // comment-createdAt 요소 생성
    const createdAt = document.createElement("time");
    createdAt.classList.add("comment-createdAt");
    createdAt.textContent = getCreatedAt(item.createdAt);

    // comment-btns 요소 생성
    const btns = document.createElement("div");
    btns.classList.add("comment-btns");

    // btn-edit 요소 생성
    const editBtn = document.createElement("button");
    editBtn.setAttribute("type", "submit");
    editBtn.classList.add("btn-edit");
    editBtn.textContent = "수정";

    // btn-del 요소 생성
    const delBtn = document.createElement("button");
    delBtn.classList.add("btn-del");
    delBtn.textContent = "삭제";

    // btns에 replyBtn, editBtn, delBtn 추가
    if (item.auth === currentUser.displayName) {
      btns.appendChild(editBtn);
      btns.appendChild(delBtn);
    }

    // li에 authProfile, content, createdAt, btns 추가
    li.appendChild(authProfile);
    contents.appendChild(text);
    contents.appendChild(createdAt);
    contents.appendChild(btns);
    li.append(contents);

    // 수정 폼 요소 생성
    const editForm = document.createElement("form");
    editForm.classList.add("editComment-form");

    const editTextarea = document.createElement("textarea");
    editTextarea.id = "input-editComment";
    editTextarea.value = item.content;

    const editCommpleteBtn = document.createElement("button");
    editCommpleteBtn.classList.add("btn-submit");
    editCommpleteBtn.type = "submit";
    editCommpleteBtn.textContent = "수정하기";

    const editCancelBtn = document.createElement("button");
    editCancelBtn.classList.add("btn-cancel");
    editCancelBtn.type = "button";
    editCancelBtn.textContent = "취소하기";

    editForm.appendChild(editTextarea);
    editForm.appendChild(editCommpleteBtn);
    editForm.appendChild(editCancelBtn);

    li.append(editForm);
    frag.appendChild(li);

    delBtn.addEventListener("click", async (e) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        if (currentUser.displayName !== item.auth) {
          alert("사용자 정보가 일치하지 않습니다!");
          return;
        }
        await deleteReplyComment(item.commentId, item.parentCommentId);
        alert("삭제가 완료되었습니다.");
        e.target.closest("li").remove();
      }
    });

    editBtn.addEventListener("click", async () => {
      contents.classList.remove("active");
      editForm.classList.add("active");
    });

    editCancelBtn.addEventListener("click", () => {
      contents.classList.add("active");
      editForm.classList.remove("active");
    });

    editCommpleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentUser.displayName !== item.auth) {
        alert("사용자 정보가 일치하지 않습니다!");
        contents.classList.add("active");
        editForm.classList.remove("active");
        return;
      }
      if (!editTextarea.value.trim()) {
        alert("내용을 입력해주세요!");
        return;
      }
      if (confirm("정말 수정하시겠습니까?")) {
        editReplyComment(
          item.commentId,
          item.parentCommentId,
          editTextarea.value
        );
        contents.classList.add("active");
        editForm.classList.remove("active");
        text.textContent = editTextarea.value;
      }
    });

    editTextarea.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 && e.shiftKey) {
        // 쉬프트 + 엔터키를 눌렀을 때
        e.preventDefault();
        editTextarea.value += "\n";
        return;
      } else if (e.keyCode === 13) {
        // 일반 엔터키를 눌렀을 때
        e.preventDefault();
        editCommpleteBtn.click();
      }
    });
    
  }
  replyLists.appendChild(frag);
}
