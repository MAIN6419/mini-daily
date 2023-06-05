import {
  arrayRemove,
  arrayUnion,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  limit,
  getDoc,
  increment,
} from "firebase/firestore";
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../setting/firebase_setting.js";
import { v4 as uuidv4 } from "uuid";
import { getKST } from "../../commons/libray.js";
import { currentUser } from "../auth/firebase_auth.js";

async function writeDiary(newDiary) {
  try {
    const userRef = doc(db, "user", currentUser.displayName);
    let userDoc = await getDoc(userRef);
    let data = userDoc.data();
    let maxDiaryPoint = data.maxDiaryPoint;
    const resetDiaryPoint =
      new Date(data.lastDiaryDate).getFullYear() !== getKST().getFullYear() ||
      new Date(data.lastDiaryDate).getMonth() !== getKST().getMonth() ||
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
    const uploadPromises = files.map((file) => {
      if (file) {
        const fileName = uuidv4() + "_" + file.name;
        const uploadTask = uploadBytes(
          storageRef(storage, `images/diary/${fileName}`),
          file
        );
        return uploadTask.then(async (res) => {
          const uploadfileUrl = await getDownloadURL(res.ref);
          return { url: uploadfileUrl, fileName: fileName };
        });
      }
    });

    const fileInfoArray = await Promise.all(uploadPromises);
    const fileInfo = {
      url: [],
      fileName: [],
    };

    fileInfoArray.forEach((file) => {
      if (file) {
        fileInfo.url.push(file.url);
        fileInfo.fileName.push(file.fileName);
      }
    });

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
    const q = query(diaryList, orderBy("createdAt", "desc"), limit(4));
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
    const q = query(diaryList, orderBy("empathy", "desc"), limit(4));
    const res = await getDocs(q);
    const datas = res.docs.map((el) => el.data());
    return datas;
  } catch (error) {
    throw error;
  }
}

async function fetchEmpathyDiarys(nickname) {
  const userRef = doc(db, `user/${nickname}`);
  const res = await getDoc(userRef);
  const empathyList = res.data().empathyList;
  const diaryListRef = collection(db, "diaryList");
  const empathyDataPromises = empathyList.map((el) => {
    const q = query(diaryListRef, where("id", "==", el));
    return getDocs(q)
      .then((querySnapshot) => querySnapshot.docs.map((el) => el.data())[0]);
  });
  
  const empathyData = await Promise.all(empathyDataPromises);
  return empathyData;
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

async function editDiary(id, newData) {
  try {
    const updateDiary = doc(db, `diaryList/${id}`);
    await updateDoc(updateDiary, { ...newData });
    alert("수정이 완료되었습니다.");
  } catch (error) {
    throw error;
  }
}

async function deleteDiary(id) {
  try {
    const diary = await FetchDiary(id);
    const deleteImagePromises = diary.imgFileName.map((fileName) => {
      return deleteObject(storageRef(storage, `images/diary/${String(fileName)}`));
    });

    const deleteUserPromises = [];
    const userCollection = collection(db, "user");
    const querySnapshot = await getDocs(userCollection);
    querySnapshot.docs.forEach((doc_) => {
      const promise = updateDoc(doc(db, "user", doc_.id), {
        empathyList: arrayRemove(id),
      });
      deleteUserPromises.push(promise);
    });

    const deleteCommentPromises = [];
    const commentRef = collection(db, "comment");
    const commentQuery = query(commentRef, where("diaryId", "==", id));
    const commentDocs = await getDocs(commentQuery);
    commentDocs.docs.forEach((doc_) => {
      const promise = deleteDoc(doc_.ref);
      deleteCommentPromises.push(promise);
    });

    const diaryRef = doc(db, `diaryList/${id}`);
    const diaryDoc = await getDoc(diaryRef);
    const data = diaryDoc.data();
    if (new Date(data.createdAt).getDate() === new Date().getDate()) {
      await updateDoc(doc(db, "user", currentUser.displayName), {
        lastDiaryDate: null,
      });
    }

    const deleteDiaryPromise = deleteDoc(diaryRef);
    const updateDiaryCountPromise = updateDoc(doc(db, "user", currentUser.displayName), {
      diaryCount: increment(-1),
    });

    await Promise.all([
      ...deleteImagePromises,
      ...deleteUserPromises,
      ...deleteCommentPromises,
      deleteDiaryPromise,
      updateDiaryCountPromise,
    ]);
  } catch (error) {
    throw error;
  }
}


async function deleteEditDiaryImg(filename) {
  // 빈배열이 올 수 있기 때문에 filename이 있는 경우에만 이미지 삭제 처리
  try {
    if (filename) {
      await deleteObject(
        storageRef(storage, `images/diary/${String(filename)}`)
      );
    }
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    throw error;
  }
}

async function updateEmpathy(id, count, auth) {
  try {
    const diary = doc(db, `diaryList/${id}`);
    if (!diary) return;
    const userRef = doc(db, `user/${currentUser.displayName}`);
    const authRef = doc(db, `user/${auth}`);
    await updateDoc(diary, { empathy: increment(count) });
    if (count > 0) {
      await updateDoc(userRef, { empathyList: arrayUnion(id) });
      await updateDoc(authRef, { point: increment(1) });
    } else {
      await updateDoc(userRef, { empathyList: arrayRemove(id) });
      await updateDoc(authRef, { point: increment(-1) });
    }
  } catch (error) {
    alert("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
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
  deleteEditDiaryImg,
  updateEmpathy,
  fetchEmpathyDiarys,
};
