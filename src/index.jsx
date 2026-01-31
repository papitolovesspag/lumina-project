import React from "react";
import ReactDOM from "react-dom/client"; // Note the '/client'
import App from "./components/App";
import "./styles.css";

// 1. Find the root element in index.html
const rootElement = document.getElementById("root");

// 2. Create the React 18 Root
const root = ReactDOM.createRoot(rootElement);

// 3. Render the App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);