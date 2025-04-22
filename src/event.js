import { getEventByTitle, getAllEvents } from "./fetch-event.js";

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  const infoDisplay = document.getElementById("display-info-text");
  const displayWindow = document.getElementById("displayWindow");
  const urlParams = new URLSearchParams(window.location.search);
  const eventTitle = urlParams.get("eventName");
  const allEvents = await getAllEvents();

  if (!allEvents || !allEvents.length) {
    console.error("No events found");
    infoDisplay.setAttribute("value", "No events available");
    return;
  }

  // Remove any existing events
  const existingEvents = document.querySelectorAll("[click-display-info]");
  existingEvents.forEach(el => el.remove());

  // Create all event entities
  allEvents.forEach((event, index) => {
    const eventEl = document.createElement("a-entity");
    eventEl.id = `event-${event.id || index}`; // Use Firebase ID if available
    
    // Set geometry and appearance
    eventEl.setAttribute("geometry", {
      primitive: "box",
      width: 8,
      height: 8,
      depth: 8
    });

    // Set initial color (highlight query event)
    const isQueryEvent = event.eventName === eventTitle;
    const color = isQueryEvent ? "#ffcc00" : "#3399ff";
    eventEl.setAttribute("material", { color: color });
    
    // Set GPS position
    eventEl.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude)
    });

    // Add interaction component with proper event data
    const eventData = {
      ...event,
      // Convert Firestore timestamp to ISO string for storage
      eventTime: event.eventTime.toDate().toISOString()
    };
    eventEl.setAttribute("click-display-info", {
      eventData: JSON.stringify(eventData)
    });

    // Add rotation animation
    eventEl.setAttribute("rotation-tick", "");

    // Add to scene
    scene.appendChild(eventEl);

    // If this is the query event, select it after a delay
    if (isQueryEvent) {
      setTimeout(() => {
        if (eventEl.components["click-display-info"]) {
          eventEl.components["click-display-info"].onClick();
          
          // Manually update display info
          const time = new Date(eventData.eventTime).toLocaleString();
          infoDisplay.setAttribute("value",
            `Name: ${event.eventName}
            \nBldg: ${event.eventBldg}
            \nRm: ${event.eventRm}
            \nTime: ${time}`
          );
          displayWindow.object3D.visible = true;
        }
      }, 2000); // Longer delay for GPS settling
    }
  });
});