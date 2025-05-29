import { memo, useCallback, useMemo } from "react";
import { MessageParser } from "../../utils/MessageParser";
import { KickBadges, KickTalkBadges, StvBadges } from "../Cosmetics/Badges";
import { getTimestampFormat } from "../../utils/ChatUtils";
import CopyIcon from "../../assets/icons/copy-simple-fill.svg?asset";
import ReplyIcon from "../../assets/icons/reply-fill.svg?asset";
import Pin from "../../assets/icons/push-pin-fill.svg?asset";
import clsx from "clsx";
import dayjs from "dayjs";

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
    getPinMessage,
    chatroomId,
    userChatroomInfo,
    isSearch = false,
    settings,
  }) => {
    const canModerate = useMemo(
      () => userChatroomInfo?.is_broadcaster || userChatroomInfo?.is_moderator || userChatroomInfo?.is_super_admin,
      [userChatroomInfo],
    );

    const timestamp = useMemo(
      () => getTimestampFormat(message?.created_at, settings?.general?.timestampFormat),
      [message?.created_at, settings?.general?.timestampFormat],
    );

    const handleReply = useCallback(() => {
      window.app.reply.open(message);
    }, [message?.id]);

    const handleCopyMessage = useCallback(() => {
      navigator.clipboard.writeText(message?.content);
    }, [message?.content]);

    const handlePinMessage = useCallback(() => {
      const data = {
        chatroom_id: message.chatroom_id,
        content: message.content,
        id: message.id,
        sender: message.sender,
        chatroomName: chatroomName,
      };
      getPinMessage(chatroomId, data);
    }, [message?.id, message?.chatroom_id, message?.content, message?.sender, chatroomName, getPinMessage, chatroomId]);

    const usernameStyle = useMemo(() => {
      if (userStyle?.paint) {
        return {
          backgroundImage: userStyle.paint.backgroundImage,
          filter: userStyle.paint.shadows,
        };
      }
      return { color: message.sender.identity?.color };
    }, [userStyle?.paint, message.sender.identity?.color]);

    const messageContent = useMemo(
      () => (
        <MessageParser
          type={type}
          message={message}
          chatroomId={chatroomId}
          chatroomName={chatroomName}
          sevenTVEmotes={sevenTVEmotes}
          sevenTVSettings={sevenTVSettings}
          subscriberBadges={subscriberBadges}
          userChatroomInfo={userChatroomInfo}
        />
      ),
      [type, message, chatroomId, chatroomName, sevenTVEmotes, sevenTVSettings, subscriberBadges, userChatroomInfo],
    );

    return (
      <span className={`chatMessageContainer ${message.deleted ? "deleted" : ""}`}>
        <div className="chatMessageUser">
          {settings?.general?.showTimestamps && settings?.general?.timestampFormat !== "disabled" && (
            <span className="chatMessageTimestamp">{timestamp}</span>
          )}

          <div className="chatMessageBadges">
            {filteredKickTalkBadges && <KickTalkBadges badges={filteredKickTalkBadges} />}
            {userStyle?.badge && <StvBadges badge={userStyle?.badge} />}
            <KickBadges
              badges={message?.sender?.identity?.badges}
              subscriberBadges={subscriberBadges}
              kickTalkBadges={filteredKickTalkBadges}
            />
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              if (isSearch) {
                return handleOpenUserDialog(e, message.sender.username);
              } else {
                return handleOpenUserDialog(e);
              }
            }}
            className={clsx("chatMessageUsername", userStyle?.paint && "chatMessageUsernamePaint")}
            style={usernameStyle}>
            <span>{message.sender.username}:&nbsp;</span>
          </button>
        </div>

        <div className="chatMessageContent">{messageContent}</div>

        <div className="chatMessageActions">
          {canModerate && !message?.deleted && (
            <button onClick={handlePinMessage} className="chatMessageActionButton">
              <img src={Pin} alt="Pin Message" width={16} height={16} loading="lazy" />
            </button>
          )}

          {!message?.deleted && (
            <button onClick={handleReply} className="chatMessageActionButton">
              <img src={ReplyIcon} alt={`Reply to ${message?.sender?.username}`} width={16} height={16} loading="lazy" />
            </button>
          )}

          <button onClick={handleCopyMessage} className="chatMessageActionButton">
            <img src={CopyIcon} alt="Copy Message" width={16} height={16} loading="lazy" />
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
      prevProps.userChatroomInfo === nextProps.userChatroomInfo &&
      prevProps.userStyle === nextProps.userStyle &&
      prevProps.filteredKickTalkBadges === nextProps.filteredKickTalkBadges &&
      prevProps.subscriberBadges === nextProps.subscriberBadges &&
      prevProps.type === nextProps.type &&
      prevProps.chatroomId === nextProps.chatroomId &&
      prevProps.chatroomName === nextProps.chatroomName &&
      prevProps.settings === nextProps.settings
    );
  },
);

export default RegularMessage;
