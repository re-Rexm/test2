AFRAME.registerComponent("distance-calc", {
  init: function () {
    this.arrowText = this.el;
    this.targetEl = null;
    this.cameraEl = document.querySelector("a-camera");
  },

  tick: function () {
    if (!this.targetEl || !this.cameraEl) return;

    const targetWorldPos = new THREE.Vector3();
    this.targetEl.object3D.getWorldPosition(targetWorldPos);

    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    let dist = cameraPos.manhattanDistanceTo(targetWorldPos);
    dist = dist.toFixed(2);

    var distTxt = `Your event is this way.\n Distance: ${dist}m`;
    this.arrowText.setAttribute("value", distTxt);
  },

  setTarget: function (newTarget) {
    this.targetEl = newTarget;
  },
});
