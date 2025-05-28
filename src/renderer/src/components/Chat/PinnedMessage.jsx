import { clsx } from "clsx";
import { MessageParser } from "../../utils/MessageParser";
import dayjs from "dayjs";
import { memo, useState } from "react";
import CaretDown from "../../assets/icons/caret-down-bold.svg?asset";
import PushPinSlash from "../../assets/icons/push-pin-slash-fill.svg?asset";
<<<<<<< Updated upstream:src/renderer/src/components/Chat/PinnedMessage.jsx

const PinnedMessage = memo(
  ({ showChatters, showPinnedMessage, setShowPinnedMessage, pinnedMessage, chatroomName, canModerate }) => {
    if (!pinnedMessage) return null;
=======
import dayjs from "dayjs";
import { KickBadges } from "../Cosmetics/Badges";

const Pin = memo(
  ({ showChatters, subscriberBadges, showPinnedMessage, setShowPinnedMessage, pinDetails, chatroomName, canModerate }) => {
    if (!pinDetails) return null;
>>>>>>> Stashed changes:src/renderer/src/components/Chat/Pin.jsx
    const [isPinnedMessageOpen, setIsPinnedMessageOpen] = useState(false);

    const pinnedBy = pinnedMessage?.pinned_by || pinnedMessage?.pinnedBy;
    const originalSender = pinnedMessage?.message?.sender;

    const getUnpinMessage = async () => {
      if (!canModerate) return;
      const response = await window.app.kick.getUnpinMessage(chatroomName);

      if (response?.code === 201) {
        setShowPinnedMessage(false);
      }
    };

    return (
      <div className={clsx("pinnedMessage", showPinnedMessage && !showChatters && "open", isPinnedMessageOpen && "expanded")}>
        <div className="pinnedMessageTop">
          <div className="pinnedMessageHeader">
            <div className="pinnedMessageHeaderInfo">
              <h4>
                Pinned by{" "}
                {pinnedBy?.identity?.badges?.length > 0 && (
                  <KickBadges badges={originalSender?.identity?.badges} subscriberBadges={subscriberBadges} />
                )}
                <span style={{ color: pinnedBy?.identity?.color }}>
                  {pinnedBy?.message?.sender?.username || pinnedBy?.username}
                </span>
              </h4>
            </div>
            <div className="pinnedMessageActions">
              <button onClick={() => setIsPinnedMessageOpen(!isPinnedMessageOpen)}>
                <img
                  src={CaretDown}
                  width={16}
                  height={16}
                  alt="Expand Pinned Message"
                  style={{ transform: isPinnedMessageOpen ? "rotate(180deg)" : "none" }}
                />
              </button>
              {canModerate && (
                <button onClick={() => getUnpinMessage() && setShowPinnedMessage(false)}>
                  <img src={PushPinSlash} width={16} height={16} alt="Hide Pinned Message" />
                </button>
              )}
            </div>
          </div>
          <div className="pinnedMessageContent">
            <MessageParser message={pinDetails?.message} type="minified" />
          </div>
<<<<<<< Updated upstream:src/renderer/src/components/Chat/PinnedMessage.jsx
        </div>
        <div className="pinnedMessageContent">
          <MessageParser message={pinnedMessage?.message} type="minified" />
=======
>>>>>>> Stashed changes:src/renderer/src/components/Chat/Pin.jsx
        </div>
        <div className={clsx("pinnedMessageFooter", isPinnedMessageOpen && "open")}>
          <div className="pinnedMessageFooterContent">
            <span>Message sent by</span>
            <div className="pinnedMessageFooterUsername">
              {originalSender?.identity?.badges?.length > 0 && (
                <KickBadges badges={originalSender?.identity?.badges} subscriberBadges={subscriberBadges} />
              )}
              <span style={{ color: originalSender?.identity?.color }}>{originalSender?.username}</span>
            </div>
            <span>at {dayjs(pinDetails?.message?.created_at).format("h:mm A")}</span>
          </div>
          <span>{pinnedMessage?.finishs_at && `Pin expires ${dayjs(pinnedMessage?.finish_at).fromNow()}`}</span>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.pinnedMessage === nextProps.pinnedMessage &&
      prevProps.showPinnedMessage === nextProps.showPinnedMessage &&
      prevProps.chatroomName === nextProps.chatroomName &&
      prevProps.canModerate === nextProps.canModerate
    );
  },
);

export default PinnedMessage;
