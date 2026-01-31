import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import API_URL from "../config";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Auth from "./Auth";
import { AnimatePresence } from "framer-motion";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [notes, setNotes] = useState([]);

  // --- API CONFIG ---
  // This helper adds the Token to every request we send
  const authHeader = { headers: { Authorization: token } };

  // --- EFFECT: Load Notes when Token changes ---
  useEffect(() => {
    if (token) {
      axios.get(`${API_URL}/notes`, authHeader)
        .then((res) => setNotes(res.data))
        .catch((err) => console.log("Error fetching notes"));
    }
  }, [token]);

  // --- ACTIONS ---

  function handleLogin(newToken) {
    setToken(newToken);
    localStorage.setItem("token", newToken); // Save for refresh
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
    setNotes([]);
  }

  function addNote(newNote) {
    // Optimistic UI: Update screen instantly
    setNotes((prev) => [...prev, newNote]);

    // Send to Database
    axios.post(`${API_URL}/notes`, newNote, authHeader)
      .then((res) => {
        // Replace the temporary note with the real one (including ID)
        setNotes((prev) => prev.map(n => n === newNote ? res.data : n));
      })
      .catch((err) => console.log("Error saving note"));
  }

  function deleteNote(id) {
    // 1. Find the Note's real database ID
    const noteToDelete = notes[id];
    const dbId = noteToDelete.id;

    // 2. Remove from Screen
    setNotes((prev) => prev.filter((item, index) => index !== id));

    // 3. Remove from Database
    if (dbId) {
      axios.delete(`${API_URL}/notes/${dbId}`, authHeader);
    }
  }

  // EDIT NOTE FUNCTION
  async function editNote(id, newTitle, newContent) {
    try {
      const url = `${API_URL}/edit/${id}`;
      await axios.put(url, { title: newTitle, content: newContent }, authHeader);
      
      // Update the UI locally (so we don't have to refresh)
      setNotes(prevNotes => {
        return prevNotes.map(note => {
          if (note.id === id) {
            return { ...note, title: newTitle, content: newContent };
          }
          return note;
        });
      });
    } catch (err) {
      console.log("Error updating note:", err);
    }
  }

  return (
    <div>
      <Header isAuth={!!token} onLogout={handleLogout} />
      
      {!token ? (
        // SCENE 1: LOGIN
        <Auth onLogin={handleLogin} />
      ) : (
        // SCENE 2: NOTES
        <>
          
          <CreateArea onAdd={addNote} />
          <div className="notes-container">
            <AnimatePresence>
              {notes.map((noteItem, index) => (
                <Note
                  key={noteItem.id}
                  id={noteItem.id}
                  title={noteItem.title}
                  content={noteItem.content}
                  onDelete={deleteNote}
                  onEdit={editNote}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;