document.addEventListener("DOMContentLoaded", function() {
    // Base coordinates (Wright State University)
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

    scene.addEventListener('loaded', function() {
        events.forEach(event => {
            const eventEntity = document.createElement('a-entity');
            eventEntity.setAttribute('id', event.id);
            eventEntity.setAttribute('gps-entity-place', {
                latitude: event.position.latitude,
                longitude: event.position.longitude
            });

            // Create marker with correct color
            const marker = document.createElement('a-box');
            marker.setAttribute('class', 'event-marker');
            marker.setAttribute('color', event.color);
            marker.setAttribute('scale', '5 5 5');
            marker.setAttribute('position', '0 1.5 0');
            marker.setAttribute('look-at', '[gps-camera]');
            marker.setAttribute('material', 'shader: flat'); // Ensures color appears correctly
            marker.setAttribute('clickable', '');
            marker.setAttribute('visible', true);
            eventEntity.appendChild(marker);

            // Create text label
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

            // Mobile-friendly event handlers
            marker.addEventListener('click', () => handleEventClick(event.id));
            marker.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleEventClick(event.id);
            });
            text.addEventListener('click', () => handleEventClick(event.id));
            text.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleEventClick(event.id);
            });

            scene.appendChild(eventEntity);
        });
    });

    function handleEventClick(eventId) {
        const eventEntity = document.getElementById(eventId);
        if (!eventEntity) return;

        const marker = eventEntity.querySelector('.event-marker');
        const text = eventEntity.querySelector('.event-text');
        const arrow = document.getElementById('arrow');
        const arrowText = document.getElementById('arrowTxt');
        
        if (marker.getAttribute('visible') !== false) {
            // Show text view
            marker.setAttribute('visible', false);
            text.setAttribute('visible', true);
            eventEntity.removeAttribute('gps-entity-place');
            eventEntity.setAttribute('position', '0 1.5 -3');
            
            // Show arrow
            if (arrow && arrowText) {
                arrow.setAttribute('visible', true);
                arrowText.setAttribute('visible', true);
            }
        } else {
            // Show marker view
            text.setAttribute('visible', false);
            marker.setAttribute('visible', true);
            
            // Return to GPS position
            const eventData = events.find(e => e.id === eventId);
            if (eventData) {
                eventEntity.setAttribute('gps-entity-place', {
                    latitude: eventData.position.latitude,
                    longitude: eventData.position.longitude
                });
            }
            
            // Hide arrow
            if (arrow && arrowText) {
                arrow.setAttribute('visible', false);
                arrowText.setAttribute('visible', false);
            }
        }
    }
});
