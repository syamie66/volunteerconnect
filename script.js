// SECTION SWITCHING
const homeSection = document.getElementById("homeSection");
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const eventsSection = document.getElementById("eventsSection");

document.getElementById("navHome").onclick = () => showSection(homeSection);
document.getElementById("navLogin").onclick = () => showSection(loginSection);
document.getElementById("navEvents").onclick = () => showSection(eventsSection);

document.getElementById("showRegister").onclick = () => showSection(registerSection);
document.getElementById("showLogin").onclick = () => showSection(loginSection);

function showSection(section) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    section.classList.add("active");
}

// SAMPLE EVENT DATA (Replace later with Firebase)
const eventData = [
    { title: "Beach Cleaning", date: "12 Jan 2025", location: "Batu Ferringhi" },
    { title: "Food Distribution", date: "20 Jan 2025", location: "Georgetown" },
    { title: "Teaching Kids", date: "28 Jan 2025", location: "Balik Pulau" }
];

// RENDER EVENTS
const eventsContainer = document.getElementById("eventsContainer");
eventData.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
        <h3>${ev.title}</h3>
        <p><strong>Date:</strong> ${ev.date}</p>
        <p><strong>Location:</strong> ${ev.location}</p>
    `;
    eventsContainer.appendChild(card);
});


// -------------------------------------
// 🔥 FIREBASE INITIALIZATION (EMPTY TEMPLATE)
// -------------------------------------

// Copy your Firebase config here ↓
/*
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
*/

// LOGIN HANDLER
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Login function will be connected to Firebase soon.");
});

// REGISTER HANDLER
document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Registration will be connected to Firebase soon.");
});
