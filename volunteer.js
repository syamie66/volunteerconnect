// volunteer.js
import { db, auth } from "./firebase-config.js";

// Register for event
export async function joinEvent(eventId) {
    const uid = auth.currentUser.uid;

    await db.collection("events").doc(eventId).update({
        participants: firebase.firestore.FieldValue.arrayUnion(uid)
    });
}

// Cancel event participation
export async function leaveEvent(eventId) {
    const uid = auth.currentUser.uid;

    await db.collection("events").doc(eventId).update({
        participants: firebase.firestore.FieldValue.arrayRemove(uid)
    });
}
