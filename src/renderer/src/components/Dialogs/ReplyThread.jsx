import { useEffect, useState } from "react";
import Message from "../Messages/Message";
import { userKickTalkBadges } from "../../../../../utils/kickTalkBadges";
import CloseIcon from "../../assets/icons/x-bold.svg?asset";
import { MessageParser } from "../../utils/MessageParser";
import ChatInput from "../Chat/Input";

const ReplyThread = () => {
  const [dialogData, setDialogData] = useState(null);
  const [replyThreadMessages, setReplyThreadMessages] = useState([]);
  const [subscriberBadges, setSubscriberBadges] = useState([]);
  const [sevenTVEmotes, setSevenTVEmotes] = useState([]);
  const [originalMessage, setOriginalMessage] = useState(null);

  useEffect(() => {
    const loadData = async ({ chatroomId, messages, originalMessageId }) => {
      setDialogData({
        chatroomId,
        originalMessageId,
      });

      setReplyThreadMessages(messages);

      const originalMessage = messages?.[0]?.metadata;
      setOriginalMessage(originalMessage);

      if (!originalMessage) {
        return;
      }

      const chatrooms = JSON.parse(localStorage.getItem("chatrooms")) || [];
      const currentChatroom = chatrooms.find((chatroom) => chatroom.id === chatroomId);

      setSubscriberBadges(currentChatroom?.streamerData?.subscriber_badges || []);
      setSevenTVEmotes(currentChatroom?.channel7TVEmotes || []);
    };

    const updateData = (data) => {
      setReplyThreadMessages([...replyThreadMessages?.filter((message) => message?.id !== data?.id), ...data?.messages]);
    };

    const dataCleanup = window.app.replyThreadDialog.onData(loadData);
    const updateCleanup = window.app.replyLogs.onUpdate(updateData);

    return () => {
      dataCleanup();
      updateCleanup();
    };
  }, []);

  return (
    <>
      <div className="replyThreadWrapper">
        <div className="replyThreadHead">
          <p>Reply Thread</p>

          <button className="replyThreadCloseBtn" onClick={() => window.app.replyThreadDialog.close()}>
            <img src={CloseIcon} width={16} height={16} alt="Close" />
          </button>
        </div>

        <div className="replyThreadContent">
          {originalMessage?.original_message?.id && (
            <div className="replyThreadOriginalMessage">
              <p>Original Message:</p>

              <span>
                <p>{originalMessage?.original_sender?.username}: </p>
                <MessageParser message={originalMessage?.original_message} type="minified" />
              </span>
            </div>
          )}

          <div className="replyThreadMessages">
            {replyThreadMessages?.map((message, i) => {
              return (
                <Message
                  key={`${message.id}-${i}`}
                  message={message}
                  chatroomId={dialogData?.chatroomId}
                  subscriberBadges={subscriberBadges}
                  sevenTVEmotes={sevenTVEmotes}
                  kickTalkBadges={userKickTalkBadges}
                  type="replyThread"
                />
              );
            })}
          </div>
        </div>

        <div className="replyThreadInput">
          {originalMessage?.original_message?.id && (
            <ChatInput chatroomId={dialogData?.chatroomId} isReplyThread={true} replyMessage={originalMessage} />
          )}
        </div>
      </div>
    </>
  );
};

export default ReplyThread;
