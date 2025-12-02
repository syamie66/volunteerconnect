// eventService.js
import { db } from "./firebase-config.js";

// Create event
export async function createEvent(eventData) {
    return db.collection("events").add({
        ...eventData,
        createdAt: new Date()
    });
}

// Get all events
export async function getEvents() {
    return db.collection("events").orderBy("createdAt", "desc").get();
}

// Update event
export function updateEvent(eventId, updatedData) {
    return db.collection("events").doc(eventId).update(updatedData);
}

// Delete event
export function deleteEvent(eventId) {
    return db.collection("events").doc(eventId).delete();
}
