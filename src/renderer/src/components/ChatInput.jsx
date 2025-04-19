import {
  $getRoot,
  $getSelection,
  $setSelection,
  KEY_ENTER_COMMAND,
  COMMAND_PRIORITY_HIGH,
  CLEAR_EDITOR_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
} from "lexical";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $rootTextContent } from "@lexical/text";
import { useChat } from "../providers/ChatProvider";

const onError = (error) => {
  console.error(error);
};

const theme = {
  ltr: "ltr",
  paragraph: "editor-paragraph",
  placeholder: "editor-placeholder",
};

// TODO: Handle enter for different OS's

const KeyHandler = ({ chatroomId, onSendMessage }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor) return;

    const removeCommand = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (e) => {
        if (e.shiftKey) return false;
        e.preventDefault();

        const content = $rootTextContent();
        if (!content.trim()) return true;

        onSendMessage(content);
        editor.update(() => {
          $getRoot().clear();
        });

        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );

    return () => removeCommand();
  }, [editor, chatroomId]);

  return null;
};

const initialConfig = {
  namespace: "chat",
  theme,
  onError,
};

const ChatInput = memo(
  ({ chatroomId, setShouldAutoScroll }) => {
    const { sendMessage } = useChat();
    const [messageHistory, setMessageHistory] = useState([]);

    const handleSendMessage = async (content) => {
      const res = await sendMessage(chatroomId, content);

      if (res) {
        setMessageHistory((prev) => [...prev, content]);
        setShouldAutoScroll(true);
      }
    };

    return (
      <LexicalComposer key={`composer-${chatroomId}`} initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              className="chatInput"
              enterKeyHint="send"
              aria-placeholder={"Enter message..."}
              placeholder={<div className="chatInputPlaceholder">Enter message...</div>}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <KeyHandler chatroomId={chatroomId} onSendMessage={handleSendMessage} />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    );
  },
  (prev, next) => prev.chatroomId === next.chatroomId,
);

export default ChatInput;
