// fetchEvent.js
import { db } from "./firebase.js"
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"

export async function getEventByTitle(eventTitle) {
  const events = collection(db, "events")
  let qry = events;
  
  if (eventTitle) {
    qry = query(events, where("eventName", "==", eventTitle))
  }

  try {
    const querySnapshot = await getDocs(qry)
    if (querySnapshot.empty) return null
    
    if (eventTitle) {
      return querySnapshot.docs[0].data()
    } else {
      const docs = querySnapshot.docs
      return docs[Math.floor(Math.random() * docs.length)].data()
    }
  } catch (error) {
    return null
  }
}

export async function getAllEvents() {
  try {
    const querySnapshot = await getDocs(collection(db, "events"))
    return querySnapshot.docs.map(doc => doc.data())
  } catch (error) {
    return []
  }
}