AFRAME.registerComponent('clickable', {
  init: function () {
    const handleClick = () => this.el.emit('click');
    this.el.addEventListener('click', handleClick);
    this.el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleClick();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const baseLat = 39.786495;
  const baseLng = -84.068553;
  const offset = 0.0002;

  const events = [
    {
      id: "north-event",
      name: "SPRING FOOD FESTIVAL",
      position: { latitude: baseLat + offset, longitude: baseLng },
      color: "#4CAF50",
      description: "Free food for all students!\n12PM-6PM\nLocation: Student Union"
    },
    {
      id: "south-event",
      name: "DANCE PARTY",
      position: { latitude: baseLat - offset, longitude: baseLng },
      color: "#9C27B0",
      description: "Campus dance night!\n8PM-12AM\nDJ: Campus Radio"
    },
    {
      id: "east-event",
      name: "MOVIE NIGHT",
      position: { latitude: baseLat, longitude: baseLng + offset },
      color: "#2196F3",
      description: "Outdoor cinema!\n7PM-11PM\nMovie: Avengers Endgame"
    },
    {
      id: "west-event",
      name: "ICE CREAM PARTY",
      position: { latitude: baseLat, longitude: baseLng - offset },
      color: "#FF9800",
      description: "Free ice cream!\n2PM-5PM\nFlavors: 10+ varieties"
    }
  ];

  const scene = document.querySelector('a-scene');
  if (!scene) return;

  // Add a global state to track which event is currently active
  let activeEventId = null;

  scene.addEventListener('loaded', function () {
    events.forEach(event => {
      const eventEntity = document.createElement('a-entity');
      eventEntity.setAttribute('id', event.id);
      eventEntity.setAttribute('gps-entity-place', {
        latitude: event.position.latitude,
        longitude: event.position.longitude
      });
      // Store the original gps position for later reference
      eventEntity.originalGPS = {
        latitude: event.position.latitude,
        longitude: event.position.longitude
      };

      // Create marker with proper color
      const marker = document.createElement('a-box');
      marker.setAttribute('class', 'event-marker');
      marker.setAttribute('material', `color: ${event.color}; shader: flat`);
      marker.setAttribute('scale', '5 5 5');
      marker.setAttribute('position', '0 1.5 0');
      marker.setAttribute('look-at', '[gps-camera]');
      marker.setAttribute('clickable', '');
      marker.setAttribute('visible', true);
      eventEntity.appendChild(marker);

      // Create text label - initially hidden
      const text = document.createElement('a-text');
      text.setAttribute('class', 'event-text');
      text.setAttribute('value', `${event.name}\n\n${event.description}`);
      text.setAttribute('color', 'white');
      text.setAttribute('align', 'center');
      text.setAttribute('width', 15);
      text.setAttribute('position', '0 2 0');
      text.setAttribute('scale', '2 2 2');
      text.setAttribute('visible', false);
      text.setAttribute('look-at', '[gps-camera]');
      text.setAttribute('clickable', '');
      eventEntity.appendChild(text);

      // Add event listeners for both marker and text
      marker.addEventListener('click', function() {
        showEventDetails(event.id);
      });
      
      text.addEventListener('click', function() {
        hideEventDetails();
      });

      scene.appendChild(eventEntity);
    });
  });

  // Function to show event details
  function showEventDetails(eventId) {
    console.log("showEventDetails called for", eventId);
    
    // Hide all event entities except the one clicked
    events.forEach(event => {
      const entity = document.getElementById(event.id);
      if (!entity) return;
      
      if (event.id !== eventId) {
        // Hide other event entities
        entity.setAttribute('visible', false);
      } else {
        // Show this event's text and hide its marker
        const marker = entity.querySelector('.event-marker');
        const text = entity.querySelector('.event-text');
        
        if (marker) marker.setAttribute('visible', false);
        if (text) text.setAttribute('visible', true);
        
        // Remove GPS tracking and position in front of camera
        const camera = document.querySelector('a-camera');
        
        // Store original position data if not already stored
        if (!entity.originalGPS) {
          entity.originalGPS = {
            latitude: entity.getAttribute('gps-entity-place').latitude,
            longitude: entity.getAttribute('gps-entity-place').longitude
          };
        }
        
        // Remove GPS component
        entity.removeAttribute('gps-entity-place');
        
        // Position text in front of camera
        const distance = 5; // 5 meters
        const cameraPos = new THREE.Vector3();
        const cameraDir = new THREE.Vector3();
        
        camera.object3D.getWorldPosition(cameraPos);
        camera.object3D.getWorldDirection(cameraDir);
        
        const textPos = cameraPos.clone().add(cameraDir.multiplyScalar(distance));
        
        entity.setAttribute('position', {
          x: textPos.x,
          y: textPos.y, 
          z: textPos.z
        });
        
        // Update active event
        activeEventId = eventId;
        
        // Show arrow
        const arrow = document.getElementById('arrow');
        const arrowText = document.getElementById('arrowTxt');
        
        if (arrow) arrow.setAttribute('visible', true);
        if (arrowText) arrowText.setAttribute('visible', true);
      }
    });
  }

  // Function to hide event details and restore normal view
  function hideEventDetails() {
    console.log("hideEventDetails called");
    
    // Show all event entities
    events.forEach(event => {
      const entity = document.getElementById(event.id);
      if (!entity) return;
      
      entity.setAttribute('visible', true);
      
      const marker = entity.querySelector('.event-marker');
      const text = entity.querySelector('.event-text');
      
      if (marker) marker.setAttribute('visible', true);
      if (text) text.setAttribute('visible', false);
      
      // Restore GPS position for the active event
      if (event.id === activeEventId && entity.originalGPS) {
        entity.removeAttribute('position');
        entity.setAttribute('gps-entity-place', {
          latitude: entity.originalGPS.latitude,
          longitude: entity.originalGPS.longitude
        });
      }
    });
    
    // Hide arrow
    const arrow = document.getElementById('arrow');
    const arrowText = document.getElementById('arrowTxt');
    
    if (arrow) arrow.setAttribute('visible', false);
    if (arrowText) arrowText.setAttribute('visible', false);
    
    // Clear active event
    activeEventId = null;
  }
});
