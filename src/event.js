// event.js
import { getAllEvents } from "./fetch-event.js";

document.addEventListener("DOMContentLoaded", async function () {
  console.log("[Event] DOM fully loaded, initializing...");
  
  const scene = document.querySelector("a-scene");
  if (!scene) {
    console.error("[Event] Error: A-Frame scene not found!");
    return;
  }

  // Parse URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const targetEventName = urlParams.get("eventName");
  console.log(`[Event] URL parameter eventName: ${targetEventName || "Not specified"}`);

  // Fetch all events
  console.log("[Event] Fetching events from Firebase...");
  const events = await getAllEvents();
  
  if (!events || events.length === 0) {
    console.error("[Event] No events available to display");
    return;
  }

  console.log(`[Event] Successfully loaded ${events.length} events`);
  
  // Create event entities
  let defaultEventId = null;
  events.forEach((event, index) => {
    const eventId = `event-${index}`;
    console.log(`[Event] Creating entity for: ${event.eventName} (ID: ${eventId})`);
    
    const entity = document.createElement("a-entity");
    entity.setAttribute("id", eventId);
    entity.setAttribute("class", "clickable");
    entity.setAttribute("click-display-info", "");
    entity.setAttribute("geometry", { 
      primitive: "box", 
      width: 8, 
      height: 8, 
      depth: 8 
    });
    entity.setAttribute("material", "color", "blue");
    entity.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude)
    });
    entity.setAttribute("data-event", JSON.stringify(event));
    
    scene.appendChild(entity);
    console.log(`[Event] Placed entity at: ${event.eventGeo.latitude}, ${event.eventGeo.longitude}`);

    // Set as default if matches URL param or is first event
    if ((targetEventName && event.eventName === targetEventName) || index === 0) {
      defaultEventId = eventId;
    }
  });

  // Initialize selected event
  if (defaultEventId) {
    console.log(`[Event] Default selected event ID: ${defaultEventId}`);
    updateSelectedEvent(defaultEventId);
  }
});

function updateSelectedEvent(eventId) {
  console.log(`[Event] Updating selected event to: ${eventId}`);
  
  const eventEl = document.getElementById(eventId);
  if (!eventEl) {
    console.error(`[Event] Error: Event entity ${eventId} not found`);
    return;
  }

  const eventData = JSON.parse(eventEl.getAttribute("data-event"));
  const infoDisplay = document.getElementById("display-info-text");

  // Update UI
  infoDisplay.setAttribute("value", 
    `Name: ${eventData.eventName}
    \nBldg: ${eventData.eventBldg} 
    \nRm: ${eventData.eventRm}
    \nTime: ${eventData.eventTime.toDate().toLocaleString()}`);

  // Highlight selected event
  document.querySelectorAll(".clickable").forEach(el => {
    const isSelected = el.id === eventId;
    el.setAttribute("material", "color", isSelected ? "white" : "blue");
    console.log(`[Event] ${el.id} color set to: ${isSelected ? "white" : "blue"}`);
  });

  // Update global reference
  window.currentSelectedEvent = eventId;
  console.log(`[Event] Current selected event updated to: ${eventId}`);
}