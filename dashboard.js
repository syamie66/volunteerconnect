// dashboard.js
import { auth, db } from "./firebase-config.js";

export async function loadDashboard(role) {
    const uid = auth.currentUser.uid;
    const userRef = await db.collection("users").doc(uid).get();
    const userData = userRef.data();

    if (role === "volunteer") {
        return loadVolunteerDashboard(uid);
    }
    if (role === "ngo") {
        return loadNGODashboard(uid);
    }
    if (role === "admin") {
        return loadAdminDashboard();
    }
}

async function loadVolunteerDashboard(uid) {
    return "Volunteer Dashboard Loaded.";
}

async function loadNGODashboard(uid) {
    return "NGO Dashboard Loaded.";
}

async function loadAdminDashboard() {
    return "Admin Dashboard Loaded.";
}
