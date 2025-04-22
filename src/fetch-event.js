import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

export async function getEventByTitle(eventTitle) {
  const events = collection(db, "events");
  const qry = query(events, where("eventName", "==", eventTitle));

  try {
    const querySnapshot = await getDocs(qry);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function getAllEvents() {
  const eventsCollection = collection(db, "events");
  
  try {
    const querySnapshot = await getDocs(eventsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
}