document.addEventListener("DOMContentLoaded", async function () {
  const scene = document.querySelector("a-scene");
  if (!scene) return;

  const eventTitle = new URLSearchParams(document.location.search).get("eventName");
  const allEvents = await getAllEvents();

  if (!allEvents || allEvents.length === 0) {
    console.error("No events found");
    return;
  }

  // Create all event entities
  allEvents.forEach((event, index) => {
    const eventEntity = document.createElement("a-entity");
    eventEntity.id = `event-${index}`;
    
    eventEntity.setAttribute("geometry", {
      primitive: "box",
      width: 8,
      height: 8,
      depth: 8
    });

    // Highlight the searched event
    const color = event.eventName === eventTitle ? "#ffcc00" : "#3399ff";
    eventEntity.setAttribute("material", { color: color });
    
    eventEntity.setAttribute("gps-new-entity-place", {
      latitude: parseFloat(event.eventGeo.latitude),
      longitude: parseFloat(event.eventGeo.longitude)
    });

    // Add interaction component with proper event data
    eventEntity.setAttribute("click-display-info", {
      eventData: JSON.stringify(event)
    });

    scene.appendChild(eventEntity);
  });

  // Auto-select the searched event if specified
  if (eventTitle) {
    const targetEvent = Array.from(document.querySelectorAll("[click-display-info]"))
      .find(el => {
        try {
          const data = JSON.parse(el.getAttribute("click-display-info").eventData);
          return data.eventName === eventTitle;
        } catch (e) {
          return false;
        }
      });

    if (targetEvent) {
      setTimeout(() => {
        targetEvent.components["click-display-info"].onClick();
        
        // Manually trigger arrow update
        const arrow = document.querySelector("[arrow-pointer]");
        if (arrow && arrow.components["arrow-pointer"]) {
          arrow.components["arrow-pointer"].targetEl = targetEvent;
          console.log("Forced arrow target update");
        }
      }, 1000); // Increased delay to ensure everything is loaded
    }
  }
});