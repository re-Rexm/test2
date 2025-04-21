import { getAllEvents } from "./fetch-event.js"; // Add a new method in fetch-event.js

document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  const infoDisplay = document.getElementById("display-info-text");
  const displayWindow = document.querySelector("#displayWindow");

  // Get URL param
  const urlParameter = new URLSearchParams(document.location.search);
  const defaultEventTitle = urlParameter.get("eventName");

  let activeTargetEl = null;

  // Fetch all events
  const allEvents = await getAllEvents();

  allEvents.forEach((event, index) => {
    const eventEntity = document.createElement("a-entity");
    eventEntity.setAttribute("id", `event-${index}`);
    eventEntity.setAttribute("geometry", { primitive: "box", width: 8, height: 8, depth: 8 });
    eventEntity.setAttribute("material", "color: blue");
    eventEntity.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude),
    });
    eventEntity.setAttribute("rotation-tick", "");
    eventEntity.setAttribute("click-display-info", "");

    // Store event data for this entity
    eventEntity.eventData = event;

    // Set default active target
    if (event.eventName === defaultEventTitle) {
      activeTargetEl = eventEntity;
    }

    // Click listener for switching arrow/distance target
    eventEntity.addEventListener("click", () => {
      activeTargetEl = eventEntity;
      displayWindow.object3D.visible = true;

      infoDisplay.setAttribute(
        "value",
        `Name: ${event.eventName}\nBldg: ${event.eventBldg}\nRm: ${event.eventRm}\nTime: ${event.eventTime.toDate().toLocaleString()}`
      );
    });

    scene.appendChild(eventEntity);
  });

  // Wait a sec to make sure DOM is populated
  setTimeout(() => {
    document.querySelector("#arrow").components["arrow-pointer"].setTarget(activeTargetEl);
    document.querySelector("#arrowTxt").components["distance-calc"].setTarget(activeTargetEl);
  }, 2000);
});
