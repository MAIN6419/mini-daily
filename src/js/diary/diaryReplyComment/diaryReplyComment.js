import { getCreatedAt } from "../../commons/libray.js";
import { currentUser, getAuthImg } from "../../firebase/auth/firebase_auth.js";
import {
  deleteReplyComment,
  editReplyComment,
  fetchReplyComments,
} from "../../firebase/comment/firebase_comment.js";

async function addReplyComment(replyLists, item) {
  const li = await createReplyCommentEl(item);
  replyLists.appendChild(li);
}

async function renderReplyComment(replyLists, commentId) {
  const frag = new DocumentFragment();
  const data = await fetchReplyComments(commentId);
  for (const item of data) {
    const li = await createReplyCommentEl(item);
    frag.appendChild(li);
  }
  replyLists.appendChild(frag);
}
async function createReplyCommentEl(item) {
  const li = document.createElement("li");
  li.classList.add("comment-item");

  const authProfile = document.createElement("div");
  authProfile.classList.add("auth-profile");

  const profileImg = document.createElement("img");
  profileImg.classList.add("comment-profileImg");
  profileImg.src = (await getAuthImg(item.auth)) || "./img/profile.png";
  profileImg.alt = "유저 프로필";

  const authSpan = document.createElement("span");
  authSpan.classList.add("comment-auth");
  authSpan.textContent = item.auth;

  authProfile.appendChild(profileImg);
  authProfile.appendChild(authSpan);

  const contents = document.createElement("div");
  contents.setAttribute("class", "comment-contents active");

  const text = document.createElement("p");
  text.classList.add("comment-text");
  text.textContent = item.content;

  const createdAt = document.createElement("time");
  createdAt.classList.add("comment-createdAt");
  createdAt.textContent = getCreatedAt(item.createdAt);

  const btns = document.createElement("div");
  btns.classList.add("comment-btns");

  const editBtn = document.createElement("button");
  editBtn.setAttribute("type", "submit");
  editBtn.classList.add("btn-edit");
  editBtn.textContent = "수정";

  const delBtn = document.createElement("button");
  delBtn.classList.add("btn-del");
  delBtn.textContent = "삭제";

  if (item.auth === currentUser.displayName) {
    btns.appendChild(editBtn);
    btns.appendChild(delBtn);
  }

  li.appendChild(authProfile);
  contents.appendChild(text);
  contents.appendChild(createdAt);
  contents.appendChild(btns);
  li.append(contents);

  const editForm = document.createElement("form");
  editForm.classList.add("editComment-form");

  const editTextareaWrapper = document.createElement("div");
  editTextareaWrapper.classList.add("textarea-wrapper");

  const editTextarea = document.createElement("textarea");
  editTextarea.id = "input-editComment";
  editTextarea.value = item.content;
  editTextarea.maxLength = 300;
  editTextarea.placeholder =
    "개인정보를 공용 및 요청하거나 명예훼손, 무단 광고, 불법 정보 유포시 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다.\n(Shift+Enter를 누르면 줄 바꿈이 됩니다.)";

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
  editTextareaBtns.appendChild(editCommpleteBtn);
  editTextareaBtns.appendChild(editCancelBtn);
  editTextareaWrapper.appendChild(editTextareaBottom);
  editForm.appendChild(editTextareaWrapper);
  li.append(editForm);

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
  // 붙여넣기시 글자 수가 최대 글자 수를 초과한다면 경고창 출력
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
    if (e.keyCode === 13 && e.shiftKey && e.target.value.length >= 300) {
      e.preventDefault();
      return;
    } else if (e.keyCode === 13 && e.shiftKey) {
      e.preventDefault();
      const enterPos = editTextarea.selectionStart;
      const value = editTextarea.value;
      editTextarea.value =
        value.substring(0, enterPos) + "\n" + value.substring(enterPos, editTextarea.value.length);
      editTextareaTextCount.textContent = `${e.target.value.length}/300`;
      // 커서 위치 조정
      editTextarea.selectionStart = enterPos + 1;
      editTextarea.selectionEnd = enterPos + 1;
      editTextarea.scrollTop = editTextarea.scrollHeight;
      return;
    } else if (e.keyCode === 13) {
      e.preventDefault();
      editCommpleteBtn.click();
    }
  });

  return li;
}

export { addReplyComment, renderReplyComment };
