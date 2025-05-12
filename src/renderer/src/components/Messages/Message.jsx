import "../../assets/styles/components/Chat/Message.scss";
import { memo, useCallback, useEffect, useRef } from "react";
import ModActionMessage from "./ModActionMessage";
import RegularMessage from "./RegularMessage";
import ArrowReplyLineIcon from "../../assets/app/arrow_reply_line.svg?asset";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import useCosmeticsStore from "../../providers/CosmeticsProvider";
import { MessageParser } from "../../utils/MessageParser";
import ReplyMessage from "./ReplyMessage";

const Message = memo(
  ({
    message,
    userChatroomInfo,
    chatroomId,
    subscriberBadges,
    sevenTVEmotes,
    kickTalkBadges,
    settings,
    dialogUserStyle,
    type,
    username,
    chatroomName,
  }) => {
    const messageRef = useRef(null);

    let userStyle;
    if (message?.sender) {
      if (type === "dialog") {
        userStyle = dialogUserStyle;
      } else {
        userStyle = useCosmeticsStore(useShallow((state) => state.getUserStyle(message?.sender?.username)));
      }
    }

    const handleOpenUserDialog = useCallback(
      (e) => {
        e.preventDefault();

        window.app.userDialog.open({
          sender: message.sender,
          userChatroomInfo,
          chatroomId,
          cords: [e.clientX, e.clientY],
          userStyle,
        });
      },
      [message?.sender, chatroomId, userChatroomInfo],
    );

    const filteredKickTalkBadges = kickTalkBadges?.find(
      (badge) => badge.username.toLowerCase() === message?.sender?.username?.toLowerCase(),
    )?.badges;

    const checkForPhrases = () => {
      if (settings?.notifications?.enabled && settings?.notifications?.phrases?.length && message?.sender?.slug !== username) {
        return settings?.notifications?.phrases?.some((phrase) => {
          return message.content?.toLowerCase().includes(phrase.toLowerCase());
        });
      }
    };

    const shouldHighlight = checkForPhrases();

    // if (shouldHighlight && settings.notifications.sound && message.soundPlayed !== true && !message?.is_old) {
    //   const audio = new Audio(settings?.notifications?.soundFile);
    //   audio.volume = settings?.notifications?.soundVolume || 0.1;
    //   audio.play().catch((error) => {
    //     console.error("Error playing sound:", error);
    //   });
    //   updateSoundPlayed(chatroomId, message.id);
    // }

    const handleContextMenu = () => {
      window.app.contextMenu.messages(message);
    };

    return (
      <div
        className={clsx(
          "chatMessageItem",
          message.is_old && "old",
          message.deleted && "deleted",
          type === "dialog" && "dialogChatMessageItem",
          shouldHighlight && "highlighted",
        )}
        onContextMenu={handleContextMenu}
        style={{
          backgroundColor: shouldHighlight ? settings?.notifications?.backgroundColour : "transparent",
        }}
        ref={messageRef}>
        {message.type === "message" && (
          <RegularMessage
            type={type}
            message={message}
            filteredKickTalkBadges={filteredKickTalkBadges}
            subscriberBadges={subscriberBadges}
            sevenTVEmotes={sevenTVEmotes}
            userStyle={userStyle}
            sevenTVSettings={settings?.sevenTV}
            handleOpenUserDialog={handleOpenUserDialog}
            userChatroomInfo={userChatroomInfo}
            chatroomName={chatroomName}
            chatroomId={chatroomId}
          />
        )}

        {message.type === "reply" && (
          <ReplyMessage
            message={message}
            sevenTVEmotes={sevenTVEmotes}
            subscriberBadges={subscriberBadges}
            filteredKickTalkBadges={filteredKickTalkBadges}
            handleOpenUserDialog={handleOpenUserDialog}
            sevenTVSettings={settings?.sevenTV}
            chatroomId={chatroomId}
            chatroomName={chatroomName}
            userChatroomInfo={userChatroomInfo}
          />
        )}

        {message.type === "system" && (
          <span className="systemMessage">
            {message.content === "connection-pending"
              ? "Connecting to Channel..."
              : message.content === "connection-success"
                ? "Connected to Channel"
                : message.content}
          </span>
        )}

        {message.type === "mod_action" && <ModActionMessage message={message} />}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.deleted === nextProps.message.deleted &&
      prevProps.settings === nextProps.settings &&
      prevProps.sevenTVEmotes === nextProps.sevenTVEmotes &&
      prevProps.userChatroomInfo === nextProps.userChatroomInfo
    );
  },
);

export default Message;
