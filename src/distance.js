// distance.js
AFRAME.registerComponent("distance-calc", {
  schema: {
    targetEl: { type: 'selector', default: '#event' }
  },

  init: function () {
    this.arrowText = this.el;
    this.cameraEl = document.querySelector("a-camera");
  },

  tick: function () {
    const targetEl = this.data.targetEl;
    if (!targetEl || !this.cameraEl) return;

    const targetWorldPos = new THREE.Vector3();
    targetEl.object3D.getWorldPosition(targetWorldPos);

    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    let dist = cameraPos.manhattanDistanceTo(targetWorldPos);
    dist = dist.toFixed(2);
    
    const distTxt = `Your event is this way.\nDistance: ${dist}m`;
    this.arrowText.setAttribute("value", distTxt);
  }
});