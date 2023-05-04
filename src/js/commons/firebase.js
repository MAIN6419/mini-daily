import KEY from "../../config/firebase.json" assert { type: "json" };
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import {
  arrayRemove,
  arrayUnion,
  getFirestore,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  startAfter,
  endAt,
  limit,
  getDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import {
  uploadBytes,
  ref,
  getDownloadURL,
  getStorage,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updatePassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { getCreatedAt } from "./libray.js";

const userData = JSON.parse(sessionStorage.getItem("userData"));
let baseUrl = "";
const host = window.location.host;
if (host.includes("github.io")) {
  baseUrl = "/mini-diary";
}
let lastpage;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: KEY.firebaseKey,
  authDomain: "mini-diary-65ff3.firebaseapp.com",
  projectId: "mini-diary-65ff3",
  storageBucket: "mini-diary-65ff3.appspot.com",
  messagingSenderId: "407798731197",
  appId: "1:407798731197:web:130b483a33ace812bdc2d4",
  measurementId: "G-NZGRQDDVH2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDb = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});
const db = getFirestore(app);
const analytics = getAnalytics(app);

// 다이어리 목록을 불러오는 함수
async function FetchDiarys(nickname) {
  try {
    const diaryList = collection(db, "diaryList");
    const q = query(
      diaryList,
      where("auth", "==", nickname),
      orderBy("createdAt", "desc"),
      limit(4)
    );
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    return datas;
  } catch (error) {
    throw error;
  }
}

// 현재 페이지의 다이어리를 불러오는 함수
async function FetchDiary(id) {
  try {
    const diaryList = collection(db, "diaryList");
    const q = query(diaryList, where("id", "==", id));
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    return datas[0];
  } catch (error) {
    throw error;
  }
}

async function editDiary(id, title, contents) {
  try {
    const updateDiary = doc(db, `diaryList/${id}`);
    await updateDoc(updateDiary, { title, contents });
    alert("수정이 완료되었습니다.");
  } catch (error) {
    throw error;
  }
}

async function deleteDiary(id) {
  try {
    await deleteDoc(doc(db, `diaryList/${id}`));
  } catch (error) {
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
// 다이어리 추가 함수
async function writeDiary(newDiary) {
  try {
    const diaryList = collection(db, "diaryList");
    await setDoc(doc(diaryList, newDiary.id), {
      ...newDiary,
    });

    alert("등록이 완료되었습니다.");
  } catch (error) {
    throw error;
  }
}

// 이미지 업로드 함수
async function uploadFile(files) {
  const fileUrls = [];
  for (const file of files) {
    if (file) {
      const fileName = uuidv4() + "_" + file.name;
      const res = await uploadBytes(ref(stroage, `images/${fileName}`), file);
      const uploadfileUrl = await getDownloadURL(res.ref);
      fileUrls.push(uploadfileUrl);
    }
  }
  return fileUrls;
}

const auth = getAuth();

const FetchUserData = async (nickname) => {
  try {
    const userRef = collection(db, "user");
    const q = query(userRef, where("nickname", "==", nickname));
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    return datas[0];
  } catch (error) {
    throw error;
  }
};

// 유저 프로필 이미지 변경 함수
const UpdateProfileImg = async (url, userData) => {
  if (!auth.currentUser) return;
  await updateProfile(auth.currentUser, {
    photoURL: url,
  });
  const updateUser = doc(getFirestore(app), `user/${userData}`);
  await updateDoc(updateUser, { profileImgUrl: url });
};

export function checkLogin(nickname) {
  const userDocRef = doc(db, "user", nickname);
  // islogin이 바뀔때 마다 감지를 위해 실시간 데이터베이스 사용
  onSnapshot(userDocRef, async (doc) => {
    const data = doc.data();
    if (!data.islogin) {
      await signOut(auth);
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("diaryData");
      location.replace(`${baseUrl}/`);
    }
  });
}

const login = async (email, password) => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    // 로그인 유저 데이터를 불러와 세션스토리지에 저장하기 위해
    const userRef = collection(db, "user");
    const q = query(userRef, where("email", "==", email));
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    const userDocRef = doc(db, "user", datas[0].nickname);

    if (datas[0].islogin) {
      const login = confirm(
        "이미 로그인된 계정 입니다! 기존 계정을 로그아웃 하시겠습니까?"
      );
      if (login) {
        // 기존 로그인된 계정을 로그아웃 시킨다.
        await updateDoc(userDocRef, { islogin: false });
      } else {
        return;
      }
    }
    // 로그인이 확인 처리
    await updateDoc(userDocRef, { islogin: true });

    //불러온 데이터 세션 스토리지에 저장
    sessionStorage.setItem(
      "userData",
      JSON.stringify({
        nickname: datas[0].nickname,
        introduce: datas[0].introduce,
        profileImgURL: datas[0].profileImgUrl,
        fortune: datas[0].fortune,
      })
    );
    location.replace(`${baseUrl}/src/template/home.html`);
  } catch (error) {
    if (error.message.includes("auth/invalid-email")) {
      alert("유효하지 않은 이메일 형식 입니다!");
    } else if (error.message.includes("auth/user-not-found).")) {
      alert("일치 하는 로그인 정보가 없습니다!");
    } else {
      alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
      throw error;
    }
  }
};

const logout = async () => {
  if (confirm("정말 로그아웃 하시겠습니까?")) {
    try {
      // 채팅방에 입장했다는 알기 위해 url를 구해줌
      const url = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      // 현재 채팅창의 querystring Id값을 가져옴
      const chatRoomId = urlParams.get("id");
      const userDocRef = doc(db, "user", userData.nickname);
      // 로그아웃
      await signOut(auth);
      // 채팅방 퇴장 처리
      // 로그아웃시 만약 현재 url이 채팅방페이지 url에 있었다면 db에 채팅창에 유저 데이터를 지우고 퇴장처리한다.
      // 만약 이 분기점이 없다면 로그아웃마다 db에 유저데이터를 지우려고 하려는데 유저가 채팅방에 입장하지 않았기 때문에 채팅방 db에 해당유저 데이터가 없는데 지우려고 하기 때문에 오류가 발생한다.
      
      if (chatRoomId&&url.includes("chatting")) {
        // 현재 채팅방 번호를 구해줌
        // 채팅방 데이터를 구해줌
        const chatRoomRef = doc(db, `chatRoom/${chatRoomId}`);
        await updateDoc(chatRoomRef, {
          users: arrayRemove(userData.nickname), // users 배열에서 userNickname 제거
        });
      }

      // 유저 DB 로그아웃 변경
      // 위에 한번 다른 값으로 바꿔주지 않으면 이거 그냥 안바뀌고 그냥 넘어감
      await updateDoc(userDocRef, { islogin: true });
      await updateDoc(userDocRef, { islogin: false });
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("diaryData");
      location.replace("/");
    } catch (error) {
      alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
      throw error;
    }
  }
};

// 회원가입시 정보 중복검사를 처리하는 함수
// duplicationValue는 중복처리검사할 값, duplicationTarget 현재 비교할 DB에서의 key값
const duplication = async (duplicationValue, duplicationTarget) => {
  const userRef = collection(getFirestore(app), "user");
  const q = query(
    userRef,
    where(duplicationTarget, "==", duplicationValue.toLowerCase())
  );
  const res = await getDocs(q);
  const data = res.docs.map((el) => el.data());
  // 만약에 중복된 데이터가 존재한다면 data 배열에 값이 담겨서 length가 0보다 크므로
  if (data.length > 0) {
    return true;
  } else {
    return false;
  }
};

// sessionStorage에 저장된 user의 닉네임을 가져오기 위한 함수
const getSessionUser = () => {
  for (const key of Object.keys(sessionStorage)) {
    if (key.includes("firebase:authUser:")) {
      return JSON.parse(sessionStorage.getItem(key));
    }
  }
};

// 휴대폰 인증 로직
// auth.languageCode = "ko";
// const $btnAuth = document.getElementById("btn-authentication");
// window.recaptchaVerifier = new RecaptchaVerifier(
//   "btn-authentication",
//   {
//     size: "invisible",
//     callback: (response) => {
//       // reCAPTCHA solved, allow signInWithPhoneNumber.
//       onSignInSubmit();
//     },
//   },
//   auth
// );

// $btnAuth.addEventListener("click", () => {
//   const phoneNumber = document.querySelector("#input-phone").value;
//   const appVerifier = window.recaptchaVerifier;
//   signInWithPhoneNumber(auth, "+82" + phoneNumber, appVerifier)
//     .then((confirmationResult) => {
//       alert("인증코드가 발송되었습니다.");
//       // SMS sent. Prompt user to type the code from the message, then sign the
//       // user in with confirmationResult.confirm(code).
//       window.confirmationResult = confirmationResult;
//       console.log(confirmationResult)
//       // ...
//     })
//     .catch((error) => {
//       console.log(error)
//       // Error; SMS not sent
//       // ...
//     });
// });
// const $btnCode = document.getElementById("btn-code");
// $btnCode.addEventListener("click", ()=>{
//   const code = document.getElementById('input-code').value;
//   confirmationResult.confirm(code).then((result) => {
//     // User signed in successfully.
//     const user = result.user;
//     console.log(result);
//     alert('인증이 완료되었습니다.')
//     // ...
//   }).catch((error) => {
//     console.log(error);
//     // User couldn't sign in (bad verification code?)
//     // ...
//   });
// })

// 회원가입을 위한 함수
// 인자로 닉네임 이메일 비밀번호를 받는다.
// createUserWithEmailAndPassword 아이디를 생성하는 api 함수
// updateProfile 해당 유저의 프로필 정보를 업데이트해주는 함수 => 생성된 유저 정보를 반환해줌
// 여기서 사용된 이유는 현재 유저의 닉네임을 넣어주기 위해서 displayNmae이 설정할 닉네임이 된다.
const signup = async (nickname, email, phone, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, {
      displayName: nickname,
    });

    const user = collection(db, "user");
    await setDoc(doc(user, `${res.user.displayName ?? ""}`), {
      email: res.user.email,
      nickname: res.user.displayName,
      phone,
      profileImgFileName: "",
      profileImgUrl: "",
      fortune: "",
      gameRecord: null,
      introduce: "소개글을 작성하지 않았습니다.",
    });

    alert("회원가입이 완료되었습니다.");
    location.replace(`${baseUrl}/`);
  } catch (error) {
    if (error.message.includes("email-already-in-use")) {
      prompt("이미 사용중인 이메일 입니다!");
    } else {
      alert("알 수 없는 에러가 발생하였습니다. 잠시후 다시 시도해 주세요.");
    }
    throw error;
  }
};

