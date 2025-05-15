import { MessageParser } from "../../utils/MessageParser";
import RegularMessage from "./RegularMessage";
import ArrowReplyLineIcon from "../../assets/app/arrow_reply_line.svg?asset";
import useChatStore from "../../providers/ChatProvider";
import { useShallow } from "zustand/shallow";

const ReplyMessage = ({
  message,
  sevenTVEmotes,
  sevenTVSettings,
  subscriberBadges,
  filteredKickTalkBadges,
  handleOpenUserDialog,
  userStyle,
  settings,
  chatroomId,
  chatroomName,
  userChatroomInfo,
}) => {
  const chatStoreMessageThread = useChatStore(
    useShallow((state) =>
      state.messages[chatroomId]?.filter((m) => m?.metadata?.original_message?.id === message?.metadata?.original_message?.id),
    ),
  );

  const handleReplyDialog = async () => {
    const messageThread = await window.app.replyLogs.get({
      originalMessageId: message?.metadata?.original_message?.id,
      chatroomId,
    });

    const sortedMessages = [...new Set([...chatStoreMessageThread, ...messageThread].map((m) => m.id))]
      .map((id) => [...chatStoreMessageThread, ...messageThread].find((m) => m.id === id))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    await window.app.replyThreadDialog.open({
      chatroomId,
      messages: sortedMessages,
      originalMessageId: message?.metadata?.original_message?.id,
    });
  };

  return (
    <div className="chatMessageReply">
      <span className="chatMessageReplyText">
        <img className="chatMessageReplySymbol" src={ArrowReplyLineIcon} />
        <span className="chatMessageReplyTextSender">{message?.metadata?.original_sender?.username}:</span>
        <span
          className="chatMessageReplyTextContent"
          onClick={handleReplyDialog}
          title={message?.metadata?.original_message?.content}>
          <MessageParser
            type="reply"
            message={message?.metadata?.original_message}
            sevenTVEmotes={sevenTVEmotes}
            userChatroomInfo={userChatroomInfo}
            chatroomId={chatroomId}
            chatroomName={chatroomName}
          />
        </span>
      </span>

      <RegularMessage
        type="reply"
        message={message}
        subscriberBadges={subscriberBadges}
        filteredKickTalkBadges={filteredKickTalkBadges}
        sevenTVEmotes={sevenTVEmotes}
        handleOpenUserDialog={handleOpenUserDialog}
        userStyle={userStyle}
        sevenTVSettings={sevenTVSettings}
        chatroomId={chatroomId}
        chatroomName={chatroomName}
        userChatroomInfo={userChatroomInfo}
      />
    </div>
  );
};

export default ReplyMessage;
