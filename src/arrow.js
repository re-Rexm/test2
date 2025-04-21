// arrow.js
AFRAME.registerComponent("arrow-pointer", {
  schema: {
    targetEl: { type: 'selector', default: '#event' }
  },

  init: function () {
    this.arrowEl = this.el;
    this.cameraEl = document.querySelector("a-camera");
  },

  tick: function () {
    const targetEl = this.data.targetEl;
    if (!targetEl || !this.cameraEl) return;

    const targetWorldPos = new THREE.Vector3();
    targetEl.object3D.getWorldPosition(targetWorldPos);

    const targetLocalPos = targetWorldPos.clone();
    this.cameraEl.object3D.worldToLocal(targetLocalPos);

    const angleRad = Math.atan2(targetLocalPos.y, targetLocalPos.x);
    const angleDeg = (180 / Math.PI) * angleRad - 90;

    this.arrowEl.setAttribute("rotation", { x: 0, y: 0, z: angleDeg });
  }
});