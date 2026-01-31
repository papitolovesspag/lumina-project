import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit"; // Import Pencil Icon
import SaveIcon from "@mui/icons-material/Save"; // Import Save Icon

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Temporary state for typing
  const [note, setNote] = useState({
    title: props.title,
    content: props.content
  });

  function handleDelete() {
    props.onDelete(props.id);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    props.onEdit(props.id, note.title, note.content); // Send to App.jsx
    setIsEditing(false); // Switch back to View Mode
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setNote(prevNote => ({
      ...prevNote,
      [name]: value
    }));
  }

  return (
    <motion.div
  layout
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.5 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }} // Snappy but smooth
  className={`note ${isEditing ? "editing" : ""}`}
>
      {isEditing ? (
        // --- EDIT MODE ---
        <div>
          <input 
            name="title" 
            value={note.title} 
            onChange={handleChange} 
            className="edit-input" 
            autoFocus 
          />
          <textarea 
            name="content" 
            value={note.content} 
            onChange={handleChange} 
            className="edit-textarea"
          />
          <div className="note-footer">
            <button onClick={handleSave} style={{ color: "#4caf50" }}>
              <SaveIcon />
            </button>
          </div>
        </div>
      ) : (
        // --- VIEW MODE ---
        <div>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          <div className="note-footer">
            <button onClick={handleEdit}>
              <EditIcon />
            </button>
            <button onClick={handleDelete}>
              <DeleteIcon />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
export default Note;