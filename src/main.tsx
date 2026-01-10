import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StatusBar, Style } from "@capacitor/status-bar";

document.addEventListener("deviceready", async () => {
  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch (err) {
    console.warn("StatusBar plugin error:", err);
  }
});

createRoot(document.getElementById("root")!).render(
  <div className="pt-safe">
    <App />
  </div>
);
