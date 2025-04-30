import { createContext, useContext, useState, useEffect, useCallback } from "react";

const SettingsContext = createContext({});

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await window.app.store.get();
        setSettings(settings);
        console.log("settings loaded", settings);
      } catch (error) {
        console.error("[SettingsProvider]: Error loading settings:", error);
      }
    }

    loadSettings();

    const cleanup = window.app.store.onUpdate((data) => {
      console.log("settings updated", data);
      setSettings(data);
    });

    return () => cleanup();
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    window.app.store.set("settings", newSettings);
  };

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export default SettingsProvider;
