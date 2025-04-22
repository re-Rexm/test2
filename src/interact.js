// interact.js
// This component enables entities to respond to click interactions by displaying event information.
// When a user clicks on an event box, it shows that event's information, and clicking again hides it.

AFRAME.registerComponent("click-display-info", {
  schema: {
    eventData: { type: 'string', default: '{}' }  // Store event data as a stringified JSON
  },
  
  init: function () {
    var el = this.el;
    
    // Store original color to return to it later
    this.originalColor = this.el.getAttribute("material").color || "blue";
    this.isSelected = false;
    
    // Parse event data if provided
    try {
      this.eventData = JSON.parse(this.data.eventData);
    } catch (e) {
      console.warn("Could not parse event data", e);
      this.eventData = {};
    }
    
    // Bind click event to element
    this.el.addEventListener("click", this.onClick.bind(this)); 
    console.log(`The ${el.id} entity is clickable.`);
  },
  
  update: function(oldData) {
    // Re-parse event data when component data changes
    if (this.data.eventData !== oldData.eventData) {
      try {
        this.eventData = JSON.parse(this.data.eventData);
      } catch (e) {
        console.warn("Could not parse event data in update", e);
      }
    }
  },
  
  // On click: change color of event entity and display information text
  onClick: function () {
    var infoWindow = document.querySelector("#displayWindow"); // window entity to toggle
    var infoDisplay = document.getElementById("display-info-text");
    var allEvents = document.querySelectorAll("[click-display-info]");
    
    console.log(`The ${this.el.id} entity was clicked.`);
    
    // Reset all other events to their original color
    allEvents.forEach(eventEl => {
      if (eventEl !== this.el && eventEl.components["click-display-info"].isSelected) {
        var component = eventEl.components["click-display-info"];
        eventEl.setAttribute("material", "color", component.originalColor);
        component.isSelected = false;
      }
    });
    
    // Toggle selection state for this event
    if (!this.isSelected) {
      // Select this event
      this.el.setAttribute("material", "color", "white");
      this.isSelected = true;
      
      // Show info window
      if (infoWindow) {
        infoWindow.object3D.visible = true;
      }
      
      // Display this event's information
      if (infoDisplay && this.eventData) {
        try {
          const formattedTime = this.eventData.eventTime && typeof this.eventData.eventTime.toDate === 'function' ? 
            this.eventData.eventTime.toDate().toLocaleString() : 
            (this.eventData.eventTime || "Not specified");
            
          infoDisplay.setAttribute(
            "value",
            `Name: ${this.eventData.eventName || "Unknown"}
            \nBldg: ${this.eventData.eventBldg || "N/A"} 
            \nRm: ${this.eventData.eventRm || "N/A"}
            \nTime: ${formattedTime}`
          );
        } catch (error) {
          console.error("Error formatting event data:", error);
          infoDisplay.setAttribute("value", "Error displaying event information");
        }
      }
    } else {
      // Deselect this event
      this.el.setAttribute("material", "color", this.originalColor);
      this.isSelected = false;
      
      // Hide info window
      if (infoWindow) {
        infoWindow.object3D.visible = false;
      }
    }
  }
});