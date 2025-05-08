import { useState } from "react";
import clsx from "clsx";
import PinnedMessage from "./PinnedMessage";
import useChatStore from "../../providers/ChatProvider";
import { useShallow } from "zustand/shallow";
import PushPin from "../../assets/icons/push-pin-fill.svg?asset";
import UserIcon from "../../assets/icons/user-fill.svg?asset";

const StreamerInfo = ({ streamerData, streamStatus, isStreamerLive, chatroomId }) => {
  const [showPinnedMessage, setShowPinnedMessage] = useState(false);

  const pinnedMessage = useChatStore(
    useShallow((state) => state.chatrooms.find((room) => room.id === chatroomId)?.pinnedMessage),
  );

  const chatters = useChatStore(useShallow((state) => state.chatrooms.find((room) => room.id === chatroomId)?.chatters));

  const handleChattersBtn = (e) => {
    const chattersData = {
      chatters: chatters || [],
      streamerData,
    };

    window.app.chattersDialog.open(chattersData);
  };

  return (
    <div className="chatStreamerInfo">
      <div className="chatStreamerInfoContent">
        <span className="streamerName">{streamerData?.user?.username}</span>
        {isStreamerLive && <span className="liveBadgeDot" />}
      </div>

      <div className="chatStreamerLiveStatus">
        {streamStatus?.session_title && (
          <span className="chatStreamerLiveStatusTitle" title={streamStatus?.session_title}>
            {streamStatus?.session_title}
          </span>
        )}
      </div>
      <div className="chatStreamerInfoActions">
        <button onClick={handleChattersBtn} className="chattersBtn">
          <img src={UserIcon} width={20} height={20} alt="Pin Message" />
        </button>
        {pinnedMessage && (
          <button
            className={clsx("pinnedMessageBtn", pinnedMessage && "show", showPinnedMessage && "open")}
            onClick={() => setShowPinnedMessage(!showPinnedMessage)}>
            <img src={PushPin} width={20} height={20} alt="Pin Message" />
          </button>
        )}
      </div>

      {pinnedMessage && (
        <PinnedMessage
          showPinnedMessage={showPinnedMessage}
          setShowPinnedMessage={setShowPinnedMessage}
          pinnedMessage={pinnedMessage}
          chatroomId={chatroomId}
        />
      )}
    </div>
  );
};

export default StreamerInfo;
