import { HashRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./providers/ChatProvider";
import ChatPage from "./pages/ChatPage";
import Settings from "./components/Settings";

function App() {
  return (
    <ChatProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/dialog/settings" element={<Settings />} />
        </Routes>
      </HashRouter>
    </ChatProvider>
  );
}

export default App;
