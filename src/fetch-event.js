// fetchEvent.js

// This script is a function that takes in the time of the fieldname and attempts to match it with an event in the database. If a match is found then the event data is returned.

// Imports
import { db } from "./firebase.js"
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"

export async function getAllEvents() {
  try {
    const events = collection(db, "events")
    const querySnapshot = await getDocs(events)
    return querySnapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.error("Error getting all events:", error)
    return []
  }
}
