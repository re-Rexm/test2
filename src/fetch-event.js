// Mock event data - no Firebase dependency
export const mockEvents = [
  {
    id: "event1",
    eventName: "Tech Conference",
    eventBldg: "Convention Center",
    eventRm: "Hall A",
    eventTime: new Date(Date.now() + 86400000), // Tomorrow
    eventGeo: {
      latitude: 39.7862,
      longitude: -84.0684
    }
  },
  {
    id: "event2",
    eventName: "Music Festival",
    eventBldg: "City Park",
    eventRm: "Main Stage",
    eventTime: new Date(Date.now() + 172800000), // 2 days from now
    eventGeo: {
      latitude: 39.787,
      longitude: -84.0684
    }
  },
  {
    id: "event3",
    eventName: "Art Exhibition",
    eventBldg: "Museum",
    eventRm: "Gallery 3",
    eventTime: new Date(Date.now() + 259200000), // 3 days from now
    eventGeo: {
      latitude: 39.7868,
      longitude: -84.068
    }
  }
];

export async function getEventByTitle(eventTitle) {
  return mockEvents.find(event => event.eventName === eventTitle) || null;
}

export async function getAllEvents() {
  return mockEvents;
}