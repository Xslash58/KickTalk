export const scrollToBottom = (chatBodyRef, setShowScrollToBottom) => {
  if (!chatBodyRef.current) return;
  chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  setShowScrollToBottom(false);
};

export const convertMinutesToHumanReadable = (minutes) => {
  if (minutes < 60) {
    return `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)} ${Math.floor(minutes / 60) > 1 ? "hours" : "hour"}`;
  } else {
    return `${Math.floor(minutes / 1440)} ${Math.floor(minutes / 1440) > 1 ? "days" : "day"}`;
  }
};

export const convertSecondsToHumanReadable = (seconds) => {
  switch (true) {
    case seconds < 60:
      return `${seconds} ${seconds > 1 ? "seconds" : "second"}`;
    case seconds < 3600:
      return `${Math.floor(seconds / 60)} ${Math.floor(seconds / 60) > 1 ? "minutes" : "minute"}`;
    case seconds < 86400:
      return `${Math.floor(seconds / 3600)} ${Math.floor(seconds / 3600) > 1 ? "hours" : "hour"}`;
    case seconds < 604800:
      return `${Math.floor(seconds / 86400)} ${Math.floor(seconds / 86400) > 1 ? "days" : "day"}`;
    case seconds < 2592000:
      return `${Math.floor(seconds / 604800)} ${Math.floor(seconds / 604800) > 1 ? "weeks" : "week"}`;
    case seconds < 31536000:
      return `${Math.floor(seconds / 2592000)} ${Math.floor(seconds / 2592000) > 1 ? "months" : "month"}`;
    case seconds >= 31536000:
      return `${Math.floor(seconds / 31536000)} ${Math.floor(seconds / 31536000) > 1 ? "years" : "year"}`;
    default:
      return "";
  }
};
