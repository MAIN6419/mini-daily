// 무한 스크롤 관련 함수 모듈
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  startAfter,
  limit,
} from "firebase/firestore";
import { renderComment } from "../diaryComment/diaryComment.js";
import { db } from "../../firebase/setting/firebase_setting.js";

const $sectionContents = document.querySelector(".section-contents");

const pageVarialbes = {
  lastpage: null,
  hasNextpage: false,
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

async function firstComment() {
  const comment = collection(db, "comment");
  const q = query(
    comment,
    where("diaryId", "==", id),
    orderBy("createdAt", "asc"),
    limit(4)
  );
  const res = await getDocs(q);
  pageVarialbes.lastpage = res.docs[res.docs.length - 1];
  pageVarialbes.hasNextpage = res.docs.length === 4;
  const datas = res.docs.map((el) => el.data());
  return datas;
}

async function nextComment() {
  const commentRef = collection(db, "comment");
  const q = query(
    commentRef,
    where("diaryId", "==", id),
    orderBy("createdAt", "asc"),
    startAfter(pageVarialbes.lastpage),
    limit(4)
  );
  const res = await getDocs(q);
  pageVarialbes.lastpage = res.docs[res.docs.length - 1];
  const datas = res.docs.map((el) => el.data());
  pageVarialbes.hasNextpage = res.docs.length === 4;
  return datas;
}

// 무한스크롤 구현
async function addItems() {
  if (!pageVarialbes.hasNextpage) {
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

export{ firstComment, nextComment, pageVarialbes }