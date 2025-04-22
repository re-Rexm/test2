// fetch-event.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

export async function getAllEvents() {
  const events = collection(db, "events");
  
  try {
    const querySnapshot = await getDocs(events);
    const eventsList = [];
    
    querySnapshot.forEach((doc) => {
      eventsList.push(doc.data());
    });

    return eventsList;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}