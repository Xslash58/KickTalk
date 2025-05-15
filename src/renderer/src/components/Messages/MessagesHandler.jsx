import { memo, useMemo, useEffect, useState } from "react";
import useChatStore from "../../providers/ChatProvider";
import Message from "./Message";

const MessagesHandler = memo(
  ({ chatroomId, slug, channel7TVEmotes, userChatroomInfo, subscriberBadges, kickTalkBadges, settings, username }) => {
    const messages = useChatStore((state) => state.messages[chatroomId]);
    const [silencedUserIds, setSilencedUserIds] = useState(new Set());

    useEffect(() => {
      const loadSilencedUsers = () => {
        const users = JSON.parse(localStorage.getItem("silencedUsers")) || [];
        setSilencedUserIds(new Set(users?.data?.map((user) => user.id) || []));
      };

      const handleStorageChange = (e) => {
        if (e.key === "silencedUsers") {
          loadSilencedUsers();
        }
      };

      loadSilencedUsers();
      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);

    const filteredMessages = useMemo(() => {
      return (
        messages?.filter((message) => {
          if (message?.type !== "reply" && message?.type !== "message") {
            return true;
          }

          return message?.sender?.id && !silencedUserIds.has(message?.sender?.id);
        }) || []
      );
    }, [messages, silencedUserIds]);

    return (
      <div>
        {filteredMessages?.map((message) => {
          return (
            <Message
              key={message.id}
              chatroomId={chatroomId}
              chatroomName={slug}
              subscriberBadges={subscriberBadges}
              sevenTVEmotes={channel7TVEmotes}
              kickTalkBadges={kickTalkBadges}
              message={message}
              settings={settings}
              userChatroomInfo={userChatroomInfo}
              username={username}
            />
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.chatroomId === nextProps.chatroomId &&
      prevProps.settings === nextProps.settings &&
      prevProps.channel7TVEmotes === nextProps.channel7TVEmotes &&
      prevProps.userChatroomInfo === nextProps.userChatroomInfo
    );
  },
);

export default MessagesHandler;
