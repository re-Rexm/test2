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

  // Clear any existing events
  document.querySelectorAll("[click-display-info]").forEach(el => el.remove());

  // Create all event entities
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

    // Store original event data including Firestore timestamp
    const eventData = {
      ...event,
      eventTime: event.eventTime // Keep as Firestore timestamp object
    };

    eventEl.setAttribute("click-display-info", {
      eventData: JSON.stringify(eventData)
    });

    eventEl.setAttribute("rotation-tick", "");
    scene.appendChild(eventEl);

    // Auto-select if it matches URL parameter
    if (event.eventName === eventTitle) {
      setTimeout(() => {
        displayWindow.object3D.visible = true;
        eventEl.setAttribute("material", "color", "white");
        
        // Format time properly
        const eventTime = event.eventTime.toDate().toLocaleString();
        
        infoDisplay.setAttribute("value",
          `Name: ${event.eventName}
          \nBldg: ${event.eventBldg}
          \nRm: ${event.eventRm}
          \nTime: ${eventTime}`
        );

        // Dispatch selection event
        const eventSelected = new CustomEvent("event-selected", {
          detail: {
            entity: eventEl,
            eventData: eventData
          }
        });
        document.dispatchEvent(eventSelected);
      }, 1500); // Increased delay for GPS settling
    }
  });
});