// 댓글 관련 함수 모듈
import { v4 as uuidv4 } from "uuid";
import { currentUser, getAuthImg } from "../../firebase/auth/firebase_auth.js";
import {
  deleteComment,
  editComment,
  writeComment,
  writeReplyComment,
} from "../../firebase/comment/firebase_comment.js";
import { getCreatedAt, getKST } from "../../commons/libray.js";
import {
  addReplyComment,
  renderReplyComment,
} from "../diaryReplyComment/diaryReplyComment.js";
import {
  firstComment,
  pageVarialbes,
} from "../diaryInfinityScroll/diaryInfinityScroll.js";

const $sectionContents = document.querySelector(".section-contents");
const $commentLists = $sectionContents.querySelector(".comment-lists");
const $commentForm = $sectionContents.querySelector(".comment-form");
const $commentInput = $commentForm.querySelector("#input-comment");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

renderComment(await firstComment());

// 댓글 추가 함수
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
      createdAt: getKST().getTime(),
    };
    await writeComment(newComment);
    $commentInput.value = "";
    // 만약에 데이터가 없을 경우에만 직접 동적으로 요소를 생성
    // 다른경우에는 무한 스크롤이 적용되어서 데이터를 불러와서 자동으로 요소를 생성하므로
    if (!pageVarialbes.hasNextpage) {
      addComment(newComment);
    }
  }
}

// 댓글 요소 추가 함수
async function addComment(item) {
  const li = await createCommentEl(item);
  $commentLists.appendChild(li);
}

async function renderComment(data) {
  const frag = new DocumentFragment();
  for (const item of data) {
    const li = await createCommentEl(item);
    frag.appendChild(li);
  }
  $commentLists.appendChild(frag);
}

