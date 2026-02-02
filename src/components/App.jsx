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
    // 1. Create a temporary ID (so React has a valid key immediately)
    const tempId = Date.now(); 
    const optimisticNote = { ...newNote, id: tempId, clientId: tempId };

    // 2. Add to UI (React uses tempId as the key)
    setNotes((prev) => [...prev, optimisticNote]);

    // 3. Send to Server
    axios.post(`${API_URL}/notes`, newNote, authHeader)
      .then((res) => {
        // 4. When server responds, SWAP the tempId with the real DB id
        setNotes((prev) => prev.map(n => {
           // If this is our temporary note, update it with real data
           return n.id === tempId ? { ...res.data, clientId: tempId } : n;
        }));
      })
      .catch((err) => {
        console.log("Error saving note", err);
        setNotes(prev => prev.filter(n => n.id !== tempId));
      });
  }

  function deleteNote(id) {
    // 1. Optimistic UI: Remove from Screen immediately
    // We filter out the note where the note.id matches the id we clicked
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem) => noteItem.id !== id);
    });

    // 2. Send Delete Request to Database
    axios.delete(`${API_URL}/notes/${id}`, authHeader)
      .catch((err) => console.log("Error deleting note", err));
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
                  key={noteItem.clientId || noteItem.id}
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