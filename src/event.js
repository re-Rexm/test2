// event.js
import { getAllEvents, getEventByTitle } from "./fetch-event.js";

let currentEvent = null;
const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33F3", "#33FFF5"];

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  if (!scene) return;

  // Get URL parameter if exists
  const urlParameter = new URLSearchParams(document.location.search);
  const eventTitle = urlParameter.get("eventName");

  // Get all events or specific one from URL
  let events = [];
  if (eventTitle) {
    const event = await getEventByTitle(eventTitle);
    if (event) events = [event];
  } else {
    events = await getAllEvents();
  }

  if (events.length === 0) return;

  // Store the first event as default
  currentEvent = events[0];

  // Create event boxes
  events.forEach((event, index) => {
    const eventEntity = document.createElement("a-entity");
    eventEntity.setAttribute("id", `event-${index}`);
    eventEntity.setAttribute("class", "event-box");
    
    // Set geometry with color
    eventEntity.setAttribute("geometry", {
      primitive: "box",
      width: 8,
      height: 8,
      depth: 8,
    });
    
    eventEntity.setAttribute("material", "color", colors[index % colors.length]);
    
    // Place entity at GPS location
    eventEntity.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude),
    });

    // Add click interaction
    eventEntity.setAttribute("click-display-info", `eventIndex: ${index}`);
    
    // Add rotation animation
    eventEntity.setAttribute("rotation-tick", "");
    
    // Store event data as component property
    eventEntity.dataset.event = JSON.stringify(event);

    scene.appendChild(eventEntity);
  });

  // Initialize arrow and distance components
  initPointerComponents();
});

function initPointerComponents() {
  // Create arrow entity if it doesn't exist
  let arrow = document.querySelector("#arrow");
  if (!arrow) {
    arrow = document.createElement("a-entity");
    arrow.setAttribute("id", "arrow");
    arrow.setAttribute("geometry", "primitive: cone; radiusBottom: 2; height: 4");
    arrow.setAttribute("material", "color: #FF0000");
    arrow.setAttribute("position", "0 -1 -3");
    arrow.setAttribute("arrow-pointer", "");
    document.querySelector("a-camera").appendChild(arrow);
  }

  // Create distance text if it doesn't exist
  let distanceText = document.querySelector("#distance-text");
  if (!distanceText) {
    distanceText = document.createElement("a-text");
    distanceText.setAttribute("id", "distance-text");
    distanceText.setAttribute("position", "0 -1.5 -3");
    distanceText.setAttribute("distance-calc", "");
    distanceText.setAttribute("align", "center");
    document.querySelector("a-camera").appendChild(distanceText);
  }

  // Create info display if it doesn't exist
  let infoDisplay = document.querySelector("#display-info-text");
  if (!infoDisplay) {
    const displayWindow = document.createElement("a-entity");
    displayWindow.setAttribute("id", "displayWindow");
    displayWindow.setAttribute("geometry", "primitive: plane; width: 4; height: 2");
    displayWindow.setAttribute("material", "color: #333333; opacity: 0.8");
    displayWindow.setAttribute("position", "0 0.5 -2");
    displayWindow.object3D.visible = false;

    infoDisplay = document.createElement("a-text");
    infoDisplay.setAttribute("id", "display-info-text");
    infoDisplay.setAttribute("value", "");
    infoDisplay.setAttribute("align", "center");
    infoDisplay.setAttribute("position", "0 0 -0.1");
    infoDisplay.setAttribute("width", "3.5");
    infoDisplay.setAttribute("color", "#FFFFFF");

    displayWindow.appendChild(infoDisplay);
    document.querySelector("a-camera").appendChild(displayWindow);
  }
}

export function setCurrentEvent(event) {
  currentEvent = event;
  updateInfoDisplay();
}

function updateInfoDisplay() {
  if (!currentEvent) return;

  const infoDisplay = document.querySelector("#display-info-text");
  if (infoDisplay) {
    infoDisplay.setAttribute(
      "value",
      `Name: ${currentEvent.eventName}
      \nBldg: ${currentEvent.eventBldg} 
      \nRm:  ${currentEvent.eventRm}
      \nTime:  ${currentEvent.eventTime.toDate().toLocaleString()}`
    );
  }
}