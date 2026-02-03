import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

// NEW IMPORTS FOR DIALOG
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State for the popup
  
  const [note, setNote] = useState({
    title: props.title,
    content: props.content
  });

  // 1. User Clicks Trash Icon -> Open Dialog
  function handleDeleteClick() {
    setOpenDialog(true);
  }

  // 2. User Clicks "Yes, Delete" -> Actually Delete
  function handleConfirmDelete() {
    props.onDelete(props.id);
    setOpenDialog(false);
  }

  // 3. User Clicks "Cancel" -> Close Dialog
  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    props.onEdit(props.id, note.title, note.content);
    setIsEditing(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setNote(prevNote => ({
      ...prevNote,
      [name]: value
    }));
  }

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
            <button onClick={handleDeleteClick}> {/* CHANGED TO OPEN DIALOG */}
              <DeleteIcon />
            </button>
          </div>
        </div>
      )}
    </motion.div>

    {/* --- DELETE CONFIRMATION POPUP --- */}
    <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "rgba(30, 30, 30, 0.95)", // Dark theme to match Lumina
            color: "white",
            borderRadius: "15px",
            border: "1px solid rgba(255,255,255,0.1)"
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontFamily: "McLaren", color: "#f5ba13" }}>
          {"Delete this note?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Are you sure you want to delete <strong>"{props.title}"</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
            No, Cancel
          </Button>
          <Button onClick={handleConfirmDelete} sx={{ color: "#ff4444", fontWeight: "bold" }} autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default Note;