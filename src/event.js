// event.js
import { getAllEvents } from "./fetch-event.js";

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  if (!scene) return;

  const events = await getAllEvents();
  if (!events || events.length === 0) return;

  // Colors for different events
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33F3", "#33FFF5"];

  events.forEach((event, index) => {
    // Create a new entity for each event
    const eventEntity = document.createElement("a-entity");
    eventEntity.setAttribute("id", `event-${index}`);
    
    // Set geometry with random color
    eventEntity.setAttribute("geometry", {
      primitive: "box",
      width: 8,
      height: 8,
      depth: 8,
    });
    
    // Use modulo to cycle through colors if there are more events than colors
    eventEntity.setAttribute("material", "color", colors[index % colors.length]);
    
    // Place entity at GPS location
    eventEntity.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude),
    });

    // Add to scene
    scene.appendChild(eventEntity);
  });
});