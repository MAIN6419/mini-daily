import {
  arrayRemove,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  getDoc,
  increment,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import {
  ref as storageRef,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { db,  storage } from "../setting/firebase_setting.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { getKST } from "../../commons/libray.js";
import { getSessionUser } from "../auth/firebase_auth.js";
const userData = getSessionUser();

async function writeDiary(newDiary) {
  try {
    const userRef = doc(db, "user", userData.displayName);
    let userDoc = await getDoc(userRef);
    let data = userDoc.data();
    let maxDiaryPoint = data.maxDiaryPoint;
    const resetDiaryPoint =
      new Date(data.lastDiaryDate).getFullYear() !== getKST().getFullYear() &&
      new Date(data.lastDiaryDate).getMonth() !== getKST().getMonth() &&
      new Date(data.lastDiaryDate).getDate() !== getKST().getDate();

    // data.lastDiaryDate && 추가한 이유는 삭제시 lastDiaryDate null로 초기화 하기 때문
    // null값이면 삭제로 간주하여 maxDiaryPoint를 초기화 하지 않음
    // 하루가 지났을 경우에만 maxDiaryPoint를 초기화
    if (data.lastDiaryDate && resetDiaryPoint) {
      await updateDoc(userRef, {
        maxDiaryPoint: 0,
      });
      userDoc = await getDoc(userRef);
      data = userDoc.data();
      maxDiaryPoint = data.maxDiaryPoint;
    }

    // 다이어리 작성일자와 현재일이 같다면 다이어리 작성을 막음
    else if (!resetDiaryPoint) {
      alert("이미 오늘의 다이어리를 작성하였습니다!");
      return;
    }

    const diaryList = collection(db, "diaryList");
    await setDoc(doc(diaryList, newDiary.id), {
      ...newDiary,
    });
    await updateDoc(userRef, {
      diaryCount: increment(1),
      point: maxDiaryPoint !== 3 ? increment(3) : increment(0),
      lastDiaryDate: getKST().getTime(),
      maxDiaryPoint: 3,
    });
    alert("등록이 완료되었습니다.");
    location.href = `diary.html?id=${newDiary.id}`;
  } catch (error) {
    throw error;
  }
}
// 다이어리 이미지 업로드 함수
async function uploadFile(files) {
  try {
    const fileInfo = { url: [], fileName: [] };
    for (const file of files) {
      if (file) {
        const fileName = uuidv4() + "_" + file.name;
        const res = await uploadBytes(
          storageRef(storage, `images/diary/${fileName}`),
          file
        );
        const uploadfileUrl = await getDownloadURL(res.ref);
        fileInfo.url.push(uploadfileUrl);
        fileInfo.fileName.push(fileName);
      }
    }
    return fileInfo;
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
}

// 최신 다이어리 목록 4개를 불러오는 함수
async function fetchRecentDiary() {
  try {
    const diaryList = collection(db, "diaryList");
    const q = query(diaryList, limit(4));
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    return datas;
  } catch (error) {
    throw error;
  }
}

// 다이어리 전체를 불러오는 함수
async function fetchAllDiarys() {
  try {
    const diaryList = collection(db, "diaryList");
    const res = await getDocs(diaryList);
    const datas = res.docs.map((el) => el.data());
    return datas;
  } catch (error) {
    throw error;
  }
}

// 다이어리 목록 중 공감 수가 많은 4개의 다이어리를 불러오는 함수
async function fetchBestDiarys() {
  try {
    const diaryList = collection(db, "diaryList");
    const q = query(diaryList, orderBy("empathy", "desc"), limit(3));
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

async function editDiary(id, { title, contents, imgURL, imgFileName }) {
  try {
    const updateDiary = doc(db, `diaryList/${id}`);
    await updateDoc(updateDiary, { title, contents, imgURL, imgFileName });
    alert("수정이 완료되었습니다.");
  } catch (error) {
    throw error;
  }
}

async function deleteDiary(id) {
  try {
    const diary = await FetchDiary(id);
    if (diary.imgFileName.length) {
      for (let i = 0; i < diary.imgFileName.length; i++) {
        await deleteObject(
          storageRef(storage, `images/diary/${String(diary.imgFileName[i])}`)
        );
      }
    }
    // 삭제되는 게시글의 공감 버튼을 누른 유저의 공감목록에서 삭제
    const userCollection = collection(db, "user");
    const querySnapshot = await getDocs(userCollection);
    // 비동기 처리를 위해 for of문을 사용
    for (const docs of querySnapshot.docs) {
      await updateDoc(doc(db, "user", docs.id), {
        empathyList: arrayRemove(id),
      });
    }
    const diaryRef = doc(db, `diaryList/${id}`);
    const diaryDoc = await getDoc(diaryRef);
    const data = diaryDoc.data();
    if (new Date(data.createdAt).getDate() === new Date().getDate()) {
      await updateDoc(doc(db, "user", userData.displayName), {
        lastDiaryDate: null,
      });
    }
    await deleteDoc(diaryRef);

    await updateDoc(doc(db, "user", userData.displayName), {
      diaryCount: increment(-1),
    });
  } catch (error) {
    throw error;
  }
}

export {
  writeDiary,
  uploadFile,
  fetchRecentDiary,
  fetchAllDiarys,
  fetchBestDiarys,
  FetchDiary,
  editDiary,
  deleteDiary,
};
