import { getEventByTitle, getAllEvents } from "./fetch-event.js"

let urlParameter = new URLSearchParams(document.location.search)
const eventName = urlParameter.get("eventName")

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene")
  const infoDisplay = document.querySelector("#display-info-text")
  const displayWindow = document.querySelector("#displayWindow")
  const arrow = document.querySelector("#arrow")
  const arrowText = document.querySelector("#arrowTxt")

  let events = await getAllEvents()

  if (!events || events.length === 0) {
    console.error("No events found.")
    return
  }

  let activeEvent = events.find(e => e.eventName === eventName) || events[0]

  events.forEach((event, index) => {
    const eventEntity = document.createElement("a-entity")
    eventEntity.setAttribute("geometry", {
      primitive: "box",
      width: 8,
      height: 8,
      depth: 8,
    })

    eventEntity.setAttribute("material", "color", getColor(index))

    eventEntity.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude),
    })

    eventEntity.setAttribute("rotation-tick", "")
    eventEntity.classList.add("clickable")

    // Attach event-specific click logic
    eventEntity.addEventListener("click", () => {
      console.log(`Clicked: ${event.eventName}`)

      // Update info window
      infoDisplay.setAttribute(
        "value",
        `Name: ${event.eventName}
        \nBldg: ${event.eventBldg} 
        \nRm: ${event.eventRm}
        \nTime: ${event.eventTime.toDate().toLocaleString()}`
      )
      displayWindow.object3D.visible = true

      // Point arrow and distance to this
      arrow.components["arrow-pointer"].setTarget(eventEntity)
      arrowText.components["distance-calc"].setTarget(eventEntity)
    })

    scene.appendChild(eventEntity)

    // Set initial target if this is the active one
    if (event.eventName === activeEvent.eventName) {
      arrow.components["arrow-pointer"].setTarget(eventEntity)
      arrowText.components["distance-calc"].setTarget(eventEntity)

      infoDisplay.setAttribute(
        "value",
        `Name: ${event.eventName}
        \nBldg: ${event.eventBldg} 
        \nRm: ${event.eventRm}
        \nTime: ${event.eventTime.toDate().toLocaleString()}`
      )
    }
  })
})

// Utility: Cycle colors
function getColor(index) {
  const colors = ["blue", "green", "orange", "red", "purple", "yellow"]
  return colors[index % colors.length]
}
