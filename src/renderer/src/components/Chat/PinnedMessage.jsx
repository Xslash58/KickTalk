import { CaretDown, PushPinSlash } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { MessageParser } from "../../utils/MessageParser";
import dayjs from "dayjs";

const PinnedMessage = ({
  pinnedMessage,
  showPinnedMessage,
  setShowPinnedMessage,
  pinnedMessageExpanded,
  setPinnedMessageExpanded,
}) => {
  const pinnedBy = pinnedMessage?.pinned_by || pinnedMessage?.pinnedBy;
  const originalSender = pinnedMessage?.message?.sender;
  return (
    <div className={clsx("pinnedMessage", showPinnedMessage && "open", pinnedMessageExpanded && "expanded")}>
      <div className="pinnedMessageHeader">
        <p>Pinned Message by {originalSender?.username}</p>
        <div className="pinnedMessageActions">
          <button onClick={() => setPinnedMessageExpanded(!pinnedMessageExpanded)}>
            <CaretDown size={16} weight="bold" style={{ transform: pinnedMessageExpanded ? "rotate(180deg)" : "none" }} />
          </button>
          <button onClick={() => setShowPinnedMessage(!showPinnedMessage)}>
            <PushPinSlash size={14} weight="fill" />
          </button>
        </div>
      </div>
      <div className="pinnedMessageContent">
        <p>
          <MessageParser message={pinnedMessage?.message} />
        </p>
      </div>
      <div className={clsx("pinnedMessageFooter", pinnedMessageExpanded && "open")}>
        <div className="pinnedMessageFooterContent">
          <span>Pinned by</span>
          <div className="pinnedMessageFooterUsername">
            <span style={{ color: pinnedBy?.identity?.color }}>{pinnedBy?.message?.sender?.username || pinnedBy?.username}</span>
          </div>
        </div>
        <span>{pinnedMessage?.finishs_at && `Pin expires ${dayjs(pinnedMessage?.finish_at).fromNow()}`}</span>
      </div>
    </div>
  );
};

export default PinnedMessage;
