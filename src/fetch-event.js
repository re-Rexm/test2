import { db } from "./firebase.js"
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"

// Helper to parse geo array like ["39.7862° N", "84.0684° W"]
function parseGeo(geoArray) {
  const latStr = geoArray[0]
  const lngStr = geoArray[1]

  const lat = parseFloat(latStr) * (latStr.includes("S") ? -1 : 1)
  const lng = parseFloat(lngStr) * (lngStr.includes("W") ? -1 : 1)

  return {
    latitude: lat,
    longitude: lng
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
        eventGeo: parseGeo(data.eventGeo)
      })
    })

    return mockEvents
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}
