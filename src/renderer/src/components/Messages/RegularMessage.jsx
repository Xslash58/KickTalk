import { memo } from "react";
import { MessageParser } from "../../utils/MessageParser";
import { KickBadges, KickTalkBadges, StvBadges } from "../Cosmetics/Badges";
import CopyIcon from "../../assets/icons/copy-simple-fill.svg?asset";
import Pin from "../../assets/icons/push-pin-fill.svg?asset";
import clsx from "clsx";
import dayjs from "dayjs";
import { useSettings } from "../../providers/SettingsProvider";

const RegularMessage = memo(
  ({
    message,
    filteredKickTalkBadges,
    subscriberBadges,
    userStyle,
    sevenTVEmotes,
    handleOpenUserDialog,
    sevenTVSettings,
    type,
    chatroomName,
    userChatroomInfo,
  }) => {
    const { settings } = useSettings();
    const canModerate = userChatroomInfo?.is_broadcaster || userChatroomInfo?.is_moderator || userChatroomInfo?.is_super_admin;
    // "h:mm", "hh:mm", "h:mm a", "hh:mm a", "h:mm:ss", "hh:mm:ss",
    //          "h:mm:ss a", "hh:mm:ss a", "h:mm:ss.zzz", "h:mm:ss.zzz a",
    const timestampFormat = () => {
      if (!message?.created_at) return;
      const timestamp = message.created_at;
      switch (settings?.general?.timestampFormat) {
        case "disabled":
          return "disabled";
        case "h:mm":
          return dayjs(timestamp).format("h:mm");
        case "hh:mm":
          return dayjs(timestamp).format("HH:mm");
        case "h:mm a":
          return dayjs(timestamp).format("h:mm A");
        case "hh:mm a":
          return dayjs(timestamp).format("HH:mm A");
        case "h:mm:ss":
          return dayjs(timestamp).format("h:mm:ss");
        case "hh:mm:ss":
          return dayjs(timestamp).format("HH:mm:ss");
        case "h:mm:ss a":
          return dayjs(timestamp).format("h:mm:ss A");
        case "hh:mm:ss a":
          return dayjs(timestamp).format("HH:mm:ss A");
        default:
          return "disabled";
      }
    };

    return (
      <span className={`chatMessageContainer ${message.deleted ? "deleted" : ""}`}>
        <div className="chatMessageUser">
          {settings?.general?.showTimestamps && <span className="chatMessageTimestamp">{timestampFormat()}</span>}
          <div className="chatMessageBadges">
            {filteredKickTalkBadges && <KickTalkBadges badges={filteredKickTalkBadges} />}
            {userStyle?.badge && <StvBadges badge={userStyle?.badge} />}
            <KickBadges
              badges={message.sender.identity?.badges}
              subscriberBadges={subscriberBadges}
              kickTalkBadges={filteredKickTalkBadges}
            />
          </div>
          <button
            onClick={handleOpenUserDialog}
            className={clsx("chatMessageUsername", userStyle?.paint && "chatMessageUsernamePaint")}
            style={
              userStyle?.paint
                ? { backgroundImage: userStyle?.paint?.backgroundImage, filter: userStyle?.paint?.shadows }
                : { color: message.sender.identity?.color }
            }>
            <span>{message.sender.username}:&nbsp;</span>
          </button>
        </div>
        <div className="chatMessageContent">
          <MessageParser type={type} message={message} sevenTVEmotes={sevenTVEmotes} sevenTVSettings={sevenTVSettings} />
        </div>
        <div className="chatMessageActions">
          {canModerate && (
            <button
              onClick={() => {
                const data = {
                  chatroom_id: message.chatroom_id,
                  content: message.content,
                  id: message.id,
                  sender: message.sender,
                  chatroomName: chatroomName,
                };
                window.app.kick.getPinMessage(data);
              }}
              className="chatMessageActionButton">
              <img src={Pin} alt="Pin Message" width={16} height={16} />
            </button>
          )}
          <button
            onClick={() => {
              navigator.clipboard.writeText(message.content);
            }}
            className="chatMessageActionButton">
            <img src={CopyIcon} alt="Copy Message" width={16} height={16} />
          </button>
        </div>
      </span>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.message === nextProps.message &&
      prevProps.sevenTVSettings === nextProps.sevenTVSettings &&
      prevProps.sevenTVEmotes === nextProps.sevenTVEmotes &&
      prevProps.userStyle === nextProps.userStyle
    );
  },
);

export default RegularMessage;
