// Event.js Script
import { getEventByTitle, getAllEvents } from "./fetch-event.js"

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene")
  if (!scene) return

  const urlParameter = new URLSearchParams(document.location.search)
  const eventTitle = urlParameter.get("eventName")
  const infoDisplay = document.getElementById("display-info-text")
  const displayWindow = document.querySelector("#displayWindow")

  // Hide display window initially
  displayWindow.object3D.visible = false

  // Get all events
  const allEvents = await getAllEvents()
  if (!allEvents.length) return

  // Get default event (from URL or random)
  let defaultEvent = await getEventByTitle(eventTitle)
  if (!defaultEvent && allEvents.length) {
    defaultEvent = allEvents[Math.floor(Math.random() * allEvents.length)]
  }

  // Create event entities
  allEvents.forEach((event, index) => {
    const color = `hsl(${(index * 360) / allEvents.length}, 100%, 50%)`
    const eventEl = document.createElement("a-entity")
    eventEl.setAttribute("id", `event-${index}`)
    eventEl.setAttribute("class", "clickable")
    eventEl.setAttribute("click-display-info", "")
    eventEl.setAttribute("rotation-tick", "")
    eventEl.setAttribute("geometry", {
      primitive: "box",
      width: 8,
      height: 8,
      depth: 8,
    })
    eventEl.setAttribute("material", "color", color)
    eventEl.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude),
    })
    eventEl.eventData = event
    eventEl.originalColor = color
    scene.appendChild(eventEl)

    // Set as active if it's the default event
    if (event.eventName === defaultEvent.eventName) {
      infoDisplay.setAttribute("value", getEventInfoText(event))
      eventEl.setAttribute("material", "color", "white")
      eventEl.isActive = true
      displayWindow.object3D.visible = true
    }
  })
})

function getEventInfoText(event) {
  return `Name: ${event.eventName}
    \nBldg: ${event.eventBldg} 
    \nRm:  ${event.eventRm}
    \nTime:  ${event.eventTime.toDate().toLocaleString()}`
}