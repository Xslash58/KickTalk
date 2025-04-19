const emotePatternRegex = /\[emote:(?<id>\d+):(?<name>\w+)\]/g;

const handleKickEmotes = (message) => {
  return message.replace(emotePatternRegex, (emote) => {
    try {
      const matches = [...emote.matchAll(emotePatternRegex)];

      matches
        .map((match) => {
          if (match && match.groups) {
            const { id } = match.groups;
            return `https://files.kick.com/emotes/${id}/fullsize`;
          }
        })
        .join("");
      return matches;
    } catch (error) {
      console.log(error);
    }
  });
};

export default handleKickEmotes;
