import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AnalysisProvider } from "../src/components/Datacontext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <AnalysisProvider> */}
      <App />
    {/* </AnalysisProvider> */}
  </React.StrictMode>
);
