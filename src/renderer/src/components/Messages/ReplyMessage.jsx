import { MessageParser } from "../../utils/MessageParser";
import RegularMessage from "./RegularMessage";
import ArrowReplyLineIcon from "../../assets/app/arrow_reply_line.svg?asset";
import useChatStore from "../../providers/ChatProvider";
import { useShallow } from "zustand/shallow";

const ReplyMessage = ({
  message,
  sevenTVEmotes,
  subscriberBadges,
  filteredKickTalkBadges,
  handleOpenUserDialog,
  settings,
  chatroomId,
  chatroomName,
  userChatroomInfo,
}) => {
  const messageThread = useChatStore(
    useShallow((state) =>
      state.messages[chatroomId]?.filter((m) => m?.metadata?.original_message?.id === message?.metadata?.original_message?.id),
    ),
  );

  const handleReplyDialog = () => {
    window.app.replyThreadDialog.open(messageThread);
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
            message={message?.metadata?.original_message}
            type="reply"
            sevenTVEmotes={sevenTVEmotes}
            userChatroomInfo={userChatroomInfo}
            chatroomId={chatroomId}
            chatroomName={chatroomName}
          />
        </span>
      </span>

      <RegularMessage
        message={message}
        subscriberBadges={subscriberBadges}
        filteredKickTalkBadges={filteredKickTalkBadges}
        sevenTVEmotes={sevenTVEmotes}
        handleOpenUserDialog={handleOpenUserDialog}
        sevenTVSettings={settings?.sevenTV}
        chatroomId={chatroomId}
        chatroomName={chatroomName}
      />
    </div>
  );
};

export default ReplyMessage;
