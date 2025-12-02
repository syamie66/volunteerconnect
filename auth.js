// auth.js
import { auth, db } from "./firebase-config.js";

// Register User
export async function registerUser(name, email, password, role) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        await db.collection("users").doc(uid).set({
            name,
            email,
            role,
            createdAt: new Date()
        });

        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Login user
export async function loginUser(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Logout user
export function logoutUser() {
    return auth.signOut();
}

// Listen for login state changes
export function onAuthStateChanged(callback) {
    auth.onAuthStateChanged(callback);
}
