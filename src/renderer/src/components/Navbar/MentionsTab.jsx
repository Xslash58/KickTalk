import { memo } from "react";
import clsx from "clsx";
import X from "../../assets/icons/x-bold.svg?asset";

const MentionsTab = memo(({ currentChatroomId, onSelectChatroom, onRemoveMentionsTab }) => {
  return (
    <div
      onClick={() => onSelectChatroom("mentions")}
      onMouseDown={(e) => {
        if (e.button === 1) {
          onRemoveMentionsTab();
        }
      }}
      className={clsx("chatroomStreamer", currentChatroomId === "mentions" && "chatroomStreamerActive")}>
      <div className="streamerInfo">
        <span>Mentions</span>
      </div>
      <button
        className="closeChatroom"
        onClick={(e) => {
          e.stopPropagation();
          onRemoveMentionsTab();
        }}
        aria-label="Remove mentions tab">
        <img src={X} width={12} height={12} alt="Remove mentions tab" />
      </button>
    </div>
  );
});

MentionsTab.displayName = "MentionsTab";

export default MentionsTab;
