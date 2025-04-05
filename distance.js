AFRAME.registerComponent('distance-calc', {
  init: function () {
    this.arrowText = this.el;
    this.cameraEl = document.querySelector('a-camera');
  },

  tick: function () {
    if (!this.cameraEl || this.arrowText.getAttribute('visible') !== true) return;

    const activeText = document.querySelector('.event-text[visible="true"]');
    if (!activeText) return;

    const eventEntity = activeText.closest('a-entity');
    if (!eventEntity) return;

    const targetPos = new THREE.Vector3();
    eventEntity.object3D.getWorldPosition(targetPos);

    const cameraPos = new THREE.Vector3();
    this.cameraEl.object3D.getWorldPosition(cameraPos);

    const distance = cameraPos.distanceTo(targetPos).toFixed(2);
    this.arrowText.setAttribute('value', `Your event is this way\nDistance: ${distance}m`);
  }
});
