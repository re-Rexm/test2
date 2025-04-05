// events.js
document.addEventListener("DOMContentLoaded", function() {
    // Base coordinates (Wright State University)
    const baseLat = 39.786495;
    const baseLng = -84.068553;
    
    // Distance in degrees 
    const offset = 0.0004;
    
    // Define 4 events at cardinal directions
    const events = [
        {
            id: "north-event",
            name: "SPRING FOOD FESTIVAL",
            position: {
                latitude: baseLat + offset, // North
                longitude: baseLng
            },
            color: "#4CAF50",
            description: "Free food for all students!\n12PM-6PM\nLocation: Student Union"
        },
        {
            id: "south-event",
            name: "DANCE PARTY",
            position: {
                latitude: baseLat - offset, // South
                longitude: baseLng
            },
            color: "#9C27B0",
            description: "Campus dance night!\n8PM-12AM\nDJ: Campus Radio"
        },
        {
            id: "east-event",
            name: "MOVIE NIGHT",
            position: {
                latitude: baseLat,
                longitude: baseLng + offset // East
            },
            color: "#2196F3",
            description: "Outdoor cinema!\n7PM-11PM\nMovie: Avengers Endgame"
        },
        {
            id: "west-event",
            name: "ICE CREAM PARTY",
            position: {
                latitude: baseLat,
                longitude: baseLng - offset // West
            },
            color: "#FF9800",
            description: "Free ice cream!\n2PM-5PM\nFlavors: 10+ varieties"
        }
    ];

    // Wait for scene to load
    const scene = document.querySelector('a-scene');
    if (!scene) return;

    scene.addEventListener('loaded', function() {
        // Create event markers
        events.forEach(event => {
            // Create container entity
            const eventEntity = document.createElement('a-entity');
            eventEntity.setAttribute('id', event.id);
            eventEntity.setAttribute('gps-new-entity-place', {
                latitude: event.position.latitude,
                longitude: event.position.longitude
            });
            eventEntity.setAttribute('class', 'event-entity');

            // Create visual marker (box) - initially visible
            const marker = document.createElement('a-box');
            marker.setAttribute('class', 'event-marker');
            marker.setAttribute('color', event.color);
            marker.setAttribute('scale', '5 5 5');
            marker.setAttribute('position', '0 0 0');
            marker.setAttribute('look-at', '[gps-new-camera]');
            marker.setAttribute('data-event-id', event.id);
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
            text.setAttribute('visible', 'false');
            text.setAttribute('look-at', '[gps-new-camera]');
            text.setAttribute('data-event-id', event.id);
            eventEntity.appendChild(text);

            // Add click handler to both elements
            marker.addEventListener('click', () => toggleEventDisplay(event.id));
            text.addEventListener('click', () => toggleEventDisplay(event.id));

            // Add to scene
            scene.appendChild(eventEntity);
        });

        // Update arrow text
        const arrowText = document.getElementById('arrowTxt');
        if (arrowText) {
            arrowText.setAttribute('value', 'Look around for colored boxes\nTap to see event details');
        }
    });

    // Toggle between marker and text
    function toggleEventDisplay(eventId) {
        const eventEntity = document.getElementById(eventId);
        if (!eventEntity) return;

        const marker = eventEntity.querySelector('.event-marker');
        const text = eventEntity.querySelector('.event-text');
        
        if (marker.getAttribute('visible') !== 'false') {
            // Show text (close-up view)
            marker.setAttribute('visible', 'false');
            text.setAttribute('visible', 'true');
            
            // Move text closer to camera temporarily
            eventEntity.removeAttribute('gps-new-entity-place');
            eventEntity.setAttribute('position', '0 1.5 -3');
        } else {
            // Show marker (geo-located view)
            text.setAttribute('visible', 'false');
            marker.setAttribute('visible', 'true');
            
            // Return to original GPS position
            const eventData = events.find(e => e.id === eventId);
            if (eventData) {
                eventEntity.setAttribute('gps-new-entity-place', {
                    latitude: eventData.position.latitude,
                    longitude: eventData.position.longitude
                });
            }
        }
    }
});