const setGameRecord = async (nickname, newRecord) => {
  const updateUser = doc(db, `user/${nickname}`);
  await updateDoc(updateUser, { gameRecord: newRecord });
};
const setFortune = async (nickname, fortune) => {
  const updateUser = doc(db, `user/${nickname}`);
  await updateDoc(updateUser, { fortune: fortune });
};

const findEmail = async (nickname, phone) => {
  const userRef = collection(db, "user");
  const q = query(
    userRef,
    where("nickname", "==", nickname),
    where("phone", "==", phone)
  );
  const res = await getDocs(q);
  const datas = res.docs.map((el) => el.data());
  if (datas.length > 0) return datas[0].email;
  else {
    alert("일치하는 정보가 없습니다!");
    return false;
  }
};

const changePassword = async (email, phone) => {
  const userRef = collection(db, "user");
  const q = query(
    userRef,
    where("email", "==", email),
    where("phone", "==", phone)
  );
  const res = await getDocs(q);
  const datas = res.docs.map((el) => el.data());
  if (datas.length > 0) {
    sendPasswordResetEmail(auth, email)
      .then(() => {})
      .catch((error) => {
        throw error;
      });
    return true;
  } else {
    alert("일치하는 정보가 없습니다!");
    return false;
  }
};

const joinChatRoom = async (chatRoomId, userNickname, rednerJoinUsers) => {
  const chatRoomRef = doc(db, "chatRoom", chatRoomId);

  // chatRoomRef의 users 필드 업데이트
  await updateDoc(chatRoomRef, {
    users: arrayUnion(userNickname), // users 배열에 userNickname 추가
  });

  // Firestore 실시간 업데이트를 위한 onSnapshot 등록
  onSnapshot(chatRoomRef, async (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      // if (data.users.length <= 0) {
      //   console.log("인원수 없음");
      //   await deleteDoc(doc(db,"chatRoom","a11d2366-b828-44b1-aa26-776f1e3e25f8"));
      // }
      rednerJoinUsers(data);
    
    } else {
      console.log("문서가 존재하지 않습니다.");
    }
  });

  // 채팅방에서 나갈 때
  window.addEventListener("beforeunload", async () => {
    try {
      await updateDoc(chatRoomRef, {
        users: arrayRemove(userNickname), // users 배열에서 userNickname 제거
      });

    } catch (error) {
      console.log("Error occurred while updating users:", error);
    }
  });
};

