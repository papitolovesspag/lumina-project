import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";
import LogoutIcon from "@mui/icons-material/Logout"; // The Power Button
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function Header(props) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {/* LEFT SIDE: LOGO */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <HighlightIcon fontSize="large" style={{ color: "#f5ba13" }} />
        <h1>Lumina</h1>
      </div>

      {/* RIGHT SIDE: LOGOUT (Only show if logged in) */}
      {props.isAuth && (
        <Tooltip title="Logout">
          <IconButton 
            onClick={props.onLogout} 
            sx={{ 
              color: "rgba(255,255,255,0.7)", 
              "&:hover": { 
                color: "#ff4444", 
                background: "rgba(255,68,68,0.1)" 
              } 
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      )}
    </header>
  );
}

export default Header;