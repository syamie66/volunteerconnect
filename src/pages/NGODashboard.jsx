import React, { useState } from 'react';
import { createEvent } from '../services/eventService';


export default function NGODashboard() {
const [title, setTitle] = useState('');
const [date, setDate] = useState('');
const [location, setLocation] = useState('');
const [description, setDescription] = useState('');


const handleCreate = async (e) => {
e.preventDefault();
try {
await createEvent({ title, date, location, description });
alert('Event created');
setTitle(''); setDate(''); setLocation(''); setDescription('');
} catch (err) {
alert(err.message);
}
};


return (
<section className="section">
<h2>NGO Dashboard - Create Event</h2>
<form className="form" onSubmit={handleCreate}>
<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
<input value={date} onChange={e => setDate(e.target.value)} placeholder="Date (e.g. 12 Jan 2025)" required />
<input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" required />
<textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
<button type="submit">Create Event</button>
</form>
</section>
);
}