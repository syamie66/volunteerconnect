import React from 'react';
import { useAuth } from '../contexts/AuthContext';


export default function Dashboard() {
const { profile } = useAuth();
return (
<section className="section">
<h2>Dashboard</h2>
<p>Welcome, {profile?.name || 'Volunteer'}</p>
<p>Role: {profile?.role}</p>
</section>
);
}