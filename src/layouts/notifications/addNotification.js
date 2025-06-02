import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const addNotification = async (username, type, message) => {
  try {
    await addDoc(collection(db, "notifications"), {
      username,
      type,
      message,
      date: Timestamp.now(),
    });
  } catch (error) {
    console.error("Bildirim eklenemedi:", error);
  }
};

export default addNotification;
