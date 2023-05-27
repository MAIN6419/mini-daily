import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { db, currentUser } from "../setting/firebase_setting";
import { getKST } from "../../commons/libray";

// 댓글 작성 함수
async function writeComment(commentData) {
  try {
    const userRef = doc(db, "user", currentUser.displayName);
    let userDoc = await getDoc(userRef);
    let data = userDoc.data();
    let maxCommentPoint = data.maxCommentPoint;
    const resetCommentPoint =
      new Date(data.lastCommentDate).getFullYear() !== getKST().getFullYear() &&
      new Date(data.lastCommentDate).getMonth() !== getKST().getMonth() &&
      new Date(data.lastCommentDate).getDate() !== getKST().getDate();

    if (resetCommentPoint) {
      await updateDoc(userRef, {
        maxCommentPoint: 0,
      });
      userDoc = await getDoc(userRef);
      data = userDoc.data();
      maxCommentPoint = data.maxCommentPoint;
    }
    const commentRef = collection(db, "comment");
    await setDoc(doc(commentRef, commentData.commentId), {
      ...commentData,
    });

    await updateDoc(userRef, {
      commentCount: increment(1),
      lastCommentDate: new Date().getTime(),
      maxCommentPoint: maxCommentPoint < 3 ? increment(1) : increment(0),
      point: maxCommentPoint < 3 ? increment(1) : increment(0),
    });
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
}

// 댓글 데이터 불러오는 함수
async function fetchComment(id) {
  try {
    const commentRef = collection(db, `comment`);
    const q = query(commentRef, where("diaryId", "==", id));
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    return datas;
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
}

// 댓글 삭제 함수
async function deleteComment(id) {
  try {
    const userRef = doc(db, "user", currentUser.displayName);

    await deleteDoc(doc(db, `comment/${id}`));
    await updateDoc(userRef, { commentCount: increment(-1) });
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
}

// 댓글 수정 함수
async function editComment(id, content) {
  try {
    await updateDoc(doc(db, `comment/${id}`), {
      content,
    });
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
}

// 답글 추가 함수
async function writeReplyComment(newReply, parentCommentId) {
  const userRef = doc(db, "user", currentUser.displayName);
  let userDoc = await getDoc(userRef);
  let data = userDoc.data();
  let maxCommentPoint = data.maxCommentPoint;
  const resetCommentPoint =
    new Date(data.lastCommentDate).getFullYear() !== getKST().getFullYear() &&
    new Date(data.lastCommentDate).getMonth() !== getKST().getMonth() &&
    new Date(data.lastCommentDate).getDate() !== getKST().getDate();
  if (resetCommentPoint) {
    await updateDoc(userRef, {
      maxCommentPoint: 0,
    });
    userDoc = await getDoc(userRef);
    data = userDoc.data();
    maxCommentPoint = data.maxCommentPoint;
  }

  const commentsCollection = collection(db, "comment");
  const parentCommentRef = doc(commentsCollection, parentCommentId);
  const replyCommentRef = collection(parentCommentRef, "replyComment");
  await setDoc(doc(replyCommentRef, newReply.commentId), {
    ...newReply,
  });

  await updateDoc(userRef, {
    lastCommentDate: getKST().getTime(),
    maxCommentPoint: maxCommentPoint < 3 ? increment(1) : increment(0),
    point: maxCommentPoint < 3 ? increment(1) : increment(0),
    commentCount: increment(1),
  });
}

// 답글 삭제 함수
async function deleteReplyComment(replyCommentId, parentCommentId) {
  const commentsCollection = collection(db, "comment");
  const parentCommentRef = doc(commentsCollection, parentCommentId);
  const replyCommentRef = collection(parentCommentRef, "replyComment");
  const deleteReplyRef = doc(replyCommentRef, replyCommentId);

  const userRef = doc(db, "user", currentUser.displayName);

  await deleteDoc(deleteReplyRef);
  await updateDoc(userRef, { commentCount: increment(-1) });
}

// 답글 수정 함수
async function editReplyComment(replyCommentId, parentCommentId, content) {
  const commentsCollection = collection(db, "comment");
  const parentCommentRef = doc(commentsCollection, parentCommentId);
  const replyCommentRef = collection(parentCommentRef, "replyComment");
  const updateReplyRef = doc(replyCommentRef, replyCommentId);

  await updateDoc(updateReplyRef, {
    content,
  });
}

// 답글 불러오는 함수
async function fetchReplyComments(parentCommentId) {
  const parentCommentRef = doc(db, "comment", parentCommentId);
  const replyCommentsRef = collection(parentCommentRef, "replyComment");

  const q = query(replyCommentsRef);

  const querySnapshot = await getDocs(q);
  const replyComments = [];

  querySnapshot.forEach((doc) => {
    replyComments.push(doc.data());
  });

  return replyComments;
}

export {
  writeComment,
  fetchComment,
  deleteComment,
  editComment,
  writeReplyComment,
  deleteReplyComment,
  editReplyComment,
  fetchReplyComments,
};
