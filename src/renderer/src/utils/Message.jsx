import "../assets/styles/components/Chat/Message.css";
import { memo, useCallback } from "react";
import ModActionMessage from "../components/Messages/ModActionMessage";
import RegularMessage from "../components/Messages/RegularMessage";
import ArrowReplyLineIcon from "../assets/app/arrow_reply_line.svg?asset";
import clsx from "clsx";

const Message = memo(
  ({ message, chatroomId, subscriberBadges, sevenTVEmotes, kickTalkBadges, settings, type }) => {
    const handleOpenUserDialog = useCallback(
      (e) => {
        e.preventDefault();
        window.app.userDialog.open({
          sender: message.sender,
          chatroomId,
          cords: [e.clientX, e.clientY],
        });
      },
      [message?.sender, chatroomId],
    );

    // TODO: Future Reply Dialog
    const userKickTalkBadges = kickTalkBadges?.find(
      (badge) => badge.username.toLowerCase() === message?.sender?.username?.toLowerCase(),
    )?.badges;

    const checkForPhrases = () => {
      if (settings?.notifications?.enabled && settings?.notifications?.phrases?.length) {
        return settings?.notifications?.phrases?.some((phrase) => message.content?.toLowerCase().includes(phrase.toLowerCase()));
      }
    };

    const shouldHighlight = checkForPhrases();

    // if (shouldHighlight && settings.notifications.sound) {
    //   new Audio(settings.notifications.soundFile).play();
    // }

    return (
      <div
        className={clsx("chatMessageItem", type === "dialog" && "dialogChatMessageItem")}
        style={{
          backgroundColor: shouldHighlight ? settings?.notifications?.backgroundColour : "transparent",
        }}>
        {message.type === "message" && (
          <RegularMessage
            type={type}
            message={message}
            userKickTalkBadges={userKickTalkBadges}
            subscriberBadges={subscriberBadges}
            kickTalkBadges={kickTalkBadges}
            sevenTVEmotes={sevenTVEmotes}
            handleOpenUserDialog={handleOpenUserDialog}
            sevenTVSettings={settings?.sevenTV}
          />
        )}
        {message.type === "reply" && (
          <div className="chatMessageReply">
            <span className="chatMessageReplyText">
              <img className="chatMessageReplySymbol" src={ArrowReplyLineIcon} />
              <span className="chatMessageReplyTextSender">{message?.metadata?.original_sender?.username}:</span>
              <span className="chatMessageReplyTextContent" title={message?.metadata?.original_message?.content}>
                {message?.metadata?.original_message?.content}
              </span>
            </span>

            <RegularMessage
              message={message}
              userKickTalkBadges={userKickTalkBadges}
              subscriberBadges={subscriberBadges}
              kickTalkBadges={kickTalkBadges}
              sevenTVEmotes={sevenTVEmotes}
              handleOpenUserDialog={handleOpenUserDialog}
              sevenTVSettings={settings?.sevenTV}
            />
          </div>
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
      prevProps.settings === nextProps.settings
    );
  },
);

export default Message;
