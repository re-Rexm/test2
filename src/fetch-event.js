// fetchEvent.js

// This script provides functions to fetch event data from the Firebase database.
// It can fetch a specific event by title or all events.

// Imports
import { db } from "./firebase.js"
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"


export async function getEventByTitle(eventTitle) {
  // Create collection from database and query against input
  const events = collection(db, "events")
  const qry = query(events, where("eventName", "==", eventTitle))

  // Attempt to get results
  try {
    const querySnapshot = await getDocs(qry)

    if (querySnapshot.empty) {
      console.warn(`No event found with eventName ${eventTitle}`)
      return null
    }

    // Create object to be returned for matching event
    const doc = querySnapshot.docs[0]
    const data = doc.data()
    
    // Add the document ID to the returned data
    return { id: doc.id, ...data }
  } catch (error) {
    console.error("Error from getEventByTitle:", error)
    return null
  }
}


export async function getAllEvents() {
  // Reference to events collection
  const eventsCollection = collection(db, "events")
  
  try {
    // Get all documents from the events collection
    const querySnapshot = await getDocs(eventsCollection)
    
    if (querySnapshot.empty) {
      console.warn("No events found in the database")
      return []
    }
    
    // Map the documents to an array of event objects including their IDs
    const events = querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() }
    })
    
    return events
  } catch (error) {
    console.error("Error from getAllEvents:", error)
    return null
  }
}