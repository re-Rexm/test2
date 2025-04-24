// Event.js Script
// This script performs two actions. The first is to parse the url parameter for the eventTitle variable. 
// The second is to wait for the document to load, link scene and event entity to their respective variables, 
// place event location via coordinates, and apply values to the display info window.
import { getEventByTitle, getAllEvents } from "./fetch-event.js";

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    } else {
      reject(new Error("Geolocation not supported"));
    }
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  const infoDisplay = document.getElementById("display-info-text");
  const displayWindow = document.getElementById("displayWindow");
  const urlParams = new URLSearchParams(window.location.search);
  const eventTitle = urlParams.get("eventName");
  const allEvents = await getAllEvents();
  try {
    const userPos = await getUserLocation();
    console.log("User location:", userPos.coords.latitude, userPos.coords.longitude);
    
  }
  catch (error) {
    console.error("Failed to get user location:", error);
  }
  
  // Clear any existing events
  document.querySelectorAll("[click-display-info]").forEach(el => el.remove());

  // Create all event entities
  allEvents.forEach((event) => {
    const eventEl = document.createElement("a-entity");
    eventEl.id = event.id;
    
    // Set properties
    eventEl.setAttribute("geometry", {
      primitive: "box",
      width: 8,
      height: 8,
      depth: 8
    });

    // Highlight if it's the searched event
    const color = event.eventName === eventTitle ? "#ffcc00" : "#3399ff";
    eventEl.setAttribute("material", { color: color });
    
    console.log(`Placing event at: ${event.eventGeo.latitude}, ${event.eventGeo.longitude}`);
    eventEl.setAttribute("gps-new-entity-place", {
      latitude: event.eventGeo.latitude,
      longitude: event.eventGeo.longitude
    });

    // Add interaction component
    eventEl.setAttribute("click-display-info", {
      eventData: JSON.stringify(event)
    });

    // Add rotation animation
    eventEl.setAttribute("rotation-tick", "");

    // Add to scene
    scene.appendChild(eventEl);

    // Debug position after placement
    setTimeout(() => {
      const worldPos = new THREE.Vector3();
      eventEl.object3D.getWorldPosition(worldPos);
      console.log(`World position for ${event.id}:`, worldPos);
    }, 1000)

    // Auto-select if it matches URL parameter
    if (event.eventName === eventTitle) {
      setTimeout(() => {
        if (eventEl.components["click-display-info"]) {
          eventEl.components["click-display-info"].onClick();
        }
      }, 1500);
    }
  });
});


