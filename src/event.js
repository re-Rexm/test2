document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  const infoDisplay = document.getElementById("display-info-text");
  const displayWindow = document.querySelector("#displayWindow");

  const urlParameter = new URLSearchParams(document.location.search);
  const eventNameParam = urlParameter.get("eventName");

  let activeTargetEl = null;
  const colorList = ["blue", "green", "red", "orange", "purple", "cyan", "magenta", "pink"];

  const allEvents = await getAllEvents();

  allEvents.forEach((event, index) => {
    const eventEntity = document.createElement("a-entity");
    const eventColor = colorList[index % colorList.length];

    eventEntity.setAttribute("id", `event-${index}`);
    eventEntity.setAttribute("geometry", {
      primitive: "box",
      width: 8,
      height: 8,
      depth: 8,
    });

    eventEntity.setAttribute("material", `color: ${eventColor}`);
    eventEntity.setAttribute("data-original-color", eventColor); // Store original color
    eventEntity.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude),
    });

    eventEntity.setAttribute("rotation-tick", "");
    eventEntity.setAttribute("click-display-info", "");
    eventEntity.eventData = event;

    // If it matches the eventName param, or no param & this is first event
    const isDefaultTarget =
      (eventNameParam && event.eventName === eventNameParam) ||
      (!eventNameParam && index === 0);

    if (isDefaultTarget) {
      activeTargetEl = eventEntity;
    }

    scene.appendChild(eventEntity);
  });

  // Set initial target after entities are created
  setTimeout(() => {
    if (activeTargetEl) {
      // Simulate click on default target
      activeTargetEl.components['click-display-info'].el.emit('click');
    }
  }, 2000);
});