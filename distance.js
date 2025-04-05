AFRAME.registerComponent("distance-calc", {
  init: function () {
    this.arrowText = this.el;
    this.cameraEl = document.querySelector("a-camera");
  },

  tick: function () {
    if (!this.cameraEl || this.arrowText.getAttribute('visible') === false) return;

    const activeText = document.querySelector('.event-text[visible="true"]');
    if (!activeText) return;

    const eventEntity = activeText.closest("a-entity");
    if (!eventEntity) return;

    const targetWorldPos = new THREE.Vector3();
    eventEntity.object3D.getWorldPosition(targetWorldPos);

    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    let dist = cameraPos.distanceTo(targetWorldPos).toFixed(2);
    const distTxt = `Your event is this way.\nDistance: ${dist}m`;

    this.arrowText.setAttribute("value", distTxt);
  }
});
