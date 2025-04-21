// fetchEvent.js

// This script is a function that gets all event information from the firebase database.

// Imports
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

export async function getAllEvents() {
  // Create a reference to the events collection
  const eventsRef = collection(db, "events");
  

  // Attempt to get results
  try {
    const querySnapshot = await getDocs(eventsRef);
    
    if (querySnapshot.empty) {
      console.warn("[Firebase] No events found in database");
      return null;
    }

    const events = querySnapshot.docs.map(doc => {
      console.log(`[Firebase] Processing event: ${doc.id}`);
      return doc.data();
    });

    return events;
  } catch (error) {
    console.error("[Firebase] Error fetching events:", error);
    return null;
  }
}