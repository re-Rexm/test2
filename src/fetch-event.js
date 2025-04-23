import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
  const events = collection(db, "events")

  try {
    const querySnapshot = await getDocs(events)
    const mockEvents = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()

      mockEvents.push({
        id: doc.id,
        eventName: data.eventName,
        eventBldg: data.eventBldg,
        eventRm: data.eventRm,
        eventTime: data.eventTime.toDate?.() || new Date(data.eventTime),
        eventGeo: {
          latitude: data.eventGeo.latitude,
          longitude: data.eventGeo.longitude
        }
      })
    })

    return mockEvents
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}



//export const mockEvents = [
//  {
//    id: "event1",
//    eventName: "Tech Conference",
//    eventBldg: "Convention Center",
//    eventRm: "Hall A",
//    eventTime: new Date(Date.now() + 86400000),
//    eventGeo: {
//      latitude: 37.7749,
//      longitude: -122.4194
//    }
//  },
//  {
//    id: "event2",
//    eventName: "Music Festival",
//    eventBldg: "City Park",
//    eventRm: "Main Stage",
//    eventTime: new Date(Date.now() + 172800000),
//    eventGeo: {
//      latitude: 37.7694,
//      longitude: -122.4262
//    }
//  }
//];