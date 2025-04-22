AFRAME.registerComponent("arrow-pointer", {
  init: function () {
    this.arrowEl = this.el;
    this.cameraEl = document.querySelector("a-camera");
    this.targetEl = null;

    this.onEventSelected = (e) => {
      if (e.detail && e.detail.entity) {
        this.targetEl = e.detail.entity;
        console.log("Arrow targeting:", this.targetEl.id);
      }
    };

    document.addEventListener("event-selected", this.onEventSelected);
  },

  tick: function () {
    if (!this.targetEl || !this.cameraEl) {
      // Fallback to first available event if no target
      this.targetEl = document.querySelector("[click-display-info]");
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
      x: 0,
      y: 0,
      z: angleDeg
    });
  },

  remove: function() {
    document.removeEventListener("event-selected", this.onEventSelected);
  }
});