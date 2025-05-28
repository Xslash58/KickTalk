import { memo, useMemo, useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { Virtuoso } from "react-virtuoso";
import useChatStore from "../../providers/ChatProvider";
import Message from "./Message";
import MouseScroll from "../../assets/icons/mouse-scroll-fill.svg?asset";
import clsx from "clsx";

const MessagesHandler = ({
  messages,
  chatroomId,
  slug,
  channel7TVEmotes,
  subscriberBadges,
  kickTalkBadges,
  settings,
  userChatroomInfo,
  username,
}) => {
  const virtuosoRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [silencedUserIds, setSilencedUserIds] = useState(new Set());
  const [atBottom, setAtBottom] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const filteredMessages = useMemo(() => {
    if (!messages?.length) return [];

    return messages.filter((message) => {
      if (message?.chatroom_id !== chatroomId) return false;
      if (message?.type === "system" || message?.type === "mod_action") return true;
      if (message?.type !== "reply" && message?.type !== "message") return true;

      return message?.sender?.id && !silencedUserIds.has(message?.sender?.id);
    });
  }, [messages, chatroomId, silencedUserIds]);

  const handleScroll = useCallback(
    (e) => {
      if (!e?.target) return;
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

      setAtBottom(isNearBottom);

      if (isNearBottom !== !isPaused) {
        setIsPaused(!isNearBottom);
        useChatStore.getState().handleChatroomPause(chatroomId, !isNearBottom);
      }
    },
    [chatroomId, isPaused],
  );

  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    useChatStore.getState().handleChatroomPause(chatroomId, newPausedState);

    if (!newPausedState) {
      setAtBottom(true);
      virtuosoRef.current?.scrollToIndex({
        index: filteredMessages.length - 1,
        behavior: "instant",
        align: "end",
      });
    }
  };

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

  // useEffect(() => {
  //   if (filteredMessages.length > 0 && !isPaused) {
  //     virtuosoRef.current?.scrollToIndex({
  //       index: filteredMessages.length - 1,
  //       behavior: "instant",
  //       align: "end",
  //     });
  //   }
  // }, [chatroomId, filteredMessages, isPaused]);

  return (
    <div className="chatContainer" style={{ height: "100%", flex: 1 }} ref={chatContainerRef}>
      <Virtuoso
        ref={virtuosoRef}
        data={filteredMessages}
        itemContent={(index, message) => {
          if (message?.type === "mod_action" && !settings?.chatrooms?.showModActions) {
            return null;
          }

          return (
            <Message
              key={message?.id}
              message={message}
              chatroomId={chatroomId}
              chatroomName={slug}
              subscriberBadges={subscriberBadges}
              sevenTVEmotes={channel7TVEmotes}
              kickTalkBadges={kickTalkBadges}
              settings={settings}
              userChatroomInfo={userChatroomInfo}
              username={username}
            />
          );
        }}
        computeItemKey={(index, message) => message?.id}
        followOutput={"auto"}
        onScroll={handleScroll}
        initialTopMostItemIndex={filteredMessages?.length - 1}
        alignToBottom={true}
        defaultItemHeight={48}
        atBottomThreshold={150}
        overscan={10}
        increaseViewportBy={200}
        style={{
          height: "100%",
          width: "100%",
          flex: 1,
        }}
      />

      {!atBottom && (
        <div className={clsx("scrollToBottomBtn")} onClick={togglePause}>
          Scroll To Bottom
          <img src={MouseScroll} width={24} height={24} alt="Scroll To Bottom" />
        </div>
      )}
    </div>
  );
};

export default MessagesHandler;
