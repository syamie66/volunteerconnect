import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; 

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // 1. Fetch from the single 'users' collection
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            console.log("No profile found for this user.");
            // OPTIONAL: If you want to auto-logout deleted users who are already verified by session:
            // await signOut(auth); 
            setProfile(null);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // --- AUTH FUNCTIONS ---

  // 1. Standard Register (For Volunteers)
  const register = async (email, password, fullName = '') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create the Volunteer document in 'users'
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        fullName: fullName,
        userType: 'Volunteer', 
        createdAt: serverTimestamp(),
      });

      return user;
    } catch (err) {
      throw err;
    }
  };

  // 2. Register specifically for NGOs
  const registerNGO = async (email, password, additionalData) => {
    try {
      // Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save NGO details to 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        userType: 'NGO',
        createdAt: serverTimestamp(),
        ...additionalData 
      });

      // Manually set profile state immediately
      setProfile({
        uid: user.uid,
        email: email,
        userType: 'NGO',
        createdAt: new Date(),
        ...additionalData
      });

      return user;
    } catch (err) {
      console.error('Error registering NGO:', err);
      throw err;
    }
  };

  // Login - UPDATED TO CHECK FOR DELETED ACCOUNTS
  const login = async (email, password) => {
    try {
      // 1. Auth Check
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Firestore Existence Check (Enforce "Deleted Users Can't Login")
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await signOut(auth); // Force logout immediately
        throw new Error("This account has been permanently deleted by the administrator.");
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setCurrentUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const value = { 
    currentUser, 
    profile, 
    register, 
    registerNGO, 
    login, 
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}