// arrow.js
// This script adds a custom component that changes rotation of the arrow entity 
// to point toward either the currently selected event or the closest event

AFRAME.registerComponent("arrow-pointer", {
  schema: {
    // Mode can be "selected" to point to selected event or "closest" to point to closest event
    mode: { type: 'string', default: 'closest' },
    // Maximum distance to consider when finding the closest event (in meters)
    maxDistance: { type: 'number', default: 1000 }
  },

  init: function () {
    this.arrowEl = this.el; // The entity doing the pointing (tagged element)
    this.cameraEl = document.querySelector("a-camera"); // POV using the user's camera
    this.targetEl = null; // Will be set dynamically
    
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
  
  // When an event is selected, point to it if we're in 'selected' mode
  onEventSelectionChange: function(e) {
    if (this.data.mode === 'selected' && e.detail && e.detail.entity) {
      this.targetEl = e.detail.entity;
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
    }
  },

  // With every frame update, rotate toward the targetEl
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

    // World position of the event (target) element
    const targetWorldPos = new THREE.Vector3();
    this.targetEl.object3D.getWorldPosition(targetWorldPos);

    // Converted event (target) world position to Local position of camera element
    const targetLocalPos = targetWorldPos.clone();
    this.cameraEl.object3D.worldToLocal(targetLocalPos);

    // Angle in radians
    const angleRad = Math.atan2(targetLocalPos.x, -targetLocalPos.z);

    // Convert radian angle to degrees
    const angleDeg = THREE.MathUtils.radToDeg(angleRad);

    // Set degree to the y-axis of the arrow element (for horizontal rotation)
    this.arrowEl.setAttribute("rotation", { x: 0, y: angleDeg, z: 0 });
    
    // Optional: Add a slight up/down tilt based on height difference
    const verticalAngle = Math.atan2(targetLocalPos.y, Math.sqrt(targetLocalPos.x * targetLocalPos.x + targetLocalPos.z * targetLocalPos.z));
    const verticalAngleDeg = THREE.MathUtils.radToDeg(verticalAngle);
    this.arrowEl.object3D.rotation.x = verticalAngleDeg * 0.5; // Apply a softer vertical angle
  }
});

// Update the click-display-info component to dispatch an event when an entity is selected
AFRAME.registerComponent("click-display-info", {
  // ... existing code from before ...
  
  onClick: function () {
    // ... existing code from before ...
    
    // Add this at the point where an event is selected (after setting isSelected to true)
    if (!this.isSelected) {
      // ... existing selection code ...
      
      // Dispatch an event to inform the arrow component
      const eventSelectedEvent = new CustomEvent("event-selected", {
        detail: { entity: this.el, eventData: this.eventData }
      });
      document.dispatchEvent(eventSelectedEvent);
      
      // ... rest of existing code ...
    }
    
    // ... rest of existing code ...
  }
});