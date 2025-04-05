AFRAME.registerComponent('arrow-pointer', {
  init: function () {
    this.arrowEl = this.el;
    this.cameraEl = document.querySelector('a-camera');
    this.targetPos = new THREE.Vector3();
  },

  tick: function () {
    if (!this.cameraEl || this.arrowEl.getAttribute('visible') !== true) return;

    const activeText = document.querySelector('.event-text[visible="true"]');
    if (!activeText) return;

    const eventEntity = activeText.closest('a-entity');
    if (!eventEntity) return;

    eventEntity.object3D.getWorldPosition(this.targetPos);

    const cameraWorldPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraWorldPos);

    const direction = new THREE.Vector3();
    direction.subVectors(this.targetPos, cameraWorldPos).normalize();
    this.cameraEl.object3D.worldToLocal(direction);

    const angle = Math.atan2(direction.x, direction.z);
    this.arrowEl.setAttribute('rotation', {
      x: 0,
      y: 0,
      z: THREE.Math.radToDeg(angle)
    });
  }
});
