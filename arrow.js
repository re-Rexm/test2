AFRAME.registerComponent('arrow-pointer', {
  init: function () {
    this.arrowEl = this.el;
    this.cameraEl = document.querySelector('a-camera');
    this.targetPos = new THREE.Vector3();
    this.cameraWorldPos = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.cameraForward = new THREE.Vector3();
  },

  tick: function () {
    if (!this.cameraEl || this.arrowEl.getAttribute('visible') !== true) return;

    const activeText = document.querySelector('.event-text[visible="true"]');
    if (!activeText) return;

    const eventEntity = activeText.closest('a-entity');
    if (!eventEntity || !eventEntity.originalGPS) return;
    
    // Get the original GPS location and compute the direction to it
    const originalLat = eventEntity.originalGPS.latitude;
    const originalLng = eventEntity.originalGPS.longitude;
    
    // Get current camera position
    const camera = document.querySelector('[gps-camera]');
    if (!camera) return;
    
    const cameraPosition = camera.components['gps-camera'].getCurrentPosition();
    if (!cameraPosition) return;
    
    // Calculate the bearing to the target
    const bearing = this.calculateBearing(
      cameraPosition.latitude, 
      cameraPosition.longitude,
      originalLat,
      originalLng
    );
    
    // Get camera's rotation around the y-axis (heading)
    const cameraRotation = camera.getAttribute('rotation');
    const cameraHeading = cameraRotation.y;
    
    // Calculate the difference between target bearing and camera heading
    // This gives us the relative angle to rotate the arrow
    let relativeBearing = bearing - cameraHeading;
    
    // Normalize to -180 to 180 degrees
    if (relativeBearing > 180) relativeBearing -= 360;
    if (relativeBearing < -180) relativeBearing += 360;
    
    // Rotate the arrow to point in the correct direction
    this.arrowEl.setAttribute('rotation', {
      x: 0,
      y: relativeBearing,
      z: 0
    });
  },
  
  calculateBearing: function(lat1, lon1, lat2, lon2) {
    // Convert to radians
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const λ1 = lon1 * Math.PI / 180;
    const λ2 = lon2 * Math.PI / 180;
    
    // Calculate the bearing
    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - 
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
    const θ = Math.atan2(y, x);
    
    // Convert to degrees
    return (θ * 180 / Math.PI + 360) % 360;
  }
});
