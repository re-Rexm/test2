// distance.js
AFRAME.registerComponent("distance-calc", {
  init: function () {
    this.arrowText = this.el
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
    const cameraPos = new THREE.Vector3()
    this.cameraEl.object3D.getWorldPosition(cameraPos)
    let dist = cameraPos.manhattanDistanceTo(targetWorldPos)
    dist = dist.toFixed(2)
    this.arrowText.setAttribute(
      "value",
      `Your event is this way.\nDistance: ${dist}m`
    )
  },
})