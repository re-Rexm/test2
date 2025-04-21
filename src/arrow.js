// arrow.js
AFRAME.registerComponent("arrow-pointer", {
  init: function () {
    this.arrowEl = this.el
    this.cameraEl = document.querySelector("a-camera")
    this.activeEvent = null
  },

  tick: function () {
    if (!this.activeEvent || !this.cameraEl) {
      // Find active event if not set
      const activeEventEl = document.querySelector("[isActive]")
      if (activeEventEl) {
        this.activeEvent = activeEventEl
      } else {
        return
      }
    }

    const targetWorldPos = new THREE.Vector3()
    this.activeEvent.object3D.getWorldPosition(targetWorldPos)
    const targetLocalPos = targetWorldPos.clone()
    this.cameraEl.object3D.worldToLocal(targetLocalPos)
    const angleRad = Math.atan2(targetLocalPos.y, targetLocalPos.x)
    const angleDeg = (180 / 3.1415926535) * angleRad - 90
    this.arrowEl.setAttribute("rotation", { x: 0, y: 0, z: angleDeg })
  },
})