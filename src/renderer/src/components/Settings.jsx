import { useState, useEffect } from "react";
import "../styles/Settings.css";
import clsx from "clsx";
import { Check, SignOut } from "@phosphor-icons/react";

// TODO: Click away to close settings dropdown
const Settings = ({ settingsModalOpen }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      const settingsStore = await window.app.store.get();
      setSettings(settingsStore);
    };

    loadSettings();
  }, []);

  const changeSetting = async (key, value) => {
    try {
      await window.app.store.set(key, value);
      setSettings(await window.app.store.get());
    } catch (error) {
      console.error("Failed to save setting:", error);
    }
  };

  const handlePhraseAdd = (phrase) => {
    if (phrase && !settings?.notifications?.phrases.includes(phrase)) {
      changeSetting("notifications.phrases", [...settings?.notifications?.phrases, phrase]);
    }
  };

  const handlePhraseRemove = (phrase) => {
    changeSetting(
      "notifications.phrases",
      settings?.notifications?.phrases.filter((p) => p !== phrase),
    );
  };

  const handleLogout = () => {
    window.app.logout();
  };

  return (
    <div className={clsx("settingsWrapper", settingsModalOpen && "show")}>
      <div className="settingsHead">
        <h4>Settings</h4>
        <button onClick={handleLogout}>
          <SignOut size={20} weight="bold" />
        </button>
      </div>

      <span className="settingsDivider" />

      <div className="settingsSection settingsCosmetics">
        <h5>Emotes & Badges</h5>

        <div className="settingsSwitch">
          <button
            className={clsx("settingSwitchItem", settings?.sevenTV?.emotes ? "checked" : "")}
            onClick={() =>
              changeSetting("sevenTV", {
                ...settings?.sevenTV,
                emotes: !settings?.sevenTV?.emotes,
              })
            }>
            <div className="checkBox">{settings?.sevenTV?.emotes && <Check weight={"bold"} size={14} />}</div>
            <span>7TV Emotes</span>
          </button>
        </div>
      </div>

      <span className="settingsDivider" />

      <div className="settingsSection chatroomSettings">
        <h5>Chatroom Settings</h5>

        <div className="chatroomSettingsOptions">
          <div className="chatroomSetting">
            <button
              className={clsx("settingSwitchItem", settings?.chatrooms?.showModActions ? "checked" : "")}
              onClick={() =>
                changeSetting("chatrooms", {
                  ...settings?.chatrooms,
                  showModActions: !settings?.chatrooms?.showModActions,
                })
              }>
              <div className="checkBox">{settings?.chatrooms?.showModActions && <Check weight={"bold"} size={14} />}</div>
              <span>Show Mod Actions</span>
            </button>
          </div>
        </div>
      </div>

      <span className="settingsDivider" />

      <div className="settingsSection notifications">
        <h5>Notifications</h5>

        <div className="notificationOptions">
          <div className="notificationSetting">
            <button
              className={clsx("settingSwitchItem", settings?.notifications?.enabled ? "checked" : "")}
              onClick={() =>
                changeSetting("notifications", {
                  ...settings?.notifications,
                  enabled: !settings?.notifications?.enabled,
                })
              }>
              <div className="checkBox">{settings?.notifications?.enabled && <Check weight={"bold"} size={14} />}</div>
              <span>Enable Notifications</span>
            </button>
          </div>
          <div className="notificationSetting">
            <button
              className={clsx("settingSwitchItem", settings?.notifications?.sound ? "checked" : "")}
              onClick={() =>
                changeSetting("notifications", {
                  ...settings?.notifications,
                  sound: !settings?.notifications?.sound,
                })
              }>
              <div className="checkBox">{settings?.notifications?.sound && <Check weight={"bold"} size={14} />}</div>
              <span>Notification Sound</span>
            </button>
          </div>
          <div className="notificationSetting">
            <button
              className={clsx("settingSwitchItem", settings?.notifications?.background ? "checked" : "")}
              onClick={() =>
                changeSetting("notifications", {
                  ...settings?.notifications,
                  background: !settings?.notifications?.background,
                })
              }>
              <div className="checkBox">{settings?.notifications?.background && <Check weight={"bold"} size={14} />}</div>
              <span>Background Notifications</span>
            </button>
          </div>
          <div className="notificationSetting">
            <label>
              Background Colour:
              <input
                type="color"
                value={settings?.notifications?.backgroundColour || "#000000"}
                onChange={(e) =>
                  changeSetting("notifications", {
                    ...settings?.notifications,
                    backgroundColour: e.target.value,
                  })
                }
              />
            </label>
          </div>
        </div>
      </div>

      <span className="settingsDivider" />

      <div className="settingsSection notificationPhrases">
        <h5>Highlight Phrases</h5>

        <div className="highlightPhrases">
          {settings?.notifications?.phrases.map((phrase) => (
            <div key={phrase} className="highlightPhrase">
              <span>{phrase}</span>
              <button
                onClick={() =>
                  changeSetting("notifications", {
                    ...settings?.notifications,
                    phrases: settings?.notifications?.phrases.filter((p) => p !== phrase),
                  })
                }>
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="highlightAddPhrase">
          <input
            type="text"
            placeholder="Add new phrase..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                changeSetting("notifications", {
                  ...settings?.notifications,
                  phrases: [...settings?.notifications?.phrases, e.target.value],
                });
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
