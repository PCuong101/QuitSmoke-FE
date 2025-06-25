import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext";

// Fix lỗi 'global is not defined'
if (typeof global === "undefined") {
  window.global = window;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
