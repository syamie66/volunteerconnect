import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


export default function Register() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [role, setRole] = useState('volunteer');
const navigate = useNavigate();


const handleSubmit = async (e) => {
e.preventDefault();
try {
const uc = await createUserWithEmailAndPassword(auth, email, password);
await setDoc(doc(db, 'users', uc.user.uid), {
name,
email,
role,
createdAt: new Date()
});
navigate('/');
} catch (err) {
alert(err.message);
}
};


return (
<section className="section">
<h2>Register</h2>
<form onSubmit={handleSubmit} className="form">
<input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required />
<input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
<input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
<select value={role} onChange={e => setRole(e.target.value)}>
<option value="volunteer">Volunteer</option>
<option value="ngo">NGO</option>
</select>
<button type="submit">Create Account</button>
</form>
</section>
);
}