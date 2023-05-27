import {
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { db } from "../setting/firebase_setting.js";

export const setFortune = async (nickname, fortune) => {
  const updateUser = doc(db, `user/${nickname}`);
  await updateDoc(updateUser, { fortune: fortune });
};
