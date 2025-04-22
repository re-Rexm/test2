import { getEventByTitle, getAllEvents } from "./fetch-event.js";

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  const infoDisplay = document.getElementById("display-info-text");
  const urlParams = new URLSearchParams(window.location.search);
  const eventTitle = urlParams.get("eventName");
  const allEvents = await getAllEvents();

  if (!allEvents || !allEvents.length) {
    console.error("No events found");
    return;
  }

  // Create event entities
  allEvents.forEach((event, index) => {
    const eventEl = document.createElement("a-entity");
    eventEl.id = `event-${index}`;
    
    eventEl.setAttribute("geometry", {
      primitive: "box",
      width: 8,
      height: 8,
      depth: 8
    });

    // Highlight if it's the searched event
    const color = event.eventName === eventTitle ? "#ffcc00" : "#3399ff";
    eventEl.setAttribute("material", { color: color });
    
    eventEl.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude)
    });

    eventEl.setAttribute("click-display-info", {
      eventData: JSON.stringify(event)
    });

    eventEl.setAttribute("rotation-tick", "");
    scene.appendChild(eventEl);

    // Auto-select if it matches URL parameter
    if (event.eventName === eventTitle) {
      setTimeout(() => {
        eventEl.components["click-display-info"].onClick();
      }, 1000);
    }
  });
});