// fetchEvent.js
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
    if (querySnapshot.empty) {
      console.warn(`No event found with eventName ${eventTitle}`);
      return null;
    }
    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error("Error from getEventByTitle:", error);
    return null;
  }
}

export async function getEvents() {
  const events = collection(db, "events");
  try {
    const querySnapshot = await getDocs(events);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}