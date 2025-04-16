AFRAME.registerComponent('distance-calc', {
  init: function () {
    this.arrowText = this.el;
    this.cameraEl = document.querySelector('[gps-camera]');
  },

  tick: function () {
    if (!this.cameraEl || this.arrowText.getAttribute('visible') !== true) return;

    const activeText = document.querySelector('.event-text[visible="true"]');
    if (!activeText) return;

    const eventEntity = activeText.closest('a-entity');
    if (!eventEntity || !eventEntity.originalGPS) return;
    
    // Get the event's original GPS location
    const eventLat = eventEntity.originalGPS.latitude;
    const eventLng = eventEntity.originalGPS.longitude;
    
    // Get current camera position
    const cameraPosition = this.cameraEl.components['gps-camera'].getCurrentPosition();
    if (!cameraPosition) return;
    
    // Calculate distance using Haversine formula
    const distance = this.calculateDistance(
      cameraPosition.latitude,
      cameraPosition.longitude,
      eventLat,
      eventLng
    );
    
    // Update text
    this.arrowText.setAttribute('value', `Your event is this way\nDistance: ${distance.toFixed(2)}m`);
  },
  
  calculateDistance: function(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }
});
