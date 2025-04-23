import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Helper function to process Firestore document
const processEventDoc = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    eventName: data.eventName || "Unnamed Event",
    eventBldg: data.eventBldg || "Location not specified",
    eventRm: data.eventRm || "Room not specified",
    eventTime: data.eventTime || new Date(), // Fallback to current time
    eventGeo: {
      latitude: data.eventGeo?.latitude || 0,
      longitude: data.eventGeo?.longitude || 0
    }
  };
};

export async function getEventByTitle(eventTitle) {
  try {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("eventName", "==", eventTitle));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No event found with name: ${eventTitle}`);
      return null;
    }

    // Return first matching event
    return processEventDoc(querySnapshot.docs[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function getAllEvents() {
  try {
    const eventsRef = collection(db, "events");
    const querySnapshot = await getDocs(eventsRef);

    if (querySnapshot.empty) {
      console.warn("No events found in database");
      return [];
    }

    // Process all events into our standard format
    return querySnapshot.docs.map(doc => processEventDoc(doc));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}