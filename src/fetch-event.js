// fetchEvent.js
// This script is a function that takes in the name of the fieldname and attempts to
//  match it with an event in the database. If a match is found then the event data is returned.

// Imports
import { db } from "./firebase.js"
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"

// Helper to parse geo array like 
//function parseGeoString(geoStr) {
//  const match = geoStr.match(/([\d.]+).*([NSEW])/);
//  if (!match) return null;
//
//  let value = parseFloat(match[1]);
//  const direction = match[2];
//
//  if (["S", "W"].includes(direction)) {
//    value *= -1;
//  }
//
//  return value;
//}


export async function getEventByTitle(eventTitle) {
  try {
    const events = await getAllEvents();
    return events.find(event => event.eventName === eventTitle) || null;
  } catch (error) {
    console.error("Error finding event by title:", error);
    return null;
  }
}

export async function getAllEvents() {
  // Create collection from database
  const events = collection(db, "events")

  // Attempt to get results
  try {
    const querySnapshot = await getDocs(events)
    const mockEvents = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const eventGeol = {
        latitude: data.eventGeo.latitude,
        longitude: data.eventGeo.longitude
      };
      // Put data into an array
      mockEvents.push({
        id: doc.id,
        eventName: data.eventName,
        eventBldg: data.eventBldg,
        eventRm: data.eventRm,
        eventTime: data.eventTime.toDate?.() || new Date(data.eventTime),
        eventGeo: eventGeol
      })
    })

    return mockEvents
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}


// Mock event data - no Firebase dependency
//export const mockEvents = [
//  {
//    id: "event1",
//    eventName: "Tech Conference",
//    eventBldg: "Convention Center",
//    eventRm: "Hall A",
//    eventTime: new Date(Date.now() + 86400000), // Tomorrow
//    eventGeo: {
//      latitude: 39.7862,
//      longitude: -84.0684
//    }
//  },
//  {
//    id: "event2",
//    eventName: "Music Festival",
//    eventBldg: "City Park",
//    eventRm: "Main Stage",
//    eventTime: new Date(Date.now() + 172800000), // 2 days from now
//    eventGeo: {
//      latitude: 39.787,
//      longitude: -84.0684
//    }
//  },
//  {
//    id: "event3",
//    eventName: "Art Exhibition",
//    eventBldg: "Museum",
//    eventRm: "Gallery 3",
//    eventTime: new Date(Date.now() + 259200000), // 3 days from now
//    eventGeo: {
//      latitude: 39.7868,
//      longitude: -84.068
//    }
//  }
//];
//
//export async function getEventByTitle(eventTitle) {
//  return mockEvents.find(event => event.eventName === eventTitle) || null;
//}
//
//export async function getAllEvents() {
//  return mockEvents;
//}