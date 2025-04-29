import { HashRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Settings from "./components/Settings";
import SettingsProvider from "./providers/SettingsProvider";

function App() {
  return (
    <SettingsProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/dialog/settings" element={<Settings />} />
        </Routes>
      </HashRouter>
    </SettingsProvider>
  );
}

export default App;
