AFRAME.registerComponent('clickable', {
  init: function () {
    // Use a simpler approach by directly handling touch events
    const el = this.el;
    const handleTap = () => {
      console.log("Element tapped:", el.id || el.className);
      el.emit('tap');
    };

    // Add both click and touch events for broader compatibility
    el.addEventListener('click', handleTap);
    el.addEventListener('touchend', function(e) {
      e.preventDefault();
      console.log("Touch ended on element");
      handleTap();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
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

  // Global state for active event
  let activeEventId = null;

  // Wait for scene to load
  const scene = document.querySelector('a-scene');
  if (!scene) {
    console.error("No A-Frame scene found!");
    return;
  }

  if (scene.hasLoaded) {
    console.log("Scene already loaded, initializing events");
    initializeEvents();
  } else {
    console.log("Waiting for scene to load");
    scene.addEventListener('loaded', function() {
      console.log("Scene loaded event fired, initializing events");
      initializeEvents();
    });
  }

  function initializeEvents() {
    console.log("Initializing events");
    events.forEach(event => {
      console.log("Creating event:", event.id);
      
      // Create main entity container
      const eventEntity = document.createElement('a-entity');
      eventEntity.setAttribute('id', event.id);
      eventEntity.setAttribute('gps-entity-place', {
        latitude: event.position.latitude,
        longitude: event.position.longitude
      });
      
      // Store original GPS for reference
      eventEntity.originalGPS = {
        latitude: event.position.latitude,
        longitude: event.position.longitude
      };

      // Create the box marker
      const marker = document.createElement('a-box');
      marker.setAttribute('id', `marker-${event.id}`);
      marker.setAttribute('class', 'event-marker');
      marker.setAttribute('material', `color: ${event.color}; shader: flat`);
      marker.setAttribute('scale', '5 5 5');
      marker.setAttribute('position', '0 1.5 0');
      marker.setAttribute('look-at', '[gps-camera]');
      marker.setAttribute('clickable', '');
      eventEntity.appendChild(marker);

      // Create the text description
      const text = document.createElement('a-text');
      text.setAttribute('id', `text-${event.id}`);
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

      // Add to scene
      scene.appendChild(eventEntity);
      
      // Add direct event listeners after appending to scene
      console.log("Adding event listeners for", event.id);
      
      // Add explicit tap handler to marker
      marker.addEventListener('tap', function() {
        console.log(`Marker for ${event.id} tapped`);
        showEventDetails(event.id);
      });

      // Direct DOM event for backup
      marker.addEventListener('click', function() {
        console.log(`Marker for ${event.id} clicked`);
        showEventDetails(event.id);
      });
      
      marker.addEventListener('touchend', function(e) {
        e.preventDefault();
        console.log(`Marker for ${event.id} touched`);
        showEventDetails(event.id);
      });
      
      // Add event listener to text for back functionality
      text.addEventListener('tap', function() {
        console.log(`Text for ${event.id} tapped`);
        hideEventDetails();
      });
      
      text.addEventListener('click', function() {
        console.log(`Text for ${event.id} clicked`);
        hideEventDetails();
      });
      
      text.addEventListener('touchend', function(e) {
        e.preventDefault();
        console.log(`Text for ${event.id} touched`);
        hideEventDetails();
      });
    });

    console.log("All events initialized");
  }

  function showEventDetails(eventId) {
    console.log("Showing details for event:", eventId);
    
    // First hide all markers
    events.forEach(event => {
      const entity = document.getElementById(event.id);
      if (!entity) {
        console.warn(`Could not find entity for ${event.id}`);
        return;
      }
      
      if (event.id !== eventId) {
        // Hide other events
        entity.setAttribute('visible', false);
      }
    });
    
    // Show details for selected event
    const selectedEntity = document.getElementById(eventId);
    if (!selectedEntity) {
      console.error(`Could not find entity for ${eventId}`);
      return;
    }
    
    const marker = selectedEntity.querySelector('.event-marker');
    const text = selectedEntity.querySelector('.event-text');
    
    if (!marker || !text) {
      console.error(`Could not find marker or text for ${eventId}`);
      return;
    }
    
    // Hide marker, show text
    marker.setAttribute('visible', false);
    text.setAttribute('visible', true);
    
    // Store original GPS if not already stored
    if (!selectedEntity.originalGPS) {
      selectedEntity.originalGPS = {
        latitude: selectedEntity.getAttribute('gps-entity-place').latitude,
        longitude: selectedEntity.getAttribute('gps-entity-place').longitude
      };
    }
    
    // Position in front of camera
    const camera = document.querySelector('a-camera');
    if (!camera) {
      console.error("Camera not found!");
      return;
    }
    
    // Remove GPS component to allow manual positioning
    selectedEntity.removeAttribute('gps-entity-place');
    
    // Position text in front of camera
    const distanceInFront = 5; // 5 meters in front
    
    // Get camera position and direction
    const cameraPosition = new THREE.Vector3();
    camera.object3D.getWorldPosition(cameraPosition);
    
    // Calculate forward direction from camera rotation
    const rotation = camera.object3D.rotation;
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.object3D.quaternion);
    
    // Calculate position in front of camera
    const targetPosition = new THREE.Vector3();
    targetPosition.copy(cameraPosition).add(forward.multiplyScalar(distanceInFront));
    
    // Set position directly
    selectedEntity.setAttribute('position', {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z
    });
    
    // Update active event ID
    activeEventId = eventId;
    
    // Show arrow pointer
    const arrow = document.getElementById('arrow');
    const arrowText = document.getElementById('arrowTxt');
    
    if (arrow) {
      arrow.setAttribute('visible', true);
      console.log("Arrow set to visible");
    } else {
      console.warn("Arrow element not found");
    }
    
    if (arrowText) {
      arrowText.setAttribute('visible', true);
      console.log("Arrow text set to visible");
    } else {
      console.warn("Arrow text element not found");
    }
  }

  function hideEventDetails() {
    console.log("Hiding event details, active event was:", activeEventId);
    
    if (!activeEventId) {
      console.warn("No active event to hide");
      return;
    }
    
    // Get the active entity
    const activeEntity = document.getElementById(activeEventId);
    if (!activeEntity) {
      console.error(`Active entity ${activeEventId} not found`);
      return;
    }
    
    const marker = activeEntity.querySelector('.event-marker');
    const text = activeEntity.querySelector('.event-text');
    
    if (!marker || !text) {
      console.error(`Could not find marker or text for ${activeEventId}`);
      return;
    }
    
    // Hide text, show marker
    text.setAttribute('visible', false);
    marker.setAttribute('visible', true);
    
    // Remove manual position
    activeEntity.removeAttribute('position');
    
    // Restore GPS position
    if (activeEntity.originalGPS) {
      activeEntity.setAttribute('gps-entity-place', {
        latitude: activeEntity.originalGPS.latitude,
        longitude: activeEntity.originalGPS.longitude
      });
    } else {
      console.warn(`No original GPS data for ${activeEventId}`);
    }
    
    // Show all events again
    events.forEach(event => {
      const entity = document.getElementById(event.id);
      if (entity) {
        entity.setAttribute('visible', true);
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
