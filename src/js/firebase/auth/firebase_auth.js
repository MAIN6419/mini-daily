import {v4 as uuidv4} from 'uuid';
import {
  arrayRemove,
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";
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
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { db, storage } from "../setting/firebase_setting.js";


const userData = JSON.parse(sessionStorage.getItem("userData"));
const auth = getAuth();
let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("유저상태 변경");
    // await updateDoc(userDocRef, { islogin: false });
  } else {
    currentUser = user;
  }
});



// 유저 정보를 가져오는 함수
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

// 로그인을 체크하는 함수
async function checkLogin(nickname) {
  try {
    const userDocRef = doc(db, "user", nickname);
    // islogin이 바뀔때 마다 감지를 위해 실시간 데이터베이스 사용
    onSnapshot(userDocRef, async (doc) => {
      const data = doc.data();
      if (!data.islogin) {
        await signOut(auth);
        sessionStorage.removeItem("userData");
        sessionStorage.removeItem("diaryData");
        location.replace('/');
      }
      if (data.point >= 100 && data.grade === "일반") {
        await updateDoc(doc.ref, { grade: "우수" });
        alert("축하합니다! 우수 등급으로 등업되었습니다!");
      } else if (data.point >= 500 && data.grade === "우수") {
        await updateDoc(doc.ref, { grade: "프로" });
        alert("축하합니다! 프로 등급으로 등업되었습니다!");
      } else if (data.point >= 1000 && data.grade === "프로") {
        alert("축하합니다! VIP 등급으로 등업되었습니다!");
      }
    });
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
}

// 로그인 함수
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
    location.replace(`home.html`);
  } catch (error) {
    if (error.message.includes("auth/invalid-email")) {
      alert("유효하지 않은 이메일 형식 입니다!");
    } else if (error.message.includes("auth/user-not-found")) {
      alert("일치 하는 로그인 정보가 없습니다!");
      return;
    } else if (error.message.includes("auth/wrong-password")) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    } else if (error.message.includes("auth/too-many-requests")) {
      alert("많은 로그인 시도로 인해 로그인이 일시적으로 제한됩니다! ");
    } else {
      alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
      throw error;
    }
  }
};

// 로그아웃 함수
const logout = async () => {
  if (confirm("정말 로그아웃 하시겠습니까?")) {
    try {
      // 채팅방에 입장했다는 알기 위해 url를 구해줌
      const url = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      // 현재 채팅창의 querystring Id값을 가져옴
      const chatRoomId = urlParams.get("id");
      const userDocRef = doc(db, "user", currentUser.displayName);
      // 로그아웃
      await signOut(auth);
      // 채팅방 퇴장 처리
      // 로그아웃시 만약 현재 url이 채팅방페이지 url에 있었다면 db에 채팅창에 유저 데이터를 지우고 퇴장처리한다.
      // 만약 이 분기점이 없다면 로그아웃마다 db에 유저데이터를 지우려고 하려는데 유저가 채팅방에 입장하지 않았기 때문에 채팅방 db에 해당유저 데이터가 없는데 지우려고 하기 때문에 오류가 발생한다.

      if (chatRoomId && url.includes("chatting")) {
        // 현재 채팅방 번호를 구해줌
        // 채팅방 데이터를 구해줌
        const chatRoomRef = doc(db, `chatRoom/${chatRoomId}`);
        await updateDoc(chatRoomRef, {
          users: arrayRemove(currentUser.displayName), // users 배열에서 userNickname 제거
        });
      }

      // 유저 DB 로그아웃 변경
      // 위에 한번 다른 값으로 바꿔주지 않으면 이거 그냥 안바뀌고 그냥 넘어감
      await updateDoc(userDocRef, { islogin: true });
      await updateDoc(userDocRef, { islogin: false });
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
  const userRef = collection(db, "user");
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

// 로그인한 유저 비밀번호 변경 함수
async function changeUserPassword(currentPassword, newPassword) {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    // 현재 사용자의 정보를 확인하는 메서드
    // => 이것을 이용하여 현재 로그인한 유저의 비밀번화 일치하는지 판별해서
    // 일치하지 않는다면 오류가 발생하는데 이것을 예외처리해서
    // 비밀번호가 일치하지 않는다는 것을 판별
    await reauthenticateWithCredential(user, credential);
    if (currentPassword === newPassword) {
      alert("현재 비밀번호와 새 비밀번호가 같습니다!");
      return false;
    }
    await updatePassword(auth.currentUser, newPassword);
    alert("비밀번호가 변경되었습니다.");
  } catch (error) {
    if (error.message.includes("auth/wrong-password")) {
      alert("현재 비밀번호가 일치하지 않습니다!");
      return;
    } else {
      throw error;
    }
  }
}

// sessionStorage에 저장된 user정보를 가져옴
function getSessionUser() {
  for (const key of Object.keys(sessionStorage)) {
    if (key.includes("firebase:authUser:")) {
      return JSON.parse(sessionStorage.getItem(key));
    }
  }
}

// 회원가입을 위한 함수
// 인자로 닉네임 이메일 비밀번호를 받는다.
// createUserWithEmailAndPassword 아이디를 생성하는 api 함수
// updateProfile 해당 유저의 프로필 정보를 업데이트해주는 함수 => 생성된 유저 정보를 반환해줌
// 여기서 사용된 이유는 현재 유저의 닉네임을 넣어주기 위해서 displayNmae이 설정할 닉네임이 된다.
const signup = async ({ nickname, email, phone, password }) => {
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
      introduce: "소개글을 작성하지 않았습니다.",
      point: 0,
      commentCount: 0,
      diaryCount: 0,
      grade: "일반",
      empathyList: [],
      lastCommentData: null,
      lastDiaryData: null,
      maxCommentPoint: 0,
      maxDiaryPoint: 0,
    });

    alert("회원가입이 완료되었습니다.");
    location.replace('/');
  } catch (error) {
    if (error.message.includes("email-already-in-use")) {
      alert("이미 사용중인 이메일 입니다!");
    } else {
      alert("알 수 없는 에러가 발생하였습니다. 잠시후 다시 시도해 주세요.");
    }
    throw error;
  }
};

