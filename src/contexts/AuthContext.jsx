import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';


const AuthContext = createContext();


export function useAuth() {
return useContext(AuthContext);
}


export function AuthProvider({ children }) {
const [currentUser, setCurrentUser] = useState(null);
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);


useEffect(() => {
const unsub = onAuthStateChanged(auth, async (user) => {
setCurrentUser(user);
if (user) {
const ref = doc(db, 'users', user.uid);
const snap = await getDoc(ref);
if (snap.exists()) setProfile(snap.data());
else setProfile(null);
} else {
setProfile(null);
}
setLoading(false);
});


return () => unsub();
}, []);


const logout = () => signOut(auth);


const value = { currentUser, profile, loading, logout };


return (
<AuthContext.Provider value={value}>
{!loading && children}
</AuthContext.Provider>
);
}