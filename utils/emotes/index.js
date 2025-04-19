import handleKickEmotes from "./kick";
import handle7TVEmotes from "./7tv";

const handleEmotes = (message) => {
  message = handleKickEmotes(message);
  // TODO: 7TV
  // message = handle7TVEmotes(message, SevenTVData);
  return message;
};

export default handleEmotes;
