export const scrollToBottom = (chatBodyRef, setShowScrollToBottom) => {
  if (!chatBodyRef.current) return;
  chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  setShowScrollToBottom(false);
};
