import { getEventByTitle, getAllEvents } from "./fetch-event.js";

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  if (!scene) return;

  // Wait for scene to load
  scene.addEventListener("loaded", async function() {
    const urlParameter = new URLSearchParams(document.location.search);
    const eventTitle = urlParameter.get("eventName");
    const infoDisplay = document.getElementById("display-info-text");
    const displayWindow = document.querySelector("#displayWindow");

    // Get all events
    const allEvents = await getAllEvents();
    if (!allEvents.length) {
      document.getElementById("arrowTxt").setAttribute("value", "No events found");
      return;
    }

    // Create event entities
    allEvents.forEach((event, index) => {
      const color = `hsl(${(index * 360) / allEvents.length}, 100%, 50%)`;
      const eventEl = document.createElement("a-entity");
      eventEl.setAttribute("id", `event-${index}`);
      eventEl.setAttribute("class", "clickable");
      eventEl.setAttribute("click-display-info", "");
      eventEl.setAttribute("rotation-tick", "");
      eventEl.setAttribute("geometry", {
        primitive: "box",
        width: 8,
        height: 8,
        depth: 8
      });
      eventEl.setAttribute("material", { color: color });
      eventEl.setAttribute("gps-new-entity-place", {
        latitude: parseFloat(event.eventGeo.latitude),
        longitude: parseFloat(event.eventGeo.longitude)
      });
      eventEl.eventData = event;
      eventEl.originalColor = color;
      scene.appendChild(eventEl);
    });

    // Set default active event
    let defaultEvent = eventTitle 
      ? allEvents.find(e => e.eventName === eventTitle)
      : allEvents[Math.floor(Math.random() * allEvents.length)];

    if (defaultEvent) {
      const defaultEventEl = document.querySelector(`[eventData="${defaultEvent.eventName}"]`);
      if (defaultEventEl) {
        defaultEventEl.setAttribute("material", "color", "white");
        defaultEventEl.setAttribute("isActive", "");
        infoDisplay.setAttribute("value", getEventInfoText(defaultEvent));
        displayWindow.setAttribute("visible", "true");
      }
    }
  });
});

function getEventInfoText(event) {
  return `Name: ${event.eventName}
    \nBldg: ${event.eventBldg} 
    \nRm:  ${event.eventRm}
    \nTime:  ${event.eventTime.toDate().toLocaleString()}`;
}