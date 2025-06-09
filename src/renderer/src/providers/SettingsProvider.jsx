import { createContext, useContext, useState, useEffect } from "react";
import { applyTheme } from "../../../../utils/themeUtils";

const SettingsContext = createContext({});

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});

  const handleThemeChange = async (newTheme) => {
    const themeData = { current: newTheme };
    setSettings((prev) => ({ ...prev, theme: themeData }));
    applyTheme(themeData);
    await window.app.store.set("theme", themeData);
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await window.app.store.get();
        setSettings(settings);

        // Apply theme to document
        if (settings?.theme?.current) {
          applyTheme(settings.theme);
        }
      } catch (error) {
        console.error("[SettingsProvider]: Error loading settings:", error);
      }
    }

    loadSettings();

    const cleanup = window.app.store.onUpdate((data) => {
      setSettings((prev) => {
        const newSettings = { ...prev };

        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            newSettings[key] = {
              ...newSettings[key],
              ...value,
            };
          } else {
            newSettings[key] = value;
          }
        });

        if (data.theme?.current) {
          applyTheme(data.theme);
        }

        return newSettings;
      });
    });

    return () => cleanup();
  }, []);

  const updateSettings = async (key, value) => {
    try {
      setSettings((prev) => ({ ...prev, [key]: value }));
      await window.app.store.set(key, value);

      if (key === "theme" && value?.current) {
        applyTheme(value);
      }
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
    }
  };

  return <SettingsContext.Provider value={{ settings, updateSettings, handleThemeChange }}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export default SettingsProvider;
