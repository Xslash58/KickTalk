import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import { userKickTalkBadges } from "../../../../../utils/kickTalkBadges";
import ChatInput from "./Input";
import useChatStore from "../../providers/ChatProvider";
import MessagesHandler from "../Messages/MessagesHandler";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import StreamerInfo from "./StreamerInfo";
dayjs.extend(relativeTime);

const Chat = ({ chatroomId, kickUsername }) => {
  const { settings } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const chatroom = useChatStore((state) => state.chatrooms.filter((chatroom) => chatroom.id === chatroomId)[0]);
  const messages = useChatStore((state) => state.messages[chatroomId]);

  const subscriberBadges = chatroom?.streamerData?.subscriber_badges || [];

  // Ctrl + F to open search dialog
  const handleSearch = useCallback(() => {
    setIsSearchOpen(true);

    if (messages?.length > 0) {
      window.app.searchDialog.open({
        messages: messages || [],
        chatroomId,
        sevenTVEmotes: chatroom?.channel7TVEmotes,
        sevenTVSettings: settings?.sevenTV,
        subscriberBadges,
        userChatroomInfo: chatroom?.userChatroomInfo,
        chatroomName: chatroom?.slug,
      });
    }
  }, [messages, isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        handleSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSearch]);

  return (
    <div className="chatContainer">
      <StreamerInfo
        streamerData={chatroom?.streamerData}
        streamStatus={chatroom?.streamStatus}
        userChatroomInfo={chatroom?.userChatroomInfo}
        isStreamerLive={chatroom?.isStreamerLive}
        chatroomId={chatroomId}
      />

      <div className="chatBody">
        <MessagesHandler
          messages={messages}
          chatroomId={chatroomId}
          slug={chatroom?.slug}
          channel7TVEmotes={chatroom?.channel7TVEmotes}
          subscriberBadges={subscriberBadges}
          kickTalkBadges={userKickTalkBadges}
          userChatroomInfo={chatroom?.userChatroomInfo}
          username={kickUsername}
          settings={settings}
        />
      </div>
      <div className="chatBoxContainer">
        <ChatInput chatroomId={chatroomId} />
      </div>
    </div>
  );
};

export default Chat;
