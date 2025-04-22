AFRAME.registerComponent("arrow-pointer", {
  schema: {
    mode: { type: 'string', default: 'selected' },
    maxDistance: { type: 'number', default: 1000 }
  },

  init: function () {
    this.arrowEl = this.el;
    this.cameraEl = document.querySelector("a-camera");
    this.targetEl = null;
    
    // More aggressive target finding
    this.findTarget();
    
    this.eventSelectionHandler = this.onEventSelectionChange.bind(this);
    document.addEventListener("event-selected", this.eventSelectionHandler);
  },

  findTarget: function() {
    // First try to find selected event
    if (this.data.mode === 'selected') {
      this.targetEl = document.querySelector('[click-display-info][isSelected]');
    }
    
    // If no selected target, find closest
    if (!this.targetEl && this.data.mode === 'closest') {
      this.updateClosestEvent();
    }
    
    // Fallback: just find any event
    if (!this.targetEl) {
      this.targetEl = document.querySelector('[click-display-info]');
    }
  },

  onEventSelectionChange: function(e) {
    if (this.data.mode === 'selected' && e.detail && e.detail.entity) {
      this.targetEl = e.detail.entity;
      console.log("Arrow now pointing to selected event:", this.targetEl.id);
    }
  },

  tick: function () {
    if (!this.targetEl || !this.cameraEl) {
      this.findTarget();
      if (!this.targetEl) return;
    }

    const targetWorldPos = new THREE.Vector3();
    this.targetEl.object3D.getWorldPosition(targetWorldPos);

    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    // Calculate direction vector
    const direction = new THREE.Vector3();
    direction.subVectors(targetWorldPos, cameraPos).normalize();

    // Calculate rotation to look at target
    const rotation = new THREE.Euler();
    rotation.setFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1), // Default forward direction
        direction
      )
    );

    // Convert to degrees
    const degrees = {
      x: THREE.MathUtils.radToDeg(rotation.x),
      y: THREE.MathUtils.radToDeg(rotation.y),
      z: THREE.MathUtils.radToDeg(rotation.z)
    };

    this.arrowEl.setAttribute("rotation", degrees);
  }
});