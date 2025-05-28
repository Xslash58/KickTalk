import "../assets/styles/main.scss";
import "../assets/styles/dialogs/Chatters.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import Settings from "../components/Dialogs/Settings";
import SettingsProvider from "../providers/SettingsProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SettingsProvider>
    <Settings />
  </SettingsProvider>,
);
