// distance-tick.js
// This script creates a customized component for an AFRAME entity that displays
// the distance between the user and either the selected event or closest event

AFRAME.registerComponent("distance-calc", {
  schema: {
    // Mode can be "selected" to show distance to selected event or "closest" to show distance to closest event
    mode: { type: 'string', default: 'selected' },
    // Maximum distance to consider when finding the closest event (in meters)
    maxDistance: { type: 'number', default: 1000 },
    // Whether to use Euclidean (straight-line) or Manhattan distance
    distanceType: { type: 'string', default: 'euclidean' }
  },

  init: function () {
    this.textEl = this.el; // The text entity to update with distance info
    this.cameraEl = document.querySelector("a-camera"); // POV using the user's camera
    this.targetEl = null; // Will be set dynamically
    this.targetName = ""; // Name of the current target
    
    // Listen for event selection changes
    this.eventSelectionHandler = this.onEventSelectionChange.bind(this);
    document.addEventListener("event-selected", this.eventSelectionHandler);
    
    // Setup interval to regularly update target event (for closest mode)
    if (this.data.mode === 'closest') {
      this.updateClosestInterval = setInterval(() => {
        this.updateClosestEvent();
      }, 2000); // Update every 2 seconds to avoid performance issues
    }
  },
  
  remove: function() {
    // Clean up event listeners and intervals when component is removed
    document.removeEventListener("event-selected", this.eventSelectionHandler);
    if (this.updateClosestInterval) {
      clearInterval(this.updateClosestInterval);
    }
  },
  
  // When an event is selected, use it as our target if we're in 'selected' mode
  onEventSelectionChange: function(e) {
    if (this.data.mode === 'selected' && e.detail && e.detail.entity) {
      this.targetEl = e.detail.entity;
      
      // Get event name if available
      if (e.detail.eventData && e.detail.eventData.eventName) {
        this.targetName = e.detail.eventData.eventName;
      } else {
        // Try to get it from the component
        try {
          const component = this.targetEl.components["click-display-info"];
          if (component && component.eventData && component.eventData.eventName) {
            this.targetName = component.eventData.eventName;
          } else {
            this.targetName = "selected event";
          }
        } catch (e) {
          this.targetName = "selected event";
        }
      }
    }
  },
  
  // Find the closest event to the camera position
  updateClosestEvent: function() {
    const eventEntities = Array.from(document.querySelectorAll("[click-display-info]"));
    if (!eventEntities.length || !this.cameraEl) return;
    
    // Get camera position
    const cameraPosition = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPosition);
    
    // Find closest event
    let closestDistance = this.data.maxDistance;
    let closestEvent = null;
    
    eventEntities.forEach(eventEl => {
      const eventPosition = new THREE.Vector3();
      eventEl.object3D.getWorldPosition(eventPosition);
      
      const distance = cameraPosition.distanceTo(eventPosition);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEvent = eventEl;
      }
    });
    
    if (closestEvent) {
      this.targetEl = closestEvent;
      
      // Try to get event name from component
      try {
        const component = closestEvent.components["click-display-info"];
        if (component && component.eventData && component.eventData.eventName) {
          this.targetName = component.eventData.eventName;
        } else {
          this.targetName = "closest event";
        }
      } catch (e) {
        this.targetName = "closest event";
      }
    }
  },

  tick: function () {
    // If we're in 'closest' mode and don't have a target yet, find one
    if (this.data.mode === 'closest' && !this.targetEl) {
      this.updateClosestEvent();
    }
    
    if (!this.targetEl || !this.cameraEl) return;
    
    // Check if target is visible in the scene
    if (!this.targetEl.object3D.visible) {
      // If the current target isn't visible, find a new one if in 'closest' mode
      if (this.data.mode === 'closest') {
        this.updateClosestEvent();
      }
      if (!this.targetEl || !this.targetEl.object3D.visible) return;
    }

    // World position of event (target)
    const targetWorldPos = new THREE.Vector3();
    this.targetEl.object3D.getWorldPosition(targetWorldPos);

    // World position of camera
    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    // Calculate distance based on selected distance type
    let dist;
    if (this.data.distanceType === 'manhattan') {
      dist = cameraPos.manhattanDistanceTo(targetWorldPos);
    } else {
      dist = cameraPos.distanceTo(targetWorldPos);
    }
    
    dist = dist.toFixed(2); // Format to 2 decimal places
    
    // Create display text with event name if available
    let distTxt;
    if (this.targetName) {
      distTxt = `${this.targetName} is this way.\nDistance: ${dist}m`;
    } else {
      distTxt = `Your event is this way.\nDistance: ${dist}m`;
    }

    // Update text element
    this.textEl.setAttribute("value", distTxt);
  }
});