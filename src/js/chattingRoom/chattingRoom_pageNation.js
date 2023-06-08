import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  startAfter,
  endBefore,
  limit,
  onSnapshot,
  limitToLast,
} from "firebase/firestore";
import { db } from "../firebase/setting/firebase_setting.js";
import { keyword, renderChattingRooms } from "./chattingRoom.js";

const $sectionContents = document.querySelector(".section-contents");
const $loadingModal = $sectionContents.querySelector(".loading-modal");
const $pageNum = $sectionContents.querySelector(".page-num");

// 변수 객체 생성 다른 모듈에서 프로퍼티에 접근하여 값을 변경하기 위해서
const variables = {
hasNextPage: false,
nextFirstPage: null,
prevFirstPage: null,
currentPage: 1,
totalPage: 1,
currentSnapshotUnsubscribe: null,
}

async function fetchFirstPage() {
  $loadingModal.classList.add("active");
  const chattingRoomRef = collection(db, "chatRoom");
  if (keyword.trim()) {
    const q = query(
      chattingRoomRef,
      orderBy("title"),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      limit(16)
    );
    return new Promise((resolve, reject) => {
      variables.currentSnapshotUnsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          const data = snapshot.docs.map((el) => el.data());
          const res = await getDocs(chattingRoomRef);
          variables.totalPage = Math.ceil(res.docs.length / 16);
          variables.hasNextPage = snapshot.docs.length === 16;
          resolve(data);
          renderChattingRooms(data);
        } catch (error) {
          reject(error);
        }
      });
    });
  } else {
    const q = query(chattingRoomRef, orderBy("createdAt", "desc"), limit(16));
    return new Promise((resolve, reject) => {
      variables.currentSnapshotUnsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          // 현재 최신 전체 데이터 수를 불러옴
          const res = await getDocs(chattingRoomRef);
          variables.totalPage = Math.ceil(res.docs.length / 16);
          const data = snapshot.docs.map((el) => el.data());
          variables.prevFirstPage = snapshot.docs[0];
          variables.nextFirstPage = snapshot.docs[snapshot.docs.length - 1];
          variables.hasNextPage = snapshot.docs.length === 16;
          resolve(data);
          renderChattingRooms(data);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

async function fetchPage(type) {
  const chattingRoomRef = collection(db, "chatRoom");
  let q;

  if (keyword.trim()) {
    q = query(
      chattingRoomRef,
      orderBy("title"),
      where("title", ">=", keyword),
      where("title", "<=", keyword + "\uf8ff"),
      type === "prev" ? endBefore(variables.prevFirstPage) : startAfter(variables.nextFirstPage),
      limit(16)
    );
  } else {
    q = query(
      chattingRoomRef,
      orderBy("createdAt", "desc"),
      type === "prev" ? endBefore(variables.prevFirstPage) : startAfter(variables.nextFirstPage),
      type === "prev" ? limitToLast(16) : limit(16)
    );
  }

  return new Promise((resolve, reject) => {
    variables.currentSnapshotUnsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const res = await getDocs(chattingRoomRef);
        variables.totalPage = Math.ceil(res.docs.length / 16);
        const data = snapshot.docs.map((el) => el.data());
        // 마지막 페이지 첫번째 데이터가 삭제될 경우 예외 처리
        // 데이터가 있을 경우에만 페이지를 저장
        if (data.length > 0) {
          variables.prevFirstPage = snapshot.docs[0];
          variables.nextFirstPage = snapshot.docs[snapshot.docs.length - 1];
        }

        variables.hasNextPage = snapshot.docs.length === 16;
        resolve(data);
        renderChattingRooms(data);
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function goToPrevPage() {
  if (variables.currentPage > 1) {
    variables.currentPage--;
    $pageNum.textContent = variables.currentPage + "/" + variables.totalPage;
    variables.currentSnapshotUnsubscribe();
    fetchPage("prev");
  }
}

async function goToNextPage() {
  if (variables.hasNextPage && variables.currentPage !== variables.totalPage) {
    variables.currentPage++;
    $pageNum.textContent = variables.currentPage + "/" + variables.totalPage;
    variables.currentSnapshotUnsubscribe();
    fetchPage("next");
  }
}

export {
  fetchFirstPage,
  fetchPage,
  goToPrevPage,
  goToNextPage,
  variables,
};
