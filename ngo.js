// ngo.js
import { createEvent, updateEvent, deleteEvent } from "./eventService.js";

export async function ngoCreateEvent(title, desc, date, location, maxVolunteers) {
    return createEvent({
        title,
        desc,
        date,
        location,
        maxVolunteers,
        participants: []
    });
}

export function ngoEditEvent(eventId, newData) {
    return updateEvent(eventId, newData);
}

export function ngoDeleteEvent(eventId) {
    return deleteEvent(eventId);
}
