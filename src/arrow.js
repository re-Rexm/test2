AFRAME.registerComponent("arrow-pointer", {
  schema: {
    mode: { type: 'string', default: 'selected' }, // 'selected' or 'closest'
    maxDistance: { type: 'number', default: 1000 }
  },

  init: function () {
    this.arrowEl = this.el;
    this.cameraEl = document.querySelector("a-camera");
    this.targetEl = null;
    this.originalRotation = this.el.getAttribute("rotation") || { x: 0, y: 0, z: 0 };

    // Event listeners
    this.onEventSelected = this.handleEventSelection.bind(this);
    document.addEventListener("event-selected", this.onEventSelected);

    // Initial target setup
    if (this.data.mode === 'closest') {
      this.findClosestEvent();
    } else {
      this.targetEl = document.querySelector("[click-display-info][isSelected]");
    }
  },

  handleEventSelection: function (e) {
    if (this.data.mode === 'selected' && e.detail && e.detail.entity) {
      this.targetEl = e.detail.entity;
      console.log("Arrow now pointing to selected event:", this.targetEl.id);
    }
  },

  findClosestEvent: function() {
    const events = Array.from(document.querySelectorAll("[click-display-info]"));
    if (!events.length || !this.cameraEl) return;

    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    let closestDistance = this.data.maxDistance;
    let closestEvent = null;

    events.forEach(event => {
      const eventPos = new THREE.Vector3();
      event.object3D.getWorldPosition(eventPos);
      const distance = cameraPos.distanceTo(eventPos);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestEvent = event;
      }
    });

    if (closestEvent) {
      this.targetEl = closestEvent;
    }
  },

  tick: function () {
    if (!this.targetEl || !this.cameraEl) {
      if (this.data.mode === 'closest') {
        this.findClosestEvent();
      }
      if (!this.targetEl) return;
    }

    // Original code set 1 rotation logic
    const targetWorldPos = new THREE.Vector3();
    this.targetEl.object3D.getWorldPosition(targetWorldPos);

    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    const targetLocalPos = targetWorldPos.clone();
    this.cameraEl.object3D.worldToLocal(targetLocalPos);

    const angleRad = Math.atan2(targetLocalPos.y, targetLocalPos.x);
    const angleDeg = THREE.MathUtils.radToDeg(angleRad) - 90;

    this.arrowEl.setAttribute("rotation", {
      x: this.originalRotation.x,
      y: this.originalRotation.y,
      z: angleDeg
    });
  },

  remove: function() {
    document.removeEventListener("event-selected", this.onEventSelected);
  }
});