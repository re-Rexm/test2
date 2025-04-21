AFRAME.registerComponent("distance-calc", {
  init: function () {
    this.arrowText = this.el;
    this.cameraEl = document.querySelector("a-camera");
  },

  tick: function () {
    const activeEvent = document.querySelector("[isActive]");
    if (!activeEvent || !this.cameraEl) return;

    const targetWorldPos = new THREE.Vector3();
    activeEvent.object3D.getWorldPosition(targetWorldPos);
    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);
    let dist = cameraPos.distanceTo(targetWorldPos);
    dist = dist.toFixed(2);
    this.arrowText.setAttribute(
      "value",
      `Your event is this way.\nDistance: ${dist}m`
    );
  }
});