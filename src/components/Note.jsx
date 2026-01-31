import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="note"
    >
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleClick}>
        <DeleteIcon />
      </button>
    </motion.div>
  );
}

export default Note;