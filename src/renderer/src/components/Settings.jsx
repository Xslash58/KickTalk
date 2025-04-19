import { useState, useEffect } from "react";
import "../styles/Settings.css";
import clsx from "clsx";
import { Check, CheckFat } from "@phosphor-icons/react";

const Settings = ({ settingsModalOpen }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    (async function loadSettings() {
      try {
        const userSettings = await window.app.loadSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    })();
  }, []);

  const changeSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      await window.app.editSettings({ [key]: value });
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save setting:", error);
    }
  };

  const handlePhraseAdd = (phrase) => {
    if (phrase && !settings.notificationPhrases.includes(phrase)) {
      changeSetting("notificationPhrases", [...settings.notificationPhrases, phrase]);
    }
  };

  const handlePhraseRemove = (phrase) => {
    changeSetting(
      "notificationPhrases",
      settings.notificationPhrases.filter((p) => p !== phrase),
    );
  };

  return (
    <div className={clsx("settingsWrapper", settingsModalOpen && "show")}>
      <div className="settingsHead">
        <h4>Settings</h4>
      </div>

      <span className="settingsDivider" />

      <div className="settingsSection settingsCosmetics">
        <h5>Emotes & Badges</h5>

        <div className="settingsSwitch">
          <button
            className={clsx("settingSwitchItem", settings?.load7TVEmotes ? "checked" : "")}
            onClick={() => changeSetting("load7TVEmotes", !settings?.load7TVEmotes)}>
            <div className="checkBox">{settings?.load7TVEmotes && <Check weight={"bold"} size={14} />}</div>
            <span>7TV Emotes</span>
          </button>
        </div>
        <div className="settingsSwitch">
          <button
            className={clsx("settingSwitchItem", settings?.load7TVBadges ? "checked" : "")}
            onClick={() => changeSetting("load7TVBadges", !settings?.load7TVBadges)}>
            <div className="checkBox">{settings?.load7TVBadges && <Check weight={"bold"} size={14} />}</div>
            <span>7TV Badges</span>
          </button>
        </div>
        <div className="settingsSwitch">
          <button
            className={clsx("settingSwitchItem", settings?.load7TVPaints ? "checked" : "")}
            onClick={() => changeSetting("load7TVPaints", !settings?.load7TVPaints)}>
            <div className="checkBox">{settings?.load7TVPaints && <Check weight={"bold"} size={14} />}</div>
            <span>7TV Paints</span>
          </button>
        </div>
      </div>

      <span className="settingsDivider" />

      <div className="settingsSection notifications">
        <h5>Notifications</h5>

        <div className="notificationOptions"></div>
      </div>

      <span className="settingsDivider" />

      <div className="settingsSection notificationPhrases">
        <h5>Highlight Phrases</h5>

        <div className="highlightPhrases">
          {settings?.notificationPhrases.map((phrase) => (
            <div key={phrase} className="highlightPhrase">
              <span>{phrase}</span>
              <button onClick={() => handlePhraseRemove(phrase)}>&times;</button>
            </div>
          ))}
        </div>

        <div className="highlightAddPhrase">
          <input
            type="text"
            placeholder="Add new phrase..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePhraseAdd(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
