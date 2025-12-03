import {
collection,
addDoc,
getDocs,
orderBy,
query,
doc,
updateDoc,
deleteDoc,
onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';


export async function createEvent(data) {
return addDoc(collection(db, 'events'), { ...data, createdAt: new Date() });
}


export async function fetchEventsOnce() {
const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
const snap = await getDocs(q);
return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}


export function listenEvents(callback) {
const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
return onSnapshot(q, snapshot => {
const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
callback(events);
});
}


export function updateEvent(eventId, upd) {
return updateDoc(doc(db, 'events', eventId), upd);
}


export function deleteEvent(eventId) {
return deleteDoc(doc(db, 'events', eventId));
}