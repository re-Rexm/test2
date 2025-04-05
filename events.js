// events.js
document.addEventListener("DOMContentLoaded", function() {
    // Base coordinates (Wright State University)
    const baseLat = 39.786495;
    const baseLng = -84.068553;
    
    // Distance in degrees 
    const offset = 0.0001;
    
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
            description: "Free food for all students!\n12PM-6PM"
        },
        {
            id: "south-event",
            name: "DANCE PARTY",
            position: {
                latitude: baseLat - offset, // South
                longitude: baseLng
            },
            color: "#9C27B0",
            description: "Campus dance night!\n8PM-12AM"
        },
        {
            id: "east-event",
            name: "MOVIE NIGHT",
            position: {
                latitude: baseLat,
                longitude: baseLng + offset // East
            },
            color: "#2196F3",
            description: "Outdoor cinema!\n7PM-11PM"
        },
        {
            id: "west-event",
            name: "ICE CREAM PARTY",
            position: {
                latitude: baseLat,
                longitude: baseLng - offset // West
            },
            color: "#FF9800",
            description: "Free ice cream!\n2PM-5PM"
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
            eventEntity.setAttribute('look-at', '[gps-new-camera]');

            // Create visual marker (box)
            const marker = document.createElement('a-box');
            marker.setAttribute('color', event.color);
            marker.setAttribute('scale', '5 5 5');
            marker.setAttribute('position', '0 0 0');
            eventEntity.appendChild(marker);

            // Create text label
            const text = document.createElement('a-text');
            text.setAttribute('value', `${event.name}\n${event.description}`);
            text.setAttribute('color', 'white');
            text.setAttribute('align', 'center');
            text.setAttribute('width', 10);
            text.setAttribute('position', '0 8 0');
            text.setAttribute('look-at', '[gps-new-camera]');
            eventEntity.appendChild(text);

            // Add to scene
            scene.appendChild(eventEntity);
        });

        // Add distance indicators to arrow text
        const arrowText = document.getElementById('arrowTxt');
        if (arrowText) {
            arrowText.setAttribute('value', 'Multiple events nearby!\nLook around to find them.');
        }
    });
});
