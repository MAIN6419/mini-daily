import {
  arrayRemove,
  arrayUnion,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../setting/firebase_setting.js";
let isfirst = true;

// 채팅방 참가시 실행되는 함수
const joinChatRoom = async (chatRoomId, userNickname, renderJoinUser) => {
  if (!chatRoomId) {
    alert("잘못된 경로입니다!");
    return location.replace("chattingRoom.html");
  }

  try {
    const chatRoomRef = doc(db, "chatRoom", chatRoomId);
    const res = await getDoc(chatRoomRef);
    const data = res.data();

    if (!data) {
      alert("삭제되거나 존재하지 않는 채팅방입니다!");
      return location.replace("chattingRoom.html");
    }

    if (data.users.length >= data.limit) {
      alert("입장 가능한 인원을 초과하였습니다!");
      return location.replace("chattingRoom.html");
    }

    await updateDoc(chatRoomRef, {
      users: arrayUnion(userNickname),
    });

    currentSnapshotUnsubscribe = onSnapshot(chatRoomRef, async (snapshot) => {
      try {
        const data = snapshot.data();

        if (!data) {
          console.log("Data is undefined.");
          return;
        }

        renderJoinUser(data);
        isfirst = false;
      } catch (error) {
        console.log(error);
      }
    });

    window.addEventListener("beforeunload", async (event) => {
      if (!isfirst) {
        await updateDoc(chatRoomRef, {
          users: arrayRemove(userNickname),
        });
      }
    });
  } catch (error) {
    if (error.message.includes("No document to update")) {
      alert("삭제되거나 존재하지 않는 채팅방입니다!");
      location.replace("chattingRoom.html");
    }
  }
};

// 채팅방 데이터 불러오는 함수
async function fetchChatting($chattingBox, chatRoomId, renderChattingMsg) {
  const chatRef = collection(db, `chat${chatRoomId}`);
  const userRef = collection(db, "user");
  const userDocs = await getDocs(userRef);
  const res = userDocs.docs.map((el) => el.data());

  const q = query(chatRef, orderBy("createdAt", "asc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        const userInfo = res.find((el) => el.nickname === data.user);
        await renderChattingMsg(data, userInfo);
      }
    });
    $chattingBox.scrollTop = $chattingBox.scrollHeight;
  });

  return unsubscribe; // 이벤트 리스너 해제를 위해 unsubscribe 함수 반환
}

// 채팅 추가 함수
async function addChatting(chatRoomId, newChat) {
  const chatRef = collection(db, "chat" + chatRoomId);
  try {
    // Firestore에 새로운 메시지 추가
    await setDoc(doc(chatRef, newChat.id), {
      id: newChat.id,
      message: newChat.message,
      user: newChat.user,
      createdAt: newChat.createdAt,
      type: "added",
    });
  } catch (error) {
    alert("알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
}

async function deleteChat(chatRoomId, id) {
  try {
    await updateDoc(doc(db, `chat${chatRoomId}/${id}`), {
      message: "삭제된 메세지 입니다.",
      type: "delete",
    });
  } catch (error) {
    throw error;
  }
}
export { joinChatRoom, fetchChatting, addChatting, deleteChat };
