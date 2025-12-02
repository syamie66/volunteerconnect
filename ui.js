// ui.js

export function showPage(pageId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}

export function showMessage(msg, type = "success") {
    alert(`${type.toUpperCase()}: ${msg}`);
}
