import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Mount function to be used by the Shell App (Angular)
export const mount = (el: HTMLElement): (() => void) => {
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Return unmount function for cleanup
  return () => {
    root.unmount();
  };
};
