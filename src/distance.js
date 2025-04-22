// distance.js
AFRAME.registerComponent("distance-calc", {
  init: function () {
    this.arrowText = this.el;
    this.cameraEl = document.querySelector("a-camera");
  },

  tick: function () {
    if (!this.cameraEl) return;
    
    // Find the currently selected event or first event
    const eventBox = document.querySelector(".event-box[material][color='white']") || 
                     document.querySelector(".event-box");
    
    if (!eventBox) return;

    // World positions
    const targetWorldPos = new THREE.Vector3();
    eventBox.object3D.getWorldPosition(targetWorldPos);

    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    // Calculate distance
    let dist = cameraPos.manhattanDistanceTo(targetWorldPos);
    dist = dist.toFixed(2);
    
    // Update text
    this.arrowText.setAttribute("value", 
      `Event is this way\nDistance: ${dist}m`);
  }
});