function fetchChatting (
  $chattingBox,
  $loadingModal,
  chatRoomId,
  renderChattingMsg
) {
  const chatRef = collection(db, `chat${chatRoomId}`);
  const q = query(chatRef, orderBy("createdAt", "asc"));
  let prevDate = null; // 이전 메시지의 작성 날짜를 저장할 변수
  $loadingModal.classList.add("active");
  onSnapshot(q, (querySnapshot) => {
    $chattingBox.innerHTML = ""; // 채팅 리스트 초기화
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const currentDate = new Date(data.createdAt);
      renderChattingMsg(data, prevDate, currentDate);
    });
    $loadingModal.classList.remove("active");
    $chattingBox.scrollTop = $chattingBox.scrollHeight;
  });
};


async function createChattingRoom({ id, title, limit, isprivate, password, createdAt }) {
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

async function renderChattingRoom($roomLists, $loadingModal){
  const chatRoomRef = collection(db, "chatRoom");
  const q = query(chatRoomRef,orderBy("createdAt","desc"))
  $loadingModal.classList.add("active")
   onSnapshot(q, (snapshot) => {
    while ($roomLists.firstChild) { // 리스트 초기화
      $roomLists.removeChild($roomLists.firstChild);
    }
    snapshot.docs.forEach((doc) => {
      const item = doc.data();

      const roomLi = document.createElement("li");
      roomLi.className = "room";

      const roomLink = document.createElement("a");
      roomLink.href = `${baseUrl}/src/template/chatting.html?id=${doc.id}`;
    

      const roomTitle = document.createElement("h3");
      roomTitle.textContent = item.title;

      const userCount = document.createElement("span");
      userCount.className = "user-count";
      userCount.textContent = `현재참여인원 ${item.users.length}/${item.limit}`;

      roomLink.appendChild(roomTitle);
      roomLink.appendChild(userCount);
      roomLi.appendChild(roomLink);
      $roomLists.appendChild(roomLi);



      roomLink.addEventListener("click", async (e)=>{
        if(item.users.length >= item.limit){
          e.preventDefault();
          alert("입장가능한 인원수가 모두 찼습니다!");
          return;
        }
        if(item.isprivate){
          const password = prompt('비밀번호를 입력해주세요.');
          if(password===item.password){
            location.href = `${baseUrl}/src/template/chatting.html?id=${doc.id}`
          }
          else{
            e.preventDefault();
            alert("비밀번호가 일치하지 않습니다.");
            return;
          }
        }
        else{
          location.href =`${baseUrl}/src/template/chatting.html?id=${doc.id}`
        }
      })
    });

    $loadingModal.classList.remove("active");
  });
}

async function addChatting(chatRoomId, newChat) {
  const chatRef = collection(db, "chat"+chatRoomId);
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
    console.error(error);
  }
}



export {
  FetchDiarys,
  FetchDiary,
  FetchUserData,
  uploadFile,
  signup,
  login,
  logout,
  getSessionUser,
  duplication,
  writeDiary,
  setGameRecord,
  setFortune,
  findEmail,
  changePassword,
  editDiary,
  deleteDiary,
  fetchChatting,
  addChatting,
  joinChatRoom,
  deleteChat,
  createChattingRoom,
  renderChattingRoom,
  setDoc,
  getDoc,
  doc,
  collection,
  db,
  app,
  query,
  orderBy,
  onSnapshot,
};
