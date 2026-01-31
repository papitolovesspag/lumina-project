import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import API_URL from "../config";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Auth(props) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false); // UI: Loading State
  const [user, setUser] = useState({ email: "", password: "" });
  
  // UI: Notification State
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  function showToast(message, severity) {
    setToast({ open: true, message, severity });
  }

  function handleCloseToast() {
    setToast((prev) => ({ ...prev, open: false }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    // 1. Basic Validation (Don't bother server if empty)
    if (!user.email || !user.password) {
      showToast("Please fill in all fields", "warning");
      return;
    }

    setLoading(true); // Start Spinner
    const endpoint = isLogin ? "/login" : "/register";
    const url = `${API_URL}${endpoint}`;

    try {
      const response = await axios.post(url, user);
      
      if (isLogin) {
        showToast("Login Successful!", "success");
        // Tiny delay so user sees the success message before screen swap
        setTimeout(() => props.onLogin(response.data.token), 500);
      } else {
        setIsLogin(true);
        showToast("Registration successful! Please log in.", "success");
        setUser({ email: "", password: "" }); // Clear form
      }
    } catch (err) {
      console.error("Auth Error:", err);
      // specific error message or generic fallback
      const errorMsg = err.response?.data?.error || "Connection Failed. Is Server Running?";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false); // Stop Spinner
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh", // Changed to minHeight for mobile
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          background: "rgba(255, 255, 255, 0.05)", // Darker glass
          backdropFilter: "blur(20px)", // Stronger blur
          padding: "40px",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" color="white" sx={{ fontFamily: "McLaren", mb: 1 }}>
          {isLogin ? "Welcome Back" : "Join Lumina"}
        </Typography>

        <TextField
          name="email"
          label="Email Address"
          variant="outlined"
          onChange={handleChange}
          value={user.email}
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#f5ba13" },
              "&.Mui-focused fieldset": { borderColor: "#f5ba13" },
            },
          }}
        />

        <TextField
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          onChange={handleChange}
          value={user.password}
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#f5ba13" },
              "&.Mui-focused fieldset": { borderColor: "#f5ba13" },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            bgcolor: "#f5ba13",
            color: "#fff",
            fontWeight: "bold",
            py: 1.5,
            fontSize: "1.1rem",
            "&:hover": { bgcolor: "#ffcc00" },
            fontFamily: "McLaren",
            textTransform: "none"
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : (isLogin ? "Log In" : "Create Account")}
        </Button>

        <Button
          onClick={() => setIsLogin(!isLogin)}
          sx={{ color: "rgba(255,255,255,0.5)", textTransform: "none", fontSize: "0.9rem" }}
        >
          {isLogin ? "Need an account? Sign up" : "Have an account? Log in"}
        </Button>
      </Box>

      {/* ERROR / SUCCESS TOAST */}
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}

export default Auth;