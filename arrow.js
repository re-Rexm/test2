AFRAME.registerComponent("arrow-pointer", {
  init: function () {
    this.arrowEl = this.el;
    this.cameraEl = document.querySelector("a-camera");
  },

  tick: function () {
    if (!this.cameraEl) return;

    // Find the visible event text (only one should be visible at a time)
    const activeText = document.querySelector('.event-text[visible="true"]');
    if (!activeText) return;

    const eventEntity = activeText.closest("a-entity");
    if (!eventEntity) return;

    const targetWorldPos = new THREE.Vector3();
    eventEntity.object3D.getWorldPosition(targetWorldPos);

    const targetLocalPos = targetWorldPos.clone();
    this.cameraEl.object3D.worldToLocal(targetLocalPos);

    const angleRad = Math.atan2(targetLocalPos.y, targetLocalPos.x);
    const angleDeg = (180 / Math.PI) * angleRad - 90;

    this.arrowEl.setAttribute("rotation", { x: 0, y: 0, z: angleDeg });
  },
});
