import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext({});

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await window.app.store.get();
        setSettings(settings);
      } catch (error) {
        console.error("[SettingsProvider]: Error loading settings:", error);
      }
    }

    loadSettings();

    const cleanup = window.app.store.onUpdate((data) => {
      setSettings((prev) => {
        const newSettings = { ...prev };

        Object.entries(data).forEach(([key, value]) => {
          newSettings[key] = value;
        });

        return newSettings;
      });
    });

    return () => cleanup();
  }, []);

  const updateSettings = async (key, value) => {
    window.app.store.set(key, value);
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
