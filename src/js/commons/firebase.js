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
  startAfter,
  endAt,
  limit,
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
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

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
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});
const db = getFirestore(app);
const analytics = getAnalytics(app);



// 다이어리 목록을 불러오는 함수
async function FetchDiarys(nickname) {
  const diaryList = collection(db, "diaryList");
  const q =  query(diaryList, where("auth","==", nickname), limit(4));
  const res = await getDocs(q);
  const datas =  res.docs.map((el) => el.data());
  return datas;
}

async function nextDiaryList(nickname, start) {
  const diaryList = collection(db, "diaryList");
  const q =  query(diaryList, where("auth","==", nickname), orderBy("createdAt"),startAfter(start), limit(4));
  const res = await getDocs(q);
  const datas =  res.docs.map((el) => el.data());
  console.log(datas);
  return datas;
}
// 현재 페이지의 다이어리를 불러오는 함수
async function FetchDiary(nickname, id) {
  const diaryList = collection(db, "diaryList");
  const q =  query(diaryList, where("auth","==", nickname), where("id","==",id));
  const res = await getDocs(q);
  const datas =  res.docs.map((el) => el.data());
  return datas[0];
}

// 다이어리 추가 함수
async function writeDiary(newDiary) {
  const diaryList = collection(db, "diaryList")
  const res = await addDoc(diaryList, {
    ...newDiary
  })
  alert("등록이 완료도었습니다.");
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

const FetchUserData = async(nickname) => {
  const userRef = collection(db, "user");
  const q = query(userRef, where("nickname", "==", nickname));
  const res = await getDocs(q);
  const datas = await res.docs.map((el) => el.data());
  sessionStorage.setItem('userData',JSON.stringify(datas[0]));
}

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
    await signInWithEmailAndPassword(auth, email, password).then(async (res)=>{
      console.log(res);
      await FetchUserData(res.user.displayName);
    });
    
  } catch (error) {
    alert("일치하는 로그인 정보가 없습니다!");
  }
};

// 회원가입시 정보 중복검사를 처리하는 함수
// duplicationValue는 중복처리검사할 값, duplicationTarget 현재 비교할 DB에서의 key값
const duplication = async (duplicationValue , duplicationTarget) => {
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
const sessionUserData = () => {
  for (const key of Object.keys(sessionStorage)) {
    if (key.includes("firebase:authUser:")) {
      return sessionStorage.getItem(key);
    }
  }
};

// 회원가입을 위한 함수
// 인자로 닉네임 이메일 비밀번호를 받는다.
// createUserWithEmailAndPassword 아이디를 생성하는 api 함수
// updateProfile 해당 유저의 프로필 정보를 업데이트해주는 함수 => 생성된 유저 정보를 반환해줌
// 여기서 사용된 이유는 현재 유저의 닉네임을 넣어주기 위해서 displayNmae이 설정할 닉네임이 된다.
const signup = async (nickname, email, password) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (res) => {
      await updateProfile(res.user, {
        displayName: nickname,
      });
      // 계정이 생성된 후 계정정보를 DB에 기록해줌
      const user = await collection(getFirestore(app), "user");
      await setDoc(doc(user, `${res.user.displayName ?? ""}`), {
        email: res.user.email,
        nickname: res.user.displayName,
        profileImgFileName: "",
        profileImgUrl: "",
        diary: [],
        fortune:'',
        gameRecord: null,
        introduce: "소개글이 없습니다.",
      });
      alert("회원가입이 완료되었습니다.");
      location.replace('/');
    })
    .catch((error) => {
      if (error.message.includes("email-already-in-use")) {
        alert("이미 사용중인 이메일 입니다!");
      }
      else{
        console.log(error)
        alert("알 수 없는 에러가 발생하였습니다. 잠시후 다시 시도해 주세요.")
      }
    });
};
export {
  FetchDiarys,
  FetchDiary,
  uploadFile,
  signup,
  login,
  sessionUserData,
  duplication,
  writeDiary,
  nextDiaryList
};
