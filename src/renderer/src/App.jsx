import ChatPage from "./pages/ChatPage";
import SettingsProvider from "./providers/SettingsProvider";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ChatPage />
      </SettingsProvider>
    </ErrorBoundary>
  );
};

export default App;