// 이메일 찾기 함수
const findEmail = async (nickname, phone) => {
  try {
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
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시후 다시 시도해 주세요.");
    throw error;
  }
};

// 로그인 하지 않은 유저 비밀번호 변경함수 => 비밀번호를 찾을 시
const changePassword = async (email, phone) => {
  try {
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
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시후 다시 시도해 주세요.");
    throw error;
  }
};

// 자기소개 변경 함수
async function editIntroduce(introduce) {
  try {
    const userRef = doc(db, `user/${currentUser.displayName}`);
    await updateDoc(userRef, { introduce });
  } catch (error) {
    alert("알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
}

// 유저 이미지 Url를 가져오는 함수
async function getAuthImg(auth) {
  const userRef = doc(db, "user", auth);
  const res = await getDoc(userRef);
  const datas = res.data();
  return datas.profileImgUrl;
}

// 유저 프로필 이미지 변경 함수
const updateProfileImg = async (url) => {
  try {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      photoURL: url,
    });
    const updateUser = doc(db, `user/${currentUser.displayName}`);
    await updateDoc(updateUser, { profileImgUrl: url });
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
};

// 유저 프로필 변경 적용 함수
const applyProfileImg = async (file) => {
  if (file) {
    try {
      const fileName = `${uuidv4()}_${file.name}`;
      const res = await uploadBytes(
        storageRef(storage, `images/profile/${fileName}`),
        file
      );
      const uploadfileUrl = await getDownloadURL(res.ref);
      await updateProfileImg(uploadfileUrl);
      const user = await FetchUserData(currentUser.displayName);
      if (user.profileImgFileName) {
        await deleteObject(
          storageRef(
            storage,
            `images/profile/${String(user.profileImgFileName)}`
          )
        );
      }

      const updateUser = doc(db, `user/${currentUser.displayName}`);
      await updateDoc(updateUser, { profileImgFileName: fileName });
      userData.profileImgURL = uploadfileUrl;
      sessionStorage.setItem("userData", JSON.stringify(userData));
      location.reload();
      alert("프로필 이미지가 변경되었습니다.");
    } catch (error) {
      alert("알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
      throw error;
    }
  }
};

export {
  FetchUserData,
  updateProfileImg,
  checkLogin,
  login,
  logout,
  duplication,
  changeUserPassword,
  getSessionUser,
  signup,
  findEmail,
  changePassword,
  editIntroduce,
  applyProfileImg,
  getAuthImg,
  currentUser,
};
