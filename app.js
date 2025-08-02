// Redirect if not logged in (for dashboard)
if (location.pathname.includes("dashboard.html")) {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    location.href = "index.html";
  } else {
    loadNotes();
    document.getElementById("addNoteBtn").addEventListener("click", addNote);
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      location.href = "index.html";
    });
  }
}

// Login logic
if (location.pathname.includes("index.html")) {
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) return alert("Fill all fields");

    let users = JSON.parse(localStorage.getItem("users")) || {};

    // Register user if not exists
    if (!users[username]) {
      users[username] = { password, notes: [] };
      localStorage.setItem("users", JSON.stringify(users));
    } else if (users[username].password !== password) {
      return alert("Incorrect password");
    }

    localStorage.setItem("loggedInUser", username);
    location.href = "dashboard.html";
  });
}

// Notes functions
function loadNotes() {
  const user = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users"));
  const notes = users[user].notes;

  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const noteEl = document.createElement("div");
    noteEl.className = "note";
    noteEl.innerHTML = `
      <p>${note}</p>
      <button onclick="deleteNote(${index})">×</button>
    `;
    notesList.appendChild(noteEl);
  });
}

function addNote() {
  const noteText = document.getElementById("noteText").value.trim();
  if (!noteText) return alert("Note is empty!");

  const user = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users"));

  users[user].notes.push(noteText);
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("noteText").value = "";
  loadNotes();
}

function deleteNote(index) {
  const user = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users"));

  users[user].notes.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  loadNotes();
}
