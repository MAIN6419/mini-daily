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

async function deleteChat(id) {
  try {
    await updateDoc(doc(db, `chat/${id}`), {
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

const login = async (email, password) => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    const userRef = collection(db, "user");
    const q = query(userRef, where("email", "==", email));
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
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
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("userData");
        sessionStorage.removeItem("diaryData");
        location.replace(`${baseUrl}/`);
      })
      .catch((error) => {
        alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
        throw error;
      });
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
      phone: phone,
      profileImgFileName: "",
      profileImgUrl: "",
      diary: [],
      fortune: "",
      gameRecord: null,
      introduce: "소개글을 작성하지 않았습니다.",
    });

    alert("회원가입이 완료되었습니다.");
    location.replace(`${baseUrl}/`);
  } catch (error) {
    if (error.message.includes("email-already-in-use")) {
      alert("이미 사용중인 이메일 입니다!");
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

const chatRef = collection(db, "chat");
const q = query(chatRef, orderBy("createdAt", "asc"));

const setChattingMsg = (data, lastDate, $chattingBox) => {
  const currentDate = new Date();
  if (currentDate.getDate() === lastDate.getDate()) {
    const today = document.createElement("time");
    today.classList.add("createdAt");
    today.innerText = getCreatedAt(currentDate.getTime());
    today.setAttribute(
      "datetime",
      new Date(currentDate.getTime()).toISOString()
    );
    $chattingBox.append(today);
  }

  const messageBox = document.createElement("div");
  messageBox.classList.add("message-box");

  const messageImg = document.createElement("img");
  messageImg.classList.add("message-img");
  messageImg.src = "../img/profile.png";
  messageImg.alt = "유저 프로필";

  const userName = document.createElement("span");
  userName.classList.add("user-name");
  userName.innerText = data.user;

  const message = document.createElement("p");
  message.classList.add("message");
  message.innerText = data.message;

  const createdAt = document.createElement("time");
  createdAt.classList.add("createdAt");
  createdAt.innerText = getCreatedAt(data.createdAt).slice(11);
  createdAt.setAttribute("datetime", new Date(data.createdAt).toISOString());
  const delBtn = document.createElement("button");
  delBtn.classList.add("btn-del");
  delBtn.innerText = "X";
  delBtn.addEventListener("click", async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteChat(data.id);
    }
  });
  // 작성자가 나인 경우
  if (data.user === userData.nickname) {
    messageBox.classList.add("sent");
  } else {
    // 작성자가 다른 경우
    messageBox.classList.add("received");
  }

  // 메시지 박스에 새로운 요소들 추가
  messageBox.appendChild(messageImg);
  messageBox.appendChild(userName);
  messageBox.appendChild(message);
  messageBox.appendChild(createdAt);
  if (data.user === userData.nickname && data.type !== "delete") {
    messageBox.appendChild(delBtn);
  }

  // 채팅 리스트에 메시지 박스 추가
  $chattingBox.appendChild(messageBox);
};

const fetchChatting = ($chattingBox, $loadingModal) => {
  let prevDate = null; // 이전 메시지의 작성 날짜를 저장할 변수
  $loadingModal.classList.add("active");
  onSnapshot(q, (querySnapshot) => {
    $chattingBox.innerHTML = ""; // 채팅 리스트 초기화
    querySnapshot.forEach((doc, index) => {
      const data = doc.data();
      // 작성 날짜를 Date 객체로 변환
      const currentDate = new Date(data.createdAt);

      // 날짜가 달라졌을 때 새로운 날짜를 삽입
      if (!prevDate || prevDate.getDate() !== currentDate.getDate()) {
        const dateBox = document.createElement("div");
        dateBox.classList.add("date-box");

        const dateText = document.createElement("span");
        dateText.classList.add("date-text");
        dateText.innerText = `${currentDate.getFullYear()}년 ${
          currentDate.getMonth() + 1
        }월 ${currentDate.getDate()}일 ${['일','월','화','수','목','금','토'][currentDate.getDay()]+'요일'}`;
        dateBox.appendChild(dateText);

        $chattingBox.appendChild(dateBox);
        prevDate = currentDate;
      }
      // 채팅 리스트에 새로운 메시지 추가
      const messageBox = document.createElement("div");
      messageBox.classList.add("message-box");

      const messageImg = document.createElement("img");
      messageImg.classList.add("message-img");
      messageImg.src = "../img/profile.png";
      messageImg.alt = "유저 프로필";

      const userName = document.createElement("span");
      userName.classList.add("user-name");
      userName.innerText = data.user;

      const message = document.createElement("p");
      message.classList.add("message");
      message.innerText = data.message;

      const createdAt = document.createElement("time");
      createdAt.classList.add("createdAt");
      createdAt.innerText = getCreatedAt(data.createdAt).slice(11);
      createdAt.setAttribute(
        "datetime",
        new Date(data.createdAt).toISOString()
      );
      const delBtn = document.createElement("button");
      delBtn.classList.add("btn-del");
      delBtn.innerText = "X";
      delBtn.addEventListener("click", async () => {
        if (confirm("정말 삭제하시겠습니까?")) {
          deleteChat(data.id);
        }
      });
      // 작성자가 나인 경우
      if (data.user === userData.nickname) {
        messageBox.classList.add("sent");
      } else {
        // 작성자가 다른 경우
        messageBox.classList.add("received");
      }

      // 메시지 박스에 새로운 요소들 추가
      messageBox.appendChild(messageImg);
      messageBox.appendChild(userName);
      messageBox.appendChild(message);
      messageBox.appendChild(createdAt);
      if (data.user === userData.nickname && data.type !== "delete") {
        messageBox.appendChild(delBtn);
      }

      // 채팅 리스트에 메시지 박스 추가
      $chattingBox.appendChild(messageBox);
      prevDate = currentDate; // 이전 메시지의 작성 날짜 갱신
    });
    $loadingModal.classList.remove("active");
    $chattingBox.scrollTop = $chattingBox.scrollHeight;
  });
};

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
  setDoc,
  doc,
  chatRef,
  db,
};
