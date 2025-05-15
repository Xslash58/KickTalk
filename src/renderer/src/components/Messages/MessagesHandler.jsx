import { memo, useMemo } from "react";
import useChatStore from "../../providers/ChatProvider";
import Message from "./Message";

const MessagesHandler = memo(
  ({ chatroomId, slug, channel7TVEmotes, userChatroomInfo, subscriberBadges, kickTalkBadges, settings, username }) => {
    const messages = useChatStore((state) => state.messages[chatroomId]);

    const silencedUserIds = useMemo(() => {
      const users = JSON.parse(localStorage.getItem("silencedUsers")) || [];
      return new Set(users?.data?.map((user) => user.id) || []);
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
