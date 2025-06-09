import { Tooltip, TooltipContent, TooltipTrigger } from "../../../Shared/Tooltip";
import InfoIcon from "../../../../assets/icons/info-fill.svg?asset";
import clsx from "clsx";
import { Switch } from "../../../Shared/Switch";

const ModerationSection = ({ settingsData, onChange }) => {
  return (
    <div className="settingsContentSection">
      <div className="settingsSectionHeader">
        <h4>Moderation</h4>
        <p>Customize your moderation experience.</p>
      </div>

      <div className="settingsItems">
        <div className="settingsItem">
          <div
            className={clsx("settingSwitchItem", {
              active: settingsData?.moderation?.quickModTools,
            })}>
            <div className="settingsItemTitleWithInfo">
              <span className="settingsItemTitle">Quick Mod Tools</span>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <button className="settingsInfoIcon">
                    <img src={InfoIcon} width={14} height={14} alt="Info" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <img src={InfoIcon} width={14} height={14} alt="Quick Mod Tools" />
                  <p>Enable quick moderation tools in chat messages</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Switch
              checked={settingsData?.moderation?.quickModTools || false}
              onCheckedChange={(checked) =>
                onChange("moderation", {
                  ...settingsData?.moderation,
                  quickModTools: checked,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { ModerationSection };
