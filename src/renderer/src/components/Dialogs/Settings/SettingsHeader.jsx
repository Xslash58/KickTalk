import { memo } from "react";
import X from "../../../assets/icons/x-bold.svg?asset";

const SettingsHeader = memo(
  ({ onClose, appInfo }) => {
    return (
      <div className="settingsDialogHeader">
        <h2>
          Settings <span className="settingsDialogVersion">v {appInfo?.appVersion || "0.0.0"}</span>
        </h2>

        <button className="settingsDialogCloseBtn" onClick={onClose}>
          <img src={X} width={16} height={16} alt="Close" />
        </button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.appInfo?.appVersion === nextProps.appInfo?.appVersion;
  },
);

export default SettingsHeader;
