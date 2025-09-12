import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import SlimeCollectorApp from "./app/SlimeCollectorApp";
import { ToastProvider } from "./ui/components/Toaster";
import { hushLogsInProd } from "./lib/debug";

// Initialize logging system
hushLogsInProd();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <SlimeCollectorApp />
    </ToastProvider>
  </React.StrictMode>
);



