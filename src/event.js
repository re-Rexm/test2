// Event.js Script
import { getEvents, getEventByTitle } from "./fetch-event.js";

// This script handles both single event (via URL parameter) and multiple events display
document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  if (!scene) {
    
    return;
  }

  

  // Get url parameter
  const urlParameter = new URLSearchParams(document.location.search);
  const eventTitle = urlParameter.get("eventName");

  let events;
  if (eventTitle) {
    // If specific event requested, get just that one
    const singleEvent = await getEventByTitle(eventTitle);
    if (singleEvent) {
      events = [singleEvent];
    } else {
      
      events = await getEvents();
      events = [events[Math.floor(Math.random() * events.length)]];
    }
  } else {
    // No specific event requested, get all events
    events = await getEvents();
    if (events.length === 0) {
      
      return;
    }
  }

  // Create event entities
  const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'orange'];
  const eventEntities = [];
  
  events.forEach((event, index) => {
    const color = colors[index % colors.length];
    const eventId = `event-${index}`;
    
    // Create event entity
    const eventEl = document.createElement('a-entity');
    eventEl.setAttribute('id', eventId);
    eventEl.setAttribute('class', 'clickable');
    eventEl.setAttribute('click-display-info', '');
    eventEl.setAttribute('rotation-tick', '');
    eventEl.setAttribute('geometry', {
      primitive: 'box',
      width: 8,
      height: 8,
      depth: 8
    });
    eventEl.setAttribute('material', { color });
    eventEl.setAttribute('gps-new-entity-place', {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude)
    });
    
    // Store event data as component properties
    eventEl.dataset.eventName = event.eventName;
    eventEl.dataset.eventBldg = event.eventBldg;
    eventEl.dataset.eventRm = event.eventRm;
    eventEl.dataset.eventTime = event.eventTime.toDate().toLocaleString();
    eventEl.dataset.originalColor = color;
    
    scene.appendChild(eventEl);
    eventEntities.push(eventEl);
  });

  // Set the first event as the default target for arrow and distance
  if (eventEntities.length > 0) {
    setCurrentTarget(eventEntities[0]);
  }
});

// Helper function to set the current target for arrow and distance components
function setCurrentTarget(targetEl) {
  const arrow = document.querySelector("#arrow");
  const arrowTxt = document.querySelector("#arrowTxt");
  
  if (arrow && arrowTxt) {
    arrow.setAttribute('arrow-pointer', 'targetEl', `#${targetEl.id}`);
    arrowTxt.setAttribute('distance-calc', 'targetEl', `#${targetEl.id}`);
  }
}