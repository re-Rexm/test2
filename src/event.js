// Event.js Script
import { getEventByTitle, getAllEvents } from "./fetch-event.js";

// This script:
// 1. Parses the URL parameter for the eventTitle
// 2. Displays all events as 3D boxes at their geographic locations
// 3. Applies the click-display-info component to each event
// 4. Initially shows details for the event specified in the URL parameter

// Get URL parameter
let urlParameter = new URLSearchParams(document.location.search);

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  if (scene) {
    console.log("event-js scene found!");
    console.log("Scene load state: ", scene.hasLoaded);

    const infoDisplay = document.getElementById("display-info-text");
    const displayWindow = document.getElementById("displayWindow");
    
    // Initially hide the display window until we select an event
    if (displayWindow) {
      displayWindow.object3D.visible = false;
    }
    
    // Get the event name from URL parameter
    const eventTitle = urlParameter.get("eventName");
    
    // Get all events to display them all
    const allEvents = await getAllEvents();
    let specificEventEntity = null;
    
    if (allEvents && allEvents.length > 0) {
      console.log(`Retrieved ${allEvents.length} events`);
      
      // Create and place all events
      allEvents.forEach((event, index) => {
        // Create a new entity for each event
        const eventEntity = document.createElement("a-entity");
        eventEntity.id = `event-${index}`;
        
        // Set common geometry for all events
        eventEntity.setAttribute("geometry", {
          primitive: "box",
          width: 20,
          height: 20,
          depth: 22,
        });
        
        // Set different colors for different events
        // Make the queried event stand out with a different color
        const color = event.eventName === eventTitle ? "#ffcc00" : "#3399ff";
        eventEntity.setAttribute("material", { color: color });
        
        // Place entity at gps location using events geloc data from firebase
        eventEntity.setAttribute("gps-new-entity-place", {
          latitude: parseFloat(event.eventGeo.latitude),
          longitude: parseFloat(event.eventGeo.longitude),
        });
        
        // Store this entity if it matches the specified event name
        if (event.eventName === eventTitle) {
          specificEventEntity = eventEntity;
        }
        
        // Add the click-display-info component with event data
        const safeEventData = { ...event };
        // Handle Firestore Timestamp objects before stringifying
        if (safeEventData.eventTime && typeof safeEventData.eventTime.toDate === 'function') {
          safeEventData.eventTime = safeEventData.eventTime.toDate().toISOString();
        }
        eventEntity.setAttribute("click-display-info", {
          eventData: JSON.stringify(safeEventData)
        });

        // Add the entity to the scene
        scene.appendChild(eventEntity);
        
        console.log(
          `Event ${index} Position:`,
          eventEntity.getAttribute("gps-new-entity-place")
        );
      });
      
      // If an event name was specified in URL, trigger its click event automatically
      if (specificEventEntity) {
        // Use a slight delay to ensure components are initialized
        setTimeout(() => {
          if (specificEventEntity && specificEventEntity.components["click-display-info"]) {
            // First trigger the click handler
            specificEventEntity.components["click-display-info"].onClick();
            
            // Then manually dispatch the event-selected event
            const eventSelectedEvent = new CustomEvent("event-selected", {
              detail: { 
                entity: specificEventEntity,
                eventData: specificEventEntity.components["click-display-info"].eventData
              }
            });
            document.dispatchEvent(eventSelectedEvent);
          }
        }, 500);
      }
    } else {
      console.error("No events found or error retrieving events");
      if (infoDisplay) {
        infoDisplay.setAttribute("value", "No events available");
      }
    }
  } else {
    console.error("Scene element not found!");
  }
});