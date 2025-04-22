AFRAME.registerComponent("distance-calc", {
  schema: {
    mode: { type: 'string', default: 'selected' }
  },

  init: function () {
    this.textEl = this.el;
    this.cameraEl = document.querySelector("a-camera");
    this.targetEl = null;
    this.targetName = "";

    this.onEventSelected = (e) => {
      if (this.data.mode === 'selected' && e.detail) {
        this.targetEl = e.detail.entity;
        this.targetName = e.detail.eventData.eventName || "selected event";
      }
    };

    document.addEventListener("event-selected", this.onEventSelected);
  },

  tick: function () {
    if (!this.targetEl || !this.cameraEl) return;

    const targetPos = new THREE.Vector3();
    this.targetEl.object3D.getWorldPosition(targetPos);

    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    const distance = cameraPos.distanceTo(targetPos).toFixed(2);
    const text = `${this.targetName} is this way.\nDistance: ${distance}m`;

    this.textEl.setAttribute("value", text);
  },

  remove: function() {
    document.removeEventListener("event-selected", this.onEventSelected);
  }
});