async function createCommentEl(item) {
  // li 요소 생성
  const li = document.createElement("li");
  li.classList.add("comment-item");

  // auth-profile 요소 생성
  const authProfile = document.createElement("div");
  authProfile.classList.add("auth-profile");

  // comment-profileImg 요소 생성
  const profileImg = document.createElement("img");
  profileImg.classList.add("comment-profileImg");
  profileImg.src = (await getAuthImg(item.auth)) || "./img/profile.png";
  profileImg.alt = "유저 프로필 이미지";

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

  const editTextareaWrapper = document.createElement("div");
  editTextareaWrapper.classList.add("textarea-wrapper");

  const editTextarea = document.createElement("textarea");
  editTextarea.id = "input-editComment";
  editTextarea.value = item.content;
  editTextarea.maxLength = 300;
  editTextarea.placeholder =
    "개인정보를 공용 및 요청하거나 명예훼손, 무단 광고, 불법 정보 유포시 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다.";

  const editTextareaBottom = document.createElement("div");
  editTextareaBottom.classList.add("textarea-bottom");

  const editTextareaTextCount = document.createElement("span");
  editTextareaTextCount.classList.add("text-count");
  editTextareaTextCount.textContent = `${editTextarea.value.length}/300`;

  const editTextareaBtns = document.createElement("div");
  editTextareaBtns.classList.add("btns-editTextarea");

  editTextareaBottom.appendChild(editTextareaTextCount);
  editTextareaBottom.appendChild(editTextareaBtns);

  const editCommpleteBtn = document.createElement("button");
  editCommpleteBtn.classList.add("btn-submit");
  editCommpleteBtn.type = "submit";
  editCommpleteBtn.textContent = "수정하기";

  const editCancelBtn = document.createElement("button");
  editCancelBtn.classList.add("btn-cancel");
  editCancelBtn.type = "button";
  editCancelBtn.textContent = "취소하기";

  editTextareaWrapper.appendChild(editTextarea);
  editTextareaWrapper.appendChild(editTextareaBottom);
  editTextareaBtns.appendChild(editCommpleteBtn);
  editTextareaBtns.appendChild(editCancelBtn);
  editForm.appendChild(editTextareaWrapper);

  // 답글 폼 요소 생성
  const replyForm = document.createElement("form");
  replyForm.classList.add("replyComment-form");

  const replyTextareaWrapper = document.createElement("div");
  replyTextareaWrapper.classList.add("textarea-wrapper");

  const replyTextarea = document.createElement("textarea");
  replyTextarea.id = "input-replyComment";
  replyTextarea.maxLength = 300;
  replyTextarea.placeholder =
    "개인정보를 공용 및 요청하거나 명예훼손, 무단 광고, 불법 정보 유포시 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다.";

  const replyTextareaBottom = document.createElement("div");
  replyTextareaBottom.classList.add("textarea-bottom");

  const replyTextareaTextCount = document.createElement("span");
  replyTextareaTextCount.classList.add("text-count");
  replyTextareaTextCount.textContent = `${replyTextarea.value.length}/300`;

  const replyTextareaBtns = document.createElement("div");
  replyTextareaBtns.classList.add("btns-editTextarea");

  replyTextareaBottom.appendChild(replyTextareaTextCount);
  replyTextareaBottom.appendChild(replyTextareaBtns);

  const replySubmitBtn = document.createElement("button");
  replySubmitBtn.classList.add("btn-submit");
  replySubmitBtn.type = "submit";
  replySubmitBtn.textContent = "답글달기";

  const replyCancelBtn = document.createElement("button");
  replyCancelBtn.classList.add("btn-cancel");
  replyCancelBtn.type = "button";
  replyCancelBtn.textContent = "취소하기";

  replyTextareaWrapper.appendChild(replyTextarea);
  replyTextareaWrapper.appendChild(replyTextareaBottom);
  replyTextareaBtns.appendChild(replySubmitBtn);
  replyTextareaBtns.appendChild(replyCancelBtn);
  replyForm.appendChild(replyTextareaWrapper);

  const replyLists = document.createElement("ul");
  replyLists.classList.add("reply-lists");

  li.appendChild(editForm);
  li.appendChild(replyForm);
  li.appendChild(replyLists);
  renderReplyComment(replyLists, item.commentId);

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
    replyForm.classList.remove("active");
    replyTextarea.value = "";
  });

  editCancelBtn.addEventListener("click", (e) => {
    editTextarea.value = item.content;
    editTextareaTextCount.textContent = `${editTextarea.value.length}/300`;
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
    if (editTextarea.value === item.content) {
      alert("수정한 내용이 업습니다!");
      return;
    }
    if (confirm("정말 수정하시겠습니까?")) {
      editComment(item.commentId, editTextarea.value);
      contents.classList.add("active");
      editForm.classList.remove("active");
      text.textContent = editTextarea.value;
    }
  });
  editTextarea.addEventListener("paste", (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text/plain");
    const totalLength = editTextarea.value.length + pastedText.length;

    if (totalLength > 300) {
      e.preventDefault();
      // 글자 수 초과 처리
      alert("최대 입력 가능한 글자 수는 300자 입니다!");
    }
  });
  editTextarea.addEventListener("input", (e) => {
    if (e.target.value.length >= 300) {
      editTextareaTextCount.textContent = "300/300";
      return;
    }
    editTextareaTextCount.textContent = `${e.target.value.length}/300`;
  });

  editTextarea.addEventListener("keydown", (e) => {
    // 글자수 초과시 개행 방지
    if (e.keyCode === 13 && e.shiftKey && e.target.value.length >= 300) {
      e.preventDefault();
      return;
    }
    if (e.keyCode === 13 && e.shiftKey) {
      // 쉬프트 + 엔터키를 눌렀을 때
      e.preventDefault();
      const enterPost = editTextarea.selectionStart;
      const value = editTextarea.value;

      editTextarea.value =
        value.substring(0, enterPost) +
        "\n" +
        value.substring(enterPost, value.length);
      editTextareaTextCount.textContent = `${e.target.value.length}/300`;
      // 커서 위치 조정
      editTextarea.selectionStart = enterPost + 1;
      editTextarea.selectionEnd = enterPost + 1;
      editTextarea.scrollTop = editTextarea.scrollHeight;
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
    replyTextarea.value = "";
    replyForm.classList.remove("active");
    replyTextareaTextCount.textContent = "0/300";
  });

  replyTextarea.addEventListener("input", (e) => {
    if (e.target.value.length > 300) {
      replyTextareaTextCount.textContent = "300/300";
      return;
    }
    replyTextareaTextCount.textContent = `${e.target.value.length}/300`;
  });

  replyTextarea.addEventListener("paste", (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text/plain");
    const totalLength = replyTextarea.value.length + pastedText.length;

    if (totalLength > 300) {
      e.preventDefault();
      // 글자 수 초과 처리
      alert("최대 입력 가능한 글자 수는 300자 입니다!");
    }
  });

  replyTextarea.addEventListener("keydown", (e) => {
    // 글자수 초과시 개행 방지
    if (e.keyCode === 13 && e.shiftKey && e.target.value.length > 300) {
      e.preventDefault();
      return;
    } else if (e.keyCode === 13 && e.shiftKey) {
      // 쉬프트 + 엔터키를 눌렀을 때
      e.preventDefault();
      const enterPost = replyTextarea.selectionStart;
      const value = replyTextarea.value;

      replyTextarea.value =
        value.substring(0, enterPost) +
        "\n" +
        value.substring(enterPost, value.length);
      replyTextareaTextCount.textContent = `${e.target.value.length}/300`;
      // 커서 위치 조정
      replyTextarea.selectionStart = enterPost + 1;
      replyTextarea.selectionEnd = enterPost + 1;
      replyTextarea.scrollTop = replyTextarea.scrollHeight;
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
        createdAt: getKST().getTime(),
        auth: currentUser.displayName,
        profileImg: currentUser.photoURL,
        parentCommentId: item.commentId,
      };
      writeReplyComment(newReply, item.commentId);
      replyTextarea.value = "";
      contents.classList.add("active");
      replyForm.classList.remove("active");
      addReplyComment(replyLists, newReply);
    }
  });

  return li;
}

export { submitComment, addComment, renderComment };
