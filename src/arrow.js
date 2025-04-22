// arrow.js
AFRAME.registerComponent("arrow-pointer", {
  init: function () {
    this.arrowEl = this.el;
    this.cameraEl = document.querySelector("a-camera");
  },

  tick: function () {
    if (!this.cameraEl) return;
    
    // Find the currently selected event or first event
    const eventBox = document.querySelector(".event-box[material][color='white']") || 
                     document.querySelector(".event-box");
    
    if (!eventBox) return;

    // World position of the event element
    const targetWorldPos = new THREE.Vector3();
    eventBox.object3D.getWorldPosition(targetWorldPos);

    // Convert to Local position of camera
    const targetLocalPos = targetWorldPos.clone();
    this.cameraEl.object3D.worldToLocal(targetLocalPos);

    // Calculate angle
    const angleRad = Math.atan2(targetLocalPos.y, targetLocalPos.x);
    const angleDeg = (180 / Math.PI) * angleRad - 90;

    // Set rotation
    this.arrowEl.setAttribute("rotation", { x: 0, y: 0, z: angleDeg });
  }
});