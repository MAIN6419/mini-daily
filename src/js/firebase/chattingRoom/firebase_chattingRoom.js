import {
  collection,
  query,
  orderBy,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../setting/firebase_setting.js";

let baseUrl = "";
const host = window.location.host;
if (host.includes("github.io")) {
  baseUrl = "/mini-diary";
}

async function createChattingRoom({
  id,
  title,
  limit,
  isprivate,
  password,
  createdAt,
}) {
  const chatRoomRef = collection(db, "chatRoom");
  await setDoc(doc(chatRoomRef, id), {
    id,
    title,
    limit,
    users: [],
    isprivate,
    password,
    createdAt,
  });
  location.href = `${baseUrl}/src/template/chatting.html?id=${id}`;
}

async function fetchChattingRoom() {
  const chatRoomRef = collection(db, "chatRoom");
  const q = query(chatRoomRef, orderBy("createdAt", "desc"));
  return new Promise((resolve, reject) => {
    onSnapshot(q, (snapshot) => {
      try {
        const data = snapshot.docs.map((el) => el.data());
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function checkJoinRoom(chatRoomId) {
  try {
    const roomRef = doc(db, `chatRoom/${chatRoomId}`);
    const res = await getDoc(roomRef);
    const data = res.data();
    return data;
  } catch (error) {
    throw error;
  }
}

export { createChattingRoom, fetchChattingRoom, checkJoinRoom